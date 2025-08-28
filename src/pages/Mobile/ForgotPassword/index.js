import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Form, Button, Checkbox, Input } from 'antd';
import HeaderMobile from '@/components/Mobile/Header';

function ForgotPassword(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mailCheck, setMailCheck] = useState(false);
  const [wrongEmailNotice, setWrongEmailNotice] = useState(false);

  const onSubmit = () => {
    form
      .validateFields(['email'])
      .then(async value => {
        if (!value.errorFields) {
          const payload = {
            data: {
              email: value.email,
            },
            removeLoading: () => {
              setWrongEmailNotice(true);
              setLoading(false);
            },
            showNotice: () => {
              setMailCheck(true);
            },
          };
          setLoading(true);
          await dispatch({ type: 'USER/sendMailResetPassword', payload });
        }
      })
      .catch(err => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.forgotPassword}>
      <HeaderMobile createEventType={true} />
      {mailCheck ? (
        <div>
          <h2>{formatMessage({ id: 'i18n_please_check_your_email' })}</h2>
        </div>
      ) : (
        <div className={styles.bodyContent}>
          <Form form={form}>
            <div className={styles.inputField}>
              <span>{formatMessage({ id: 'i18n_email_registed_label' })}</span>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'i18n_required_text' }),
                  },
                  {
                    type: 'email',
                    message: intl.formatMessage({
                      id: 'i18n_email_error_notice',
                    }),
                  },
                ]}
                name={'email'}
              >
                <Input
                  className={styles.inputField}
                  placeholder={'例) evergreen1129@smoothly.jp'}
                />
              </Form.Item>
              {wrongEmailNotice && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_email_not_existed' })}
                </span>
              )}
            </div>
            <div className={styles.inputField}>
              <span>{formatMessage({ id: 'i18n_set_password_label' })}</span>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'i18n_required_text' }),
                  },
                  {
                    type: 'password',
                    message: intl.formatMessage({
                      id: 'i18n_email_error_notice',
                    }),
                  },
                ]}
                name={'password'}
              >
                <Input
                  className={styles.inputField}
                  placeholder={'例) evergreen1129@smoothly.jp'}
                />
              </Form.Item>
              {wrongEmailNotice && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_email_not_existed' })}
                </span>
              )}
            </div>
            <div className={styles.inputField}>
              <span>
                {formatMessage({ id: 'i18n_set_password_confirm_label' })}
              </span>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'i18n_required_text' }),
                  },
                  {
                    type: 'password',
                    message: intl.formatMessage({
                      id: 'i18n_email_error_notice',
                    }),
                  },
                ]}
                name={'passwordConfirm'}
              >
                <Input
                  className={styles.inputField}
                  placeholder={'例) evergreen1129@smoothly.jp'}
                />
              </Form.Item>
              {wrongEmailNotice && (
                <span className={styles.errorNotice}>
                  {formatMessage({ id: 'i18n_email_not_existed' })}
                </span>
              )}
            </div>
            <div className={styles.btnZone}>
              <Form.Item>
                <Button
                  loading={loading}
                  htmlType="submit"
                  onClick={onSubmit}
                  className={styles.signUpBtn}
                >
                  {formatMessage({ id: 'i18n_reset' })}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}

export default connect(({ USER }) => ({
  userStore: USER,
}))(ForgotPassword);
