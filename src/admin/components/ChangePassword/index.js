import React, { useState } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, message } from 'antd';
import { useIntl } from 'umi';
import styles from './styles.less';

const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16, offset: 8 },
};
function ChangePassword(props) {
  const { visible, onClose, dispatch } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const handleSubmitForm = values => {
    const reqBody = {
      new_password: values.new_password,
      old_password: values.password,
    };
    dispatch({
      type: 'ADMIN/changePassword',
      payload: {
        reqBody,
        setLoading,
        message,
        formatMessage,
        onClose,
        resetFields: form.resetFields,
      },
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      title={formatMessage({ id: 'i18n_update_password' })}
      className={styles.container}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmitForm}>
        <Form.Item
          {...formItemLayout}
          name="password"
          requiredMark={true}
          label={formatMessage({ id: 'i18n_current_password' })}
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
          <Input.Password
            placeholder={formatMessage({ id: 'i18n_current_password' })}
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="new_password"
          label={formatMessage({ id: 'i18n_new_password' })}
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
          <Input.Password
            placeholder={formatMessage({ id: 'i18n_new_password' })}
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="confirm_password"
          dependencies={['new_password']}
          label={formatMessage({ id: 'i18n_confirm_password' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'i18n_required_text' }),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value && !value.trim()) {
                  return Promise.reject(
                    formatMessage({ id: 'i18n_required_text' }),
                  );
                }
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  formatMessage({ id: 'i18n_passwords_not_match' }),
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={formatMessage({ id: 'i18n_confirm_password' })}
          />
        </Form.Item>
        <Form.Item {...formTailLayout}>
          <Button
            htmlType="submit"
            className={`btn btnGreen btn-small ${styles.customButton}`}
            loading={loading}
          >
            {formatMessage({ id: 'i18n_change' })}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(
  ChangePassword,
);
