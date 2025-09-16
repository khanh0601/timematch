import { connect } from 'dva';
import { Button, Form, Input, Spin } from 'antd';
import styles from './styles.less';
import './stylesPc.less';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import config from '@/config';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import FooterMobile from '@/components/Mobile/Footer';
import { Link } from 'umi';
import HeaderMobile from '@/components/Mobile/Header';
import iconGoogle from '@/assets/images/google.png';
import iconClose from '@/assets/images/icon_Menu.svg';
import iconOffice from '@/assets/images/microsoft.png';
import iconLogoTimeMatch from '@/assets/images/logo.png';
import useIsMobile from '@/hooks/useIsMobile';
import ForgotPassword from '../ForgotPassword';
import { history } from 'umi';
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

  const isMobile = useIsMobile();
  const [isShowModal, setIsShowModal] = useState(false);

  const openModal = () => setIsShowModal(true);
  const closeModal = () => setIsShowModal(false);
  const GoogleLoginButton = () => {
    const handleGoogleAuth = useGoogleLogin({
      onSuccess: codeResponse => {
        console.log(codeResponse);
        const payload = {
          token: codeResponse.code,
          account_type: 0,
        };
        dispatch({ type: 'MASTER/googleLogin', payload });
      },
      onError: () => console.log('Login Failed'),
      flow: 'auth-code',
      scope:
        'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar',
    });

    return (
      <Button
        onClick={() => handleGoogleAuth()}
        className={`${styles.btnSocial} ${styles.borderMediumGray}`}
      >
        <img src={iconGoogle} alt={'Google'} />
        {formatMessage({ id: 'i18n_google_login' })}
      </Button>
    );
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
          }, 5000);
        }
      })
      .catch(err => err);
  };

  const inputFocus = e => {
    if (!isMobile) {
      return;
    }
    setBGFocus(true);
    setFocus1(true);
    setTypeInput1(true);
    inputRef1.current.input.selectionStart = inputRef1.current.input.selectionEnd =
      e.target.selectionStart + e.target.value.length;
  };

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
      <HeaderMobile
        title={formatMessage({ id: 'i18n_btn_login' })}
        primary={
          isMobile
            ? { bgColor: 'bgPrimaryBlue', textColor: 'textLightGray' }
            : undefined
        }
        showLogo={!isMobile}
      />
      <div className={styles.loginPageWrap}>
        <div className={styles.container}>
          <div className={styles.loginPageTab}>
            <div
              className={`${styles.loginPageTabItem} ${styles.active}`}
              onClick={() => {
                history.push('/login');
              }}
            >
              ログイン
            </div>
            <div
              className={`${styles.loginPageTabItem}`}
              onClick={() => {
                history.push('/register');
              }}
            >
              アカウント新規作成
            </div>
          </div>
          <div className={`${styles.signIn} login-page`}>
            <h1 className={styles.leftFormTitle}>ログイン</h1>
            <Form form={form} className={styles.formSignIn}>
              <div className={styles.leftForm}>
                <p className={`${styles.fieldName} ${styles.textDarkGray}`}>
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
                    className={`${styles.inputField} ${styles.borderMediumGray}`}
                    placeholder={'例) evergreen1129@timematch.jp'}
                    autoComplete="off"
                  />
                </Form.Item>

                <p
                  className={`${styles.fieldName} ${styles.textDarkGray}`}
                  style={{ paddingTop: '20px' }}
                >
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
                    } ${styles.borderMediumGray}`}
                    placeholder={'例) Password12'}
                    iconRender={visible => (visible ? visible : visible)}
                    onFocus={e => inputFocus(e)}
                    type={'password'}
                    ref={inputRef1}
                    autoComplete="off"
                  />
                </Form.Item>
                <Link
                  onClick={e => {
                    e.preventDefault();
                    openModal();
                  }}
                  className={`${styles.forgotPassword} ${styles.textDarkBlue}`}
                >
                  {formatMessage({ id: 'i18n_forgot_password_link' })}
                </Link>
                <div className={styles.btnZone}>
                  <Button
                    className={`${styles.signInBtn} `}
                    loading={loading}
                    htmlType="submit"
                    onClick={onSubmit}
                  >
                    {formatMessage({ id: 'i18n_login_btn' })}
                  </Button>
                </div>
                <div
                  className={`${styles.divider} ${styles.line} ${styles.oneLine}`}
                >
                  <span>{formatMessage({ id: 'i18n_status_or' })}</span>
                </div>
              </div>

              <div className={styles.rightForm}>
                <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_KEY}>
                  <GoogleLoginButton />
                </GoogleOAuthProvider>
                <Button
                  onClick={() => microsoftLogin(0)}
                  className={`${styles.btnSocial} ${styles.borderMediumGray}`}
                >
                  <img src={iconOffice} alt={'Microsoft'} />
                  {formatMessage({ id: 'i18n_microsoft_login' })}
                </Button>
                <div className={styles.registerHere}>
                  {formatMessage({ id: 'i18n_register_link' })}
                  <Link to={'/register'} className={styles.textDarkBlue}>
                    {formatMessage({ id: 'i18n_here' })}
                  </Link>
                </div>
              </div>
            </Form>
            <div className={styles.logo}>
              <img src={iconLogoTimeMatch} alt={'Logo Time Match'} />
            </div>
          </div>
        </div>
      </div>
      <FooterMobile />
      <div
        className={`${styles.modalPassword} ${
          isShowModal ? styles.active : ''
        } `}
      >
        <div className={styles.modalPasswordInner}>
          <div
            className={styles.modalPasswordClose}
            onClick={() => closeModal()}
            aria-label="Close"
          >
            <img src={iconClose} alt="icon Close" aria-hidden="true" />
          </div>
          <ForgotPassword />
        </div>
      </div>
    </Spin>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(LoginMobile);
