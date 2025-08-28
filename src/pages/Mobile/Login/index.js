import { connect } from 'dva';
import { Button, Form, Input, Spin, Checkbox } from 'antd';
import styles from './styles.less';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import config from '@/config';
import GoogleLogin from 'react-google-login';
import FooterMobile from '@/components/Mobile/Footer';
import { Link } from 'umi';
import CardLogin from '@/pages/Mobile/Login/components/CardLogin';

function LoginMobile(props) {
  const { dispatch, masterStore } = props;
  const { loginLoading } = masterStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [saveLogin, setSaveLogin] = useState(false);
  const [typeInput1, setTypeInput1] = useState(false);
  const [focus1, setFocus1] = useState(false);
  const [bgFocus, setBGFocus] = useState(false);
  const inputRef1 = useRef(null);

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

  const onCheck = event => {
    setSaveLogin(old => !old);
  };

  const onSubmit = () => {
    form
      .validateFields(['password', 'email', 'autoLogin'])
      .then(async value => {
        if (!value.errorFields) {
          const payload = {
            email: value.email,
            password: value.password,
            autoLogin: saveLogin,
          };
          setLoading(true);
          await dispatch({ type: 'USER/emailLogin', payload });
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }
      })
      .catch(err => err);
  };

  const inputFocus = e => {
    setBGFocus(true);
    setFocus1(true);
    setTypeInput1(true);
    inputRef1.current.input.selectionStart = inputRef1.current.input.selectionEnd =
      e.target.selectionStart + e.target.value.length;
  };

  const responseGoogle = googleResponse => {
    if (!googleResponse.error) {
      const payload = {
        token: googleResponse.code,
        account_type: localStorage.getItem('type') | 0,
      };
      dispatch({ type: 'MASTER/googleLogin', payload });
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
        dispatch({ type: 'MASTER/microsoftLogin', payload });
        localStorage.removeItem('code');
      }

      if (external?.closed || code) {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <Spin spinning={loginLoading}>
      <div className={styles.signIn}>
        <Form form={form}>
          <p className={styles.fieldName}>
            {formatMessage({ id: 'i18n_email' })}
          </p>
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
              autoComplete="on"
            />
          </Form.Item>

          <p className={styles.fieldName} style={{ paddingTop: '10px' }}>
            {formatMessage({ id: 'i18n_password' })}
          </p>
          <Form.Item
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'i18n_required_text' }),
              },
            ]}
            name={'password'}
          >
            <Input
              className={`${styles.inputField} ${
                focus1 ? styles.password : ''
              }`}
              placeholder={'例) Password12'}
              iconRender={visible => (visible ? visible : visible)}
              onFocus={e => inputFocus(e)}
              type={'password'}
              ref={inputRef1}
              autoComplete="on"
            />
          </Form.Item>
          <div className={styles.btnZone}>
            <Button
              className={styles.signInBtn}
              loading={loading}
              htmlType="submit"
              onClick={onSubmit}
            >
              {formatMessage({ id: 'i18n_login_btn' })}
            </Button>
          </div>
          <Form.Item rules={[]} name={'autoLogin'}>
            <div className={styles.checkerViet}>
              <Checkbox checked={saveLogin} onChange={event => onCheck(event)}>
                {formatMessage({ id: 'i18n_auto_login_then' })}
              </Checkbox>
            </div>
          </Form.Item>
          <div className={`${styles.divider} ${styles.line} ${styles.oneLine}`}>
            <span>{formatMessage({ id: 'i18n_status_or' })}</span>
          </div>
          <GoogleLogin
            clientId={config.GOOGLE_CLIENT_KEY}
            render={renderProps => (
              <div className={styles.main}>
                <div ref={scrollIntoCardPerson}>
                  <CardLogin
                    microsoftLogin={() => microsoftLogin(0)}
                    googleLogin={() => {
                      renderProps.onClick();
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
          <div className={styles.registerHere}>
            {formatMessage({ id: 'i18n_register_link' })}
            <Link to={'/register'}>{formatMessage({ id: 'i18n_here' })}</Link>
          </div>
        </Form>
      </div>
      <FooterMobile />
    </Spin>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(LoginMobile);
