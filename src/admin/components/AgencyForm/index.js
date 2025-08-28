import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useIntl } from 'umi';
import { DIRECT_SALES, AGENCY_SALES } from '@/constant';
import { connect } from 'dva';
import { patternNumber } from '@/constant';
import styles from './styles.less';

const { Option } = Select;
const AgencyForm = props => {
  const {
    dispatch,
    adminStore,
    agencyProp,
    formLayout,
    agencyClassName,
    inModal,
    renderButton,
    onClose,
  } = props;
  const { listAgency } = adminStore;
  const [form] = Form.useForm();
  const intl = useIntl();
  const { formatMessage } = intl;
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    if (agencyProp) {
      form.setFieldsValue({
        company: agencyProp.name,
        person_in_charge: agencyProp.owner_name,
        email: agencyProp.email,
        business_flow: Number(agencyProp.commercial_distribution),
        address: agencyProp.address,
        phone: agencyProp.phone,
        secondary_agency: agencyProp.secondary_agency_id,
        wholesale_price: agencyProp.wholesale_price,
        agent_selling_price: agencyProp.agent_selling_price,
      });
    }
  }, [agencyProp]);

  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: { span: 8 },
          wrapperCol: { span: 8 },
        }
      : null;

  const formTailLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: { span: 8 },
          wrapperCol: { span: 8, offset: 8 },
        }
      : null;

  const handleSubmitForm = values => {
    const reqBody = {
      name: values.company.trim(),
      owner_name: values.person_in_charge.trim(),
      email: values.email.trim(),
      commercial_distribution: values.business_flow,
      address: values.address.trim(),
      phone: values.phone,
    };
    if (values.secondary_agency) {
      reqBody.secondary_agency_id = values.secondary_agency;
    }
    if (values.wholesale_price) {
      reqBody.wholesale_price = values.wholesale_price;
    }
    if (values.agent_selling_price) {
      reqBody.agent_selling_price = values.agent_selling_price;
    }
    const props = {
      reqBody,
      setLoading: setLoadingButton,
      formatMessage,
      resetFields: form.resetFields,
    };
    if (agencyProp) {
      dispatch({
        type: 'ADMIN/updateAgency',
        payload: {
          id: agencyProp.id,
          ...props,
          onClose,
        },
      });
    } else {
      dispatch({
        type: 'ADMIN/createAgency',
        payload: {
          ...props,
        },
      });
    }
  };

  return (
    <Form
      requiredMark={true}
      onFinish={handleSubmitForm}
      colon={false}
      layout={formLayout}
      form={form}
      className={agencyClassName}
    >
      <Form.Item
        {...formItemLayout}
        name="company"
        label={formatMessage({ id: 'i18n_company_name' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'i18n_required_text' }),
          },
          () => ({
            async validator(_, value) {
              if (value && !value.trim()) {
                throw new Error(formatMessage({ id: 'i18n_required_text' }));
              }
            },
          }),
        ]}
      >
        <Input placeholder={formatMessage({ id: 'i18n_company_name' })} />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name="person_in_charge"
        label={formatMessage({ id: 'i18n_personal_in_charge' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'i18n_required_text' }),
          },
          () => ({
            async validator(_, value) {
              if (value && !value.trim()) {
                throw new Error(formatMessage({ id: 'i18n_required_text' }));
              }
            },
          }),
        ]}
      >
        <Input placeholder={formatMessage({ id: 'i18n_personal_in_charge' })} />
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
                throw new Error(formatMessage({ id: 'i18n_required_text' }));
              }
            },
          }),
        ]}
      >
        <Input placeholder={formatMessage({ id: 'i18n_email' })} />
      </Form.Item>
      {/* <Form.Item
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
      </Form.Item> */}
      <Form.Item
        {...formItemLayout}
        name="address"
        label={formatMessage({ id: 'i18n_street_address' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'i18n_required_text' }),
          },
          () => ({
            async validator(_, value) {
              if (value && !value.trim()) {
                throw new Error(formatMessage({ id: 'i18n_required_text' }));
              }
            },
          }),
        ]}
      >
        <Input placeholder={formatMessage({ id: 'i18n_street_address' })} />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name="phone"
        label={formatMessage({ id: 'i18n_phone_number' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'i18n_required_text' }),
          },
          () => ({
            async validator(_, value) {
              if (value && !value.trim()) {
                throw new Error(formatMessage({ id: 'i18n_required_text' }));
              }
            },
          }),
          {
            pattern: patternNumber,
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
        name="secondary_agency"
        label={formatMessage({ id: 'i18n_secondary_agency' })}
      >
        <Select
          showSearch
          placeholder={formatMessage({ id: 'i18n_secondary_agency' })}
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
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
        name="agent_selling_price"
        label={formatMessage({ id: 'i18n_agent_selling_price' })}
        // rules={[
        //   {
        //     pattern: patternNumber,
        //     message: formatMessage({
        //       id: 'i18n_invalid_price',
        //     }),
        //   },
        // ]}
      >
        <Input
          placeholder={formatMessage({ id: 'i18n_agent_selling_price' })}
        />
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        name="wholesale_price"
        label={formatMessage({ id: 'i18n_wholesale_price' })}
        // rules={[
        //   {
        //     pattern: patternNumber,
        //     message: formatMessage({
        //       id: 'i18n_invalid_price',
        //     }),
        //   },
        // ]}
      >
        <Input placeholder={formatMessage({ id: 'i18n_wholesale_price' })} />
      </Form.Item>
      <Form.Item {...formTailLayout} className={inModal ? styles.groupBtn : ''}>
        <Button
          loading={loadingButton}
          className="btn btnGreen btn-small"
          htmlType="submit"
        >
          {formatMessage({ id: 'i18n_registration' })}
        </Button>
        {renderButton && renderButton()}
      </Form.Item>
    </Form>
  );
};

export default connect(({ ADMIN }) => ({ adminStore: ADMIN }))(AgencyForm);
