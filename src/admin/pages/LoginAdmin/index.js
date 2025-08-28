import React, { useCallback, useState } from 'react';
import styles from './styles.less';
import { useIntl } from 'umi';
import { Form, Input, Button, Checkbox } from 'antd';
import imgLogo from '@/assets/images/logo.png';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'dva';

function LoginAdmin({ dispatch }) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [loading, setLoading] = useState(false);

  const onFinish = useCallback(
    values => {
      const payload = {
        formatMessage,
        setLoading,
        remember: values.remember,
        email: values.email,
        password: values.password,
      };
      dispatch({ type: 'ADMIN/adminLogin', payload });
    },
    [dispatch],
  );

  const onFinishFailed = errorInfo => {};

  return (
    <div className={styles.loginAdmin}>
      <div className={styles.laContainer}>
        <div className={styles.laContent}>
          <div className={styles.laTitle}>
            <img src={imgLogo} />
          </div>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={styles.laForm}
          >
            <div className={styles.laFormTitle}>
              {formatMessage({ id: 'i18n_login_admin_title' })}
            </div>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
                {
                  type: 'email',
                  message: formatMessage({
                    id: 'i18n_email_error_notice',
                  }),
                },
              ]}
            >
              <Input addonAfter={<MailOutlined />} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
              ]}
            >
              <Input.Password addonAfter={<LockOutlined />} />
            </Form.Item>

            <div className={styles.btnGroup}>
              <Form.Item
                name="remember"
                valuePropName="checked"
                className={styles.aa}
              >
                <Checkbox>
                  {formatMessage({ id: 'i18n_auto_login_then' })}
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  loading={loading}
                  disabled={loading}
                  type="primary"
                  htmlType="submit"
                >
                  {formatMessage({ id: 'i18n_btn_login' })}
                </Button>
              </Form.Item>
            </div>
            <a href="/forgot-password" className={styles.forgotPass}>
              {formatMessage({ id: 'i18n_if_forgot_pass_click_here' })}
            </a>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default connect(({ ADMIN }) => ({ adminStore: ADMIN }))(LoginAdmin);
