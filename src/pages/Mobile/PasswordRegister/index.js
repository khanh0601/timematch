import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Form, Button, Input } from 'antd';
import { passwordRegex } from '@/constant';
import HeaderMobile from '@/components/Mobile/Header';

function PasswordRegister(props) {
  const { dispatch, userStore } = props;
  const { verifySuccess } = userStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      history.location.query.token &&
      history.location.query.register_success
    ) {
      const payload = {
        token_verify: history.location.query.token,
      };
      dispatch({ type: 'USER/verifyRegisterApp', payload });
    } else {
      history.push('/register');
    }
  }, [history.location.query]);

  const onSubmit = () => {
    form
      .validateFields(['password', 'passwordConfirm'])
      .then(async value => {
        if (!value.errorFields) {
          const payload = {
            token_verify: history.location.query.token,
            password: value.password,
          };
          setLoading(true);
          await dispatch({ type: 'USER/registerPassword', payload });
        }
      })
      .catch(err => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.forgotPassword}>
      <HeaderMobile
        title={formatMessage({ id: 'i18n_password_register_title' })}
      />
      <div className={styles.bodyContent}>
        <Form form={form}>
          <div className={styles.inputField}>
            <span className={styles.textDarkGray}>
              {formatMessage({ id: 'i18n_email_registed_label' })}
            </span>
            <Form.Item name={'email'}>
              <Input
                className={`${styles.inputField} ${styles.borderMediumGray}`}
                placeholder={verifySuccess}
                disabled={true}
              />
            </Form.Item>
          </div>
          <div className={styles.inputField} style={{ marginTop: '10px' }}>
            <span className={styles.textDarkGray}>
              {formatMessage({ id: 'i18n_set_password_label' })}
            </span>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },

                () => ({
                  validator(rule, value) {
                    if (value && !passwordRegex.test(value)) {
                      return Promise.reject(
                        formatMessage({ id: 'i18n_wrong_password_length' }),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              name={'password'}
            >
              <Input
                className={`${styles.inputField} ${styles.borderMediumGray}`}
                placeholder={'例) Password12'}
                type={'password'}
              />
            </Form.Item>
          </div>
          <div className={styles.inputField} style={{ marginTop: '10px' }}>
            <span className={styles.textDarkGray}>
              {formatMessage({ id: 'i18n_set_password_confirm_label' })}
            </span>
            <Form.Item
              name={'passwordConfirm'}
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (value && value !== getFieldValue('password')) {
                      return Promise.reject(
                        formatMessage({ id: 'i18n_confirm_password_wrong' }),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input
                className={`${styles.inputField} ${styles.borderMediumGray}`}
                placeholder={'例) Password12'}
                type={'password'}
              />
            </Form.Item>
          </div>
          <div className={styles.btnZone}>
            <Form.Item>
              <Button
                loading={loading}
                htmlType="submit"
                onClick={onSubmit}
                className={`${styles.signUpBtn} ${styles.bgDarkBlue}`}
              >
                {formatMessage({ id: 'i18n_password_register_btn' })}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default connect(({ USER }) => ({
  userStore: USER,
}))(PasswordRegister);
