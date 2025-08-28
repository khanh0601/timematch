import { connect } from 'dva';
import { Button, Checkbox, Form, Input, Spin } from 'antd';
import styles from './styles.less';
import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { ACCOUNT_TYPE_BUSINESS } from '@/constant';
import { Link } from 'umi';
import config from '@/config';
import CardPerson from './components/CardPerson';
import GoogleLogin from 'react-google-login';
import { ACCOUNT_TYPE_PERSON } from '@/constant';

function Register(props) {
  const intl = useIntl();
  const { dispatch, masterStore } = props;
  const { registerLoading } = masterStore;
  const [form] = Form.useForm();
  const { formatMessage } = intl;
  const [loading, setLoading] = useState(true);
  const [savePolicy, setPolicy] = useState(false);
  const [remindTermComp, setRemindTermComp] = useState(false);
  const [remindTermPers, setRemindTermPers] = useState(false);
  const [termComp, setTermComp] = useState(false);
  const [termPers, settermPers] = useState(false);
  const [type, setType] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    });
  }, []);

  const onCheck = event => {
    setPolicy(old => !old);
  };

  const onSubmit = () => {
    form
      .validateFields(['name', 'companyName', 'role', 'email', 'privacyPolicy'])
      .then(async value => {
        if (!value.errorFields && savePolicy) {
          const payload = {
            account_type: ACCOUNT_TYPE_BUSINESS,
            name: value.name,
            company_name: value.companyName,
            role: value.role,
            email: value.email,
            privacy_policy: savePolicy,
          };
          setLoading(true);
          await dispatch({ type: 'USER/registerEmailApp', payload });
          setLoading(false);
        }
      })
      .catch(err => err);
  };

  const [isScrollIntoCardPerson, setIsScrollIntoCardPerson] = useState(false);

  const scrollIntoCardPerson = ref => {
    if (ref && isScrollIntoCardPerson === true) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsScrollIntoCardPerson(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const responseGoogle = googleResponse => {
    if (!googleResponse.error) {
      const payload = {
        token: googleResponse.code,
        account_type: type,
      };
      dispatch({ type: 'MASTER/googleSignUp', payload });
    }
  };

  const loginGoogleFailed = googleResponse => {};

  const microsoftLogin = async accountType => {
    const redirectUri =
      window.location.protocol +
      '//' +
      window.location.host +
      '/get-code-microsoft';
    const clientId = config.MICROSOFT_CLIENT_KEY;
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&scope=User.Read Calendars.Read Calendars.ReadWrite offline_access&response_type=code&redirect_uri=${redirectUri}&state=ClientStateGoesHere&prompt=login`;
    const external = window.open(
      url,
      '',
      'width=480,height=800,top=400,left=400',
    );
    localStorage.removeItem('code');
    const interval = setInterval(() => {
      const code = localStorage.getItem('code');
      if (code) {
        external?.close();
        const payload = {
          token: code,
          account_type: accountType,
        };
        dispatch({ type: 'MASTER/microsoftSignUp', payload });
        localStorage.removeItem('code');
      }

      if (external?.closed || code) {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.signUp}>
        <div className={styles.bodyContent}>
          <Form form={form}>
            <div className={styles.inputField}>
              <div className={styles.fieldLabel}>
                {formatMessage({ id: 'i18n_fullname' })}
                <span className={styles.inputRequired}>
                  【{formatMessage({ id: 'i18n_required' })}】
                </span>
              </div>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'i18n_required_text' }),
                  },
                  {
                    type: 'text',
                    message: intl.formatMessage({
                      id: 'i18n_email_error_notice',
                    }),
                  },
                ]}
                name={'name'}
              >
                <Input
                  className={styles.inputField}
                  placeholder={''}
                  autoComplete="on"
                />
              </Form.Item>
            </div>
            <div className={styles.inputField}>
              <div className={styles.fieldLabel}>
                {formatMessage({ id: 'i18n_company_name' })}
              </div>
              <Form.Item name={'companyName'}>
                <Input
                  className={styles.inputField}
                  placeholder={''}
                  autoComplete="on"
                />
              </Form.Item>
            </div>
            <div className={styles.inputField}>
              <div className={styles.fieldLabel}>
                {formatMessage({ id: 'i18n_role' })}
              </div>
              <Form.Item name={'role'}>
                <Input
                  className={styles.inputField}
                  placeholder={''}
                  autoComplete="on"
                />
              </Form.Item>
            </div>
            <div className={styles.inputField}>
              <div className={styles.fieldLabel}>
                {formatMessage({ id: 'i18n_email_register' })}
                <span className={styles.inputRequired}>
                  【{formatMessage({ id: 'i18n_required' })}】
                </span>
              </div>
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
                  {
                    pattern: new RegExp(
                      '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$',
                    ),
                    message: formatMessage({ id: 'i18n_email_error_notice' }),
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (savePolicy) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        formatMessage({ id: 'i18n_required_text' }),
                      );
                    },
                  }),
                ]}
                name={'email'}
              >
                <Input
                  className={styles.inputField}
                  placeholder={''}
                  autoComplete="on"
                />
              </Form.Item>
            </div>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
              ]}
              name={'privacyPolicy'}
            >
              <div className={styles.checkerViet}>
                <Checkbox
                  checked={savePolicy}
                  onChange={event => onCheck(event)}
                >
                  <Link to={'/term-of-user'}>
                    {formatMessage({ id: 'i18n_privacy_policy_register' })}
                  </Link>
                  {formatMessage({ id: 'i18n_privacy_policy_1_register' })}
                </Checkbox>
              </div>
            </Form.Item>
            <div className={styles.btnZone}>
              <Button
                className={styles.signUpBtn}
                loading={loading}
                htmlType="submit"
                onClick={onSubmit}
              >
                {formatMessage({ id: 'i18n_btn_register' })}
              </Button>
            </div>
          </Form>
          <GoogleLogin
            clientId={config.GOOGLE_CLIENT_KEY}
            render={renderProps => (
              <div className={styles.main}>
                <div ref={scrollIntoCardPerson}>
                  <CardPerson
                    acceptTerm={termPers}
                    remindAcceptTerm={remindTermPers}
                    setRemindAcceptTerm={setRemindTermPers}
                    microsoftLogin={() => microsoftLogin(ACCOUNT_TYPE_PERSON)}
                    googleLogin={renderProps.onClick}
                    onCheck={() => {
                      setType(ACCOUNT_TYPE_PERSON);
                      settermPers(old => !old);
                    }}
                  />
                </div>
              </div>
            )}
            onSuccess={responseGoogle}
            onFailure={loginGoogleFailed}
            cookiePolicy={'single_host_origin'}
            scope={
              'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar'
            }
            accessType={'offline'}
            responseType={'code'}
            approvalPrompt={'force'}
            prompt={'consent'}
          />
        </div>
      </div>
    </Spin>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(Register);
