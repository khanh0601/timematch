import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Spin,
  ConfigProvider,
} from 'antd';
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
  FULL_DATE_HOUR,
  YYYYMMDD,
} from '@/constant';
import styles from './styles.less';
import { connect } from 'dva';
import jaJP from 'antd/lib/locale/ja_JP';
import moment from 'moment';
import ModalUploadCsv from './ModalUploadCsv';

const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8, offset: 8 },
};

const AddNewAccount = props => {
  const { dispatch, adminStore } = props;
  const { listAgency } = adminStore;
  const [form] = Form.useForm();
  const intl = useIntl();
  const { formatMessage } = intl;
  const [loading, setLoading] = useState(false);
  const [loadingCreateBtn, setLoadingCreateBtn] = useState(false);
  const [visibleUploadCsv, setVisibleUploadCsv] = useState(false);

  useEffect(() => {
    dispatch({ type: 'ADMIN/getListAgency', payload: { setLoading } });
  }, [dispatch]);

  const handleSubmitForm = values => {
    const reqBody = {
      users: [
        {
          name: values.name,
          company: values.company,
          email: values.email,
          address: values.address,
          phone: values.phone,
          trial_start_at: values.free_period_start.format(FULL_DATE_HOUR),
          trial_end_at: values.free_period_end.format(FULL_DATE_HOUR),
          agency_id: values.agency_in_case,
          m_contract_id: values.contract_type,
          role_type: values.role_type,
          price: values.amount,
          commercial_distribution: values.business_flow,
          type_payment: values.payment_method,
        },
      ],
    };
    dispatch({
      type: 'ADMIN/createAccount',
      payload: {
        reqBody,
        formatMessage,
        setLoading: setLoadingCreateBtn,
        resetFields: form.resetFields,
      },
    });
  };

  const handleChangeAmount = e => {
    const { value } = e.target;
    form.setFields([
      {
        name: 'amount',
        value: value.replace(/[^0-9]/g, ''),
      },
    ]);
  };

  const handleSelectStartTrial = value => {
    if (value) {
      const endTime = moment(value).add(13, 'days');
      form.setFields([
        {
          name: 'free_period_end',
          value: endTime,
        },
      ]);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          {formatMessage({ id: 'i18n_add_new' })}
        </div>
        <Button
          onClick={() => setVisibleUploadCsv(true)}
          className="btn btnGreen btn-small csvButton"
        >
          CSV一括 登録
        </Button>
      </div>
      <Spin spinning={loading} size="large">
        <ConfigProvider locale={jaJP}>
          <Form
            requiredMark={true}
            onFinish={handleSubmitForm}
            colon={false}
            form={form}
          >
            <Form.Item
              {...formItemLayout}
              name="company"
              label={formatMessage({ id: 'i18n_company_name' })}
            >
              <Input placeholder={formatMessage({ id: 'i18n_company_name' })} />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              name="name"
              label={formatMessage({ id: 'i18n_employee_name' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
                () => ({
                  async validator(_, value) {
                    if (value && !value.trim()) {
                      throw new Error(
                        formatMessage({ id: 'i18n_required_text' }),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input
                placeholder={formatMessage({ id: 'i18n_employee_name' })}
              />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              name="payment_method"
              label={formatMessage({ id: 'i18n_payment_method' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
              ]}
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
              {...formItemLayout}
              name="email"
              label={formatMessage({ id: 'i18n_email' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
                {
                  type: 'email',
                  message: formatMessage({ id: 'i18n_invalid_email' }),
                },
                () => ({
                  async validator(_, value) {
                    if (value && !value.trim()) {
                      throw new Error(
                        formatMessage({ id: 'i18n_required_text' }),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input placeholder={formatMessage({ id: 'i18n_email' })} />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              name="free_period_start"
              label={formatMessage({ id: 'i18n_free_period_start' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
              ]}
            >
              <DatePicker
                onSelect={handleSelectStartTrial}
                placeholder={formatMessage({ id: 'i18n_free_period_start' })}
                format={YYYYMMDD}
                dropdownClassName={styles.selectDatePicker}
                showNow={false}
              />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              name="free_period_end"
              label={formatMessage({ id: 'i18n_free_period_end' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue('free_period_start').valueOf() <
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
                dropdownClassName={styles.selectDatePicker}
                format={YYYYMMDD}
                showNow={false}
              />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              name="business_flow"
              label={formatMessage({ id: 'i18n_business_flow' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_select_field' }),
                },
              ]}
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
              {...formItemLayout}
              name="agency_in_case"
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
              >
                {listAgency.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              name="address"
              label={formatMessage({ id: 'i18n_street_address' })}
            >
              <Input
                placeholder={formatMessage({ id: 'i18n_street_address' })}
              />
            </Form.Item>

            <Form.Item
              {...formItemLayout}
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
              {...formItemLayout}
              name="role_type"
              label={formatMessage({ id: 'i18n_authority_type' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_select_field' }),
                },
              ]}
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
              {...formItemLayout}
              name="contract_type"
              label={formatMessage({ id: 'i18n_contract_type' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_select_field' }),
                },
              ]}
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
              {...formItemLayout}
              name="amount"
              label={formatMessage({ id: 'i18n_amount' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
              ]}
            >
              <Input
                onChange={handleChangeAmount}
                placeholder={formatMessage({ id: 'i18n_amount' })}
              />
            </Form.Item>

            <Form.Item {...formTailLayout}>
              <Button
                loading={loadingCreateBtn}
                className="btn btnGreen btn-small createBtn"
                htmlType="submit"
              >
                {formatMessage({ id: 'i18n_registration' })}
              </Button>
            </Form.Item>
          </Form>
          <ModalUploadCsv
            visible={visibleUploadCsv}
            onCancel={() => setVisibleUploadCsv(false)}
          />
        </ConfigProvider>
      </Spin>
    </div>
  );
};

export default connect(({ ADMIN }) => ({ adminStore: ADMIN }))(AddNewAccount);
