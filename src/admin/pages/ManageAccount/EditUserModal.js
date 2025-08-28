import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import { useIntl } from 'umi';
import {
  TYPE_CREDIT,
  TYPE_INVOICE,
  ROLE_MANAGER,
  ROLE_MEMBER,
  CONTRACT_BY_MONTH,
  CONTRACT_BY_YEAR,
  DIRECT_SALES,
  AGENCY_SALES,
  FORMAT_DATE,
  PAYMENT_TAX,
} from '@/constant';
import { connect } from 'dva';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

function EditUserModal({ visible, onCancel, adminStore, record, saveData }) {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { formatMessage } = intl;
  const { listAgency } = adminStore;
  const [agencyId, setAgencyId] = useState(undefined);

  useEffect(() => {
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
      price: record.price ? record.price / record.quantity : '',
      email: record.email || record.google_email || record.microsoft_email,
    });
  }, [record, visible]);

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
    const convertValues = values.entries();
    if (convertValues.every(v => !v[1])) {
      form.setFields([
        {
          name: 'name',
          error: [formatMessage({ id: 'i18n_required_text' })],
        },
        {
          name: 'email',
          error: [formatMessage({ id: 'i18n_required_text' })],
        },
        {
          name: 'trial_start_at',
          error: [formatMessage({ id: 'i18n_required_text' })],
        },
      ]);
    } else {
      const agency = listAgency.find(item => item.id === values.agency_id);
      const agency_name = agency ? agency.name : '';
      saveData({ ...record, ...values, agency_name });
      onCancel();
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
      onCancel={() => {
        onCancel();
      }}
      okButtonProps={{ form: 'edit-user-form', htmlType: 'submit' }}
    >
      <Form
        onFinish={handleSubmitForm}
        id="edit-user-form"
        colon={false}
        layout="vertical"
        form={form}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="company"
              label={formatMessage({ id: 'i18n_company_name' })}
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
              label={formatMessage({ id: 'i18n_street_address' })}
            >
              <Input
                placeholder={formatMessage({ id: 'i18n_street_address' })}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={formatMessage({ id: 'i18n_phone_number' })}
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
              label={formatMessage({ id: 'i18n_amount' })}
            >
              <Input
                // disabled={record.type_payment === TYPE_CREDIT}
                onChange={handleChangeAmount}
                placeholder={formatMessage({ id: 'i18n_amount' })}
              />
            </Form.Item>

            <Form.Item
              name="agency_id"
              label={formatMessage({ id: 'i18n_agency_in_case' })}
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
              >
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
                <Option value={ROLE_MEMBER}>
                  {formatMessage({ id: 'i18n_member' })}
                </Option>
                <Option value={ROLE_MANAGER}>
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
                allowClear
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
              label={formatMessage({ id: 'i18n_business_flow' })}
            >
              <Select placeholder={formatMessage({ id: 'i18n_business_flow' })}>
                {!agencyId && (
                  <Option value={DIRECT_SALES}>
                    {formatMessage({ id: 'i18n_direct_sales' })}
                  </Option>
                )}
                <Option value={AGENCY_SALES}>
                  {formatMessage({ id: 'i18n_agency_sales' })}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="trial_start_at"
              label={formatMessage({ id: 'i18n_free_period_start' })}
            >
              <DatePicker
                placeholder={formatMessage({ id: 'i18n_free_period_start' })}
                format={FORMAT_DATE}
                showNow={false}
              />
            </Form.Item>

            <Form.Item
              name="trial_end_at"
              label={formatMessage({ id: 'i18n_free_period_end' })}
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
