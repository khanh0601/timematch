import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Form, Button, Input, Spin } from 'antd';
import HeaderMobile from '@/components/Mobile/Header';
import { passwordRegex } from '@/constant';
import { notify } from '../../../commons/function';

function ResetPassword(props) {
  const { dispatch } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (history.location.query.token) {
      const payload = {
        token: history.location.query.token,
        removeLoading: () => {
          notify(formatMessage({ id: 'i18n_token_invalid_or_expired' }));
          history.push('/login');
        },
        showNotice: data => {
          setData(data);
        },
      };
      dispatch({ type: 'USER/resetPasswordVerify', payload });
    } else {
      history.push('/login');
    }
  }, [history.location.query]);

  const onSubmit = async value => {
    const payload = {
      data: {
        token: history.location.query.token,
        password: value.password,
      },
      removeLoading: () => {
        setLoading(true);
        notify(formatMessage({ id: 'i18n_reset_password_error' }));
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      },
      showNotice: () => {
        setLoading(true);
        notify(
          formatMessage({ id: 'i18n_reset_password_success' }),
          'bgWhite',
          'success',
        );
        setTimeout(() => {
          setLoading(false);
          history.push('/login');
        }, 3000);
      },
    };
    setLoading(true);
    await dispatch({ type: 'USER/resetPasswordMobile', payload });
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div className={styles.resetPassword}>
      <HeaderMobile
        createEventType={true}
        title={formatMessage({ id: 'i18n_reset_password' })}
        isShowBack={true}
      />
      <Spin spinning={loading}>
        <div className={styles.bodyContent}>
          <Form onFinish={onSubmit} form={form}>
            <div className={styles.inputField}>
              <span className={`${styles.fieldLabel} ${styles.textDarkGray}`}>
                {formatMessage({ id: 'i18n_email_register' })}
              </span>
              <Form.Item name={'email'}>
                <Input
                  className={`${styles.inputField} ${styles.borderMediumGray}`}
                  placeholder={data.body?.data}
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className={styles.inputField}>
              <span className={`${styles.fieldLabel} ${styles.textDarkGray}`}>
                {formatMessage({ id: 'i18n_password' })}
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
                          formatMessage({
                            id: 'i18n_wrong_password_length',
                          }),
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                name={'password'}
              >
                <Input
                  type={'password'}
                  className={`${styles.inputField} ${styles.borderMediumGray}`}
                  placeholder={'例) Password12'}
                />
              </Form.Item>
            </div>
            <div className={styles.inputField}>
              <span className={`${styles.fieldLabel} ${styles.textDarkGray}`}>
                {formatMessage({ id: 'i18n_confirm_password' })}
              </span>
              <Form.Item
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
                name={'password_confirm'}
              >
                <Input
                  type={'password'}
                  className={`${styles.inputField} ${styles.borderMediumGray}`}
                  placeholder={'例) Password12'}
                />
              </Form.Item>
            </div>
            <div className={styles.btnZone}>
              <Form.Item>
                <Button
                  loading={loading}
                  htmlType="submit"
                  className={`${styles.signUpBtn} ${styles.bgDarkBlue} btn-pc-primary`}
                >
                  {formatMessage({ id: 'i18n_clear' })}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Spin>
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(ResetPassword);
