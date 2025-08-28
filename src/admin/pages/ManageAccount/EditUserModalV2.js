import React, { useEffect, useState } from 'react';
import {
  Modal,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Button,
} from 'antd';
import { useDispatch, useIntl } from 'umi';
import {
  TYPE_CREDIT,
  TYPE_INVOICE,
  ROLE_MEMBER_CLIENT,
  ROLE_MANAGER_CLIENT,
  CONTRACT_BY_TRIAL,
  CONTRACT_BY_MONTH,
  CONTRACT_BY_YEAR,
  DIRECT_SALES,
  AGENCY_SALES,
  FORMAT_DATE,
  FULL_DATE_HOUR,
} from '@/constant';
import { connect } from 'dva';
import moment from 'moment';
import { checkValidToUpdate } from './service';

const { Option } = Select;
const { RangePicker } = DatePicker;

function EditUserModal({
  visible,
  onCancel,
  adminStore,
  record,
  onUpdateUsers,
}) {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { formatMessage } = intl;
  const { listAgency } = adminStore;
  const [agencyId, setAgencyId] = useState(undefined);
  const [isUpdateAll, setIsUpdateAll] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [trailDisabled, setTrailDisabled] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    handleDisableSlotFee(record.contract_type);
    setButtonDisabled(false);
    form.setFieldsValue({
      ...record,
      trial_end_at: record.trial_end_at
        ? moment(record.trial_end_at)
        : undefined,
      trial_start_at: record.trial_start_at
        ? moment(record.trial_start_at)
        : undefined,
      member_period:
        record.start_time && record.end_time
          ? [moment.unix(record.start_time), moment.unix(record.end_time)]
          : [undefined, undefined],
      price: record.price ?? '',
      email: record.email || record.google_email || record.microsoft_email,
      role_type:
        record.role_type === 0 || record.role_type === 1
          ? record.role_type + 1
          : null,
    });
  }, [record, visible]);

  const dispatch = useDispatch();
  const checkContractExists = (contract_type, user_email) => {
    const reqBody = {
      contract_type: contract_type,
      user_email: user_email,
    };
    return dispatch({
      type: 'ADMIN/checkContractExists',
      payload: { reqBody },
    });
  };

  const handleDisableSlotFee = contract_type => {
    setDisabled(contract_type === CONTRACT_BY_TRIAL);
    setTrailDisabled(contract_type !== CONTRACT_BY_TRIAL);
  };

  const handleDisable = (slot_fee, trail, button) => {
    setDisabled(slot_fee);
    setTrailDisabled(trail);
    setButtonDisabled(button);
  };

  const handleChangeContractType = async (value, record) => {
    const oldRecord = {
      contract_type: record.contract_type,
      price: record.price,
      start_time: record.start_time,
      end_time: record.end_time,
    };
    let data = {};
    if (oldRecord.contract_type === value) {
      handleDisableSlotFee(oldRecord.contract_type);
      setButtonDisabled(false);
      data = {
        price: oldRecord.price,
        member_period:
          oldRecord.start_time && oldRecord.end_time
            ? [
                moment.unix(oldRecord.start_time),
                moment.unix(oldRecord.end_time),
              ]
            : [undefined, undefined],
      };
    } else {
      if (value === CONTRACT_BY_TRIAL) {
        data = {
          price: null,
          member_period: [undefined, undefined],
        };
        handleDisable(true, false, false);
      } else {
        const res = await checkContractExists(value, record.member_email);
        if (res) {
          data = {
            price: res.price,
            member_period: [
              moment.unix(res.start_time),
              moment.unix(res.end_time),
            ],
          };
          handleDisable(false, true, false);
        } else {
          data = {
            price: null,
            member_period: [undefined, undefined],
          };
          handleDisable(true, true, true);
        }
      }
    }
    form.setFieldsValue(data);
  };

  const handleChangeAmount = e => {
    const { value } = e.target;
    form.setFields([
      {
        name: 'price',
        value: value.replace(/[^0-9]/g, ''),
      },
    ]);
  };

  const handleSubmitForm = values => {
    let formValid = checkValidToUpdate(record, values);
    const {
      type_payment,
      contract_type,
      member_period,
      role_type,
      price,
    } = values;
    const objToCheck = {
      type_payment,
      contract_type,
      member_period: !(type_payment === TYPE_INVOICE && !member_period[0]),
      role_type,
      price,
    };
    if (!formValid) {
      const arrayErrors = [];

      for (const key in objToCheck) {
        if (!objToCheck[key]) {
          arrayErrors.push({
            name: key,
            errors: [formatMessage({ id: 'i18n_required_text' })],
          });
        }
      }
      form.setFields(arrayErrors);
    } else {
      const agency = listAgency.find(item => item.id === values.agency_id);
      const agency_name = agency ? agency.name : '';
      const rowUpdate = { ...record, ...values, agency_name };
      if (values.role_type) {
        rowUpdate.role_type = values.role_type - 1;
      }
      if (values.member_period && values.member_period[0]) {
        rowUpdate.start_time = values.member_period[0].unix();
        rowUpdate.end_time = values.member_period[1].unix();
      }
      if (!values.type_payment) {
        rowUpdate.type_payment = TYPE_INVOICE;
      }
      const dataUpdate = {};
      for (const key in selectedValue) {
        if (selectedValue[key]) {
          dataUpdate[key] = values[key];
        }
      }
      onUpdateUsers(rowUpdate, dataUpdate, isUpdateAll);
      onCancel();
    }
  };

  const handleSelectItem = (name, event) => {
    setSelectedValue(prev => ({ ...prev, [name]: event.target.checked }));
  };

  const handleFieldsChange = field => {
    if (field[0]) {
      const { name } = field[0];
      form.setFields([
        {
          name,
          errors: [],
        },
      ]);
    }
  };

  return (
    <Modal
      forceRender={true}
      destroyOnClose={false}
      closable={false}
      maskClosable={false}
      wrapClassName="editUserModal"
      visible={visible}
      footer={[
        <Checkbox
          disabled
          key="updateAll"
          checked={isUpdateAll}
          onChange={event => setIsUpdateAll(event.target.checked)}
        >
          {formatMessage({ id: 'i18n_update_all' })}
        </Checkbox>,
        <div key="groupBtn">
          <Button
            onClick={() => {
              setSelectedValue({});
              setIsUpdateAll(false);
              onCancel();
            }}
          >
            {formatMessage({ id: 'i18n_cancel' })}
          </Button>
          <Button
            htmlType="submit"
            form="edit-user-form"
            type="primary"
            disabled={buttonDisabled}
          >
            {formatMessage({ id: 'i18n_ok_button' })}
          </Button>
        </div>,
      ]}
    >
      <Form
        onFinish={handleSubmitForm}
        id="edit-user-form"
        colon={false}
        layout="vertical"
        form={form}
        onFieldsChange={handleFieldsChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="company"
              label={
                <span>
                  {formatMessage({ id: 'i18n_company_name' })}
                  <Checkbox
                    disabled
                    checked={selectedValue.company}
                    onChange={value => handleSelectItem('company', value)}
                  />
                </span>
              }
            >
              <Input placeholder={formatMessage({ id: 'i18n_company_name' })} />
            </Form.Item>

            <Form.Item
              name="name"
              label={formatMessage({ id: 'i18n_employee_name' })}
            >
              <Input
                placeholder={formatMessage({ id: 'i18n_employee_name' })}
              />
            </Form.Item>

            <Form.Item name="email" label={formatMessage({ id: 'i18n_email' })}>
              <Input placeholder={formatMessage({ id: 'i18n_email' })} />
            </Form.Item>

            <Form.Item
              name="address"
              label={
                <span>
                  {formatMessage({ id: 'i18n_street_address' })}
                  <Checkbox
                    disabled
                    checked={selectedValue.address}
                    onChange={value => handleSelectItem('address', value)}
                  />
                </span>
              }
            >
              <Input
                placeholder={formatMessage({ id: 'i18n_street_address' })}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <span>
                  {formatMessage({ id: 'i18n_phone_number' })}
                  <Checkbox
                    disabled
                    checked={selectedValue.phone}
                    onChange={value => handleSelectItem('phone', value)}
                  />
                </span>
              }
              rules={[
                {
                  pattern: '^[0-9]*$',
                  message: formatMessage({
                    id: 'i18n_invalid_phone_number',
                  }),
                },
              ]}
            >
              <Input placeholder={formatMessage({ id: 'i18n_phone_number' })} />
            </Form.Item>

            <Form.Item
              name="price"
              label={
                <span>
                  {formatMessage({ id: 'i18n_amount' })}{' '}
                  <Checkbox
                    disabled
                    checked={selectedValue.price}
                    onChange={value => handleSelectItem('price', value)}
                  />
                </span>
              }
            >
              <Input
                disabled={disabled}
                // disabled={record.type_payment === TYPE_CREDIT}
                onChange={handleChangeAmount}
                placeholder={formatMessage({ id: 'i18n_amount' })}
              />
            </Form.Item>

            <Form.Item
              name="agency_id"
              label={
                <span>
                  {formatMessage({ id: 'i18n_agency_in_case' })}{' '}
                  <Checkbox
                    disabled
                    checked={selectedValue.agency_id}
                    onChange={value => handleSelectItem('agency_id', value)}
                  />
                </span>
              }
            >
              <Select
                placeholder={formatMessage({ id: 'i18n_agency_in_case' })}
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                showSearch
                onChange={setAgencyId}
              >
                {listAgency.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="contract_type"
              label={formatMessage({ id: 'i18n_contract_type' })}
            >
              <Select
                placeholder={formatMessage({ id: 'i18n_authority_type' })}
                onChange={value => handleChangeContractType(value, record)}
              >
                <Option value={CONTRACT_BY_TRIAL}>
                  {formatMessage({ id: 'i18n_by_trial' })}
                </Option>
                <Option value={CONTRACT_BY_MONTH}>
                  {formatMessage({ id: 'i18n_by_month' })}
                </Option>
                <Option value={CONTRACT_BY_YEAR}>
                  {formatMessage({ id: 'i18n_by_year' })}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="role_type"
              label={formatMessage({ id: 'i18n_authority_type' })}
            >
              <Select
                placeholder={formatMessage({ id: 'i18n_authority_type' })}
              >
                <Option value={ROLE_MEMBER_CLIENT}>
                  {formatMessage({ id: 'i18n_member' })}
                </Option>
                <Option value={ROLE_MANAGER_CLIENT}>
                  {formatMessage({ id: 'i18n_manager' })}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="type_payment"
              label={formatMessage({ id: 'i18n_payment_method' })}
            >
              <Select
                placeholder={formatMessage({ id: 'i18n_payment_method' })}
              >
                <Option value={TYPE_INVOICE}>
                  {formatMessage({ id: 'i18n_invoice' })}
                </Option>
                <Option value={TYPE_CREDIT}>
                  {formatMessage({ id: 'i18n_credit_card' })}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="commercial_distribution"
              label={
                <span>
                  {formatMessage({ id: 'i18n_business_flow' })}{' '}
                  <Checkbox
                    disabled
                    checked={selectedValue.commercial_distribution}
                    onChange={value =>
                      handleSelectItem('commercial_distribution', value)
                    }
                  />
                </span>
              }
            >
              <Select placeholder={formatMessage({ id: 'i18n_business_flow' })}>
                <Option value={DIRECT_SALES}>
                  {formatMessage({ id: 'i18n_direct_sales' })}
                </Option>
                <Option value={AGENCY_SALES}>
                  {formatMessage({ id: 'i18n_agency_sales' })}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="trial_start_at"
              label={
                <span>
                  {formatMessage({ id: 'i18n_free_period_start' })}{' '}
                  <Checkbox
                    disabled
                    checked={selectedValue.trial_start_at}
                    onChange={value =>
                      handleSelectItem('trial_start_at', value)
                    }
                  />
                </span>
              }
            >
              <DatePicker
                disabled={trailDisabled}
                placeholder={formatMessage({ id: 'i18n_free_period_start' })}
                format={FORMAT_DATE}
                showNow={false}
              />
            </Form.Item>

            <Form.Item
              name="trial_end_at"
              label={
                <span>
                  {formatMessage({ id: 'i18n_free_period_end' })}{' '}
                  {/* <Checkbox
                    checked={selectedValue.trial_end_at}
                    onChange={value => handleSelectItem('trial_end_at', value)}
                  /> */}
                </span>
              }
              dependencies={['trial_start_at']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue('trial_start_at').valueOf() <
                        value.valueOf()
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      formatMessage({ id: 'i18n_invalid_free_period_end' }),
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                disabled={trailDisabled}
                placeholder={formatMessage({ id: 'i18n_free_period_end' })}
                format={FORMAT_DATE}
                showNow={false}
              />
            </Form.Item>

            <Form.Item
              name="member_period"
              className="rangeDate"
              label={formatMessage({ id: 'i18n_paid_membership_period' })}
            >
              <RangePicker
                // disabled={record.type_payment === TYPE_CREDIT}
                disabled={disabled}
                placeholder={[
                  formatMessage({ id: 'i18n_start_time_placeholder' }),
                  formatMessage({ id: 'i18n_end_time_placeholder' }),
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default connect(({ ADMIN }) => ({ adminStore: ADMIN }))(EditUserModal);
