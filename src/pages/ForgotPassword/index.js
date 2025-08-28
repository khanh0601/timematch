import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Form, Button, Checkbox, Input } from 'antd';

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
      <Header headerLogin={true} />
      {mailCheck ? (
        <div>
          <h2>{formatMessage({ id: 'i18n_please_check_your_email' })}</h2>
        </div>
      ) : (
        <div className={styles.bodyContent}>
          <Form form={form}>
            <div className={styles.headTitle}>
              <div className={styles.bolderIcon}></div>
              <div className={styles.titleIcon}></div>
              <span>{formatMessage({ id: 'i18n_reset_password' })}</span>
            </div>
            <p className={styles.intruction}>
              {formatMessage({ id: 'i18n_please_fill_info' })}
            </p>
            <div className={styles.inputField}>
              <span>{formatMessage({ id: 'i18n_email' })}</span>
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
      <Footer />
    </div>
  );
}

export default connect(({ USER }) => ({
  userStore: USER,
}))(ForgotPassword);
