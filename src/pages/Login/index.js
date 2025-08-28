import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl } from 'umi';
import { Spin } from 'antd';
import { connect } from 'dva';
import GoogleLogin from 'react-google-login';
import { Modal } from 'antd';

import Footer from '@/components/Footer';
import config from '@/config';
import { ACCOUNT_TYPE_BUSINESS, ACCOUNT_TYPE_PERSON } from '@/constant';

import CardCompany from './components/CardCompany';
import CardPerson from './components/CardPerson';
import useWindowDimensions from '@/commons/useWindowDimensions';
import logoImage from '@/assets/images/logoHead.png';

function Login(props) {
  const { dispatch, masterStore } = props;
  const { loginLoading } = masterStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [type, setType] = useState(ACCOUNT_TYPE_PERSON);
  const { width } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState(false);

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
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const safari = /safari/.test(userAgent);
    const ios = /iphone|ipod|ipad/.test(userAgent);
    if (ios && !safari) {
      setIsModalVisible(true);
    }
  }, []);

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
  return (
    <>
      {isModalVisible ? (
        <div className={styles.safari}>
          <div className={styles.safariLogo}>
            <img src={logoImage} />
          </div>
          <div className={styles.bigText}>
            申し訳ありませんが、
            <br />
            このブラウザではご利用いただけません
          </div>
          <div className={styles.smallText}>
            下記のURLをコピーの上、お使いのスマホの
            <br />
            ブラウザ（Safari,Chrome）など
            <br /> でアクセスください。
          </div>
          <div className={styles.link}>
            <p>
              ■Smoothly 新規登録URL <br />{' '}
              <a href="https://smoothly.jp/registration">
                https://smoothly.jp/registration
              </a>
            </p>
            <p>
              ■Smoothly ログインURL
              <br />
              <a href="https://smoothly.jp/login">https://smoothly.jp/login</a>
            </p>
          </div>
          <Footer />
        </div>
      ) : (
        <Spin spinning={loginLoading}>
          <div className={styles.login}>
            <div className={styles.loginHeader}>
              <div className={styles.eventTitle}>
                <div className={styles.titleIcon}>
                  <div className={styles.bolderColIcon}></div>
                  <div className={styles.normalColIcon}></div>
                </div>
                <h2>{formatMessage({ id: 'i18n_btn_login' })}</h2>
                {width <= 832 && (
                  <div className={styles.scrollToCardPersonButtonContainer}>
                    <p
                      className={styles.scrollToCardPersonButton}
                      onClick={() => setIsScrollIntoCardPerson(true)}
                    >
                      個人の方はこちら
                    </p>
                  </div>
                )}
              </div>
              <div className={styles.subTitle}>
                {formatMessage({ id: 'i18n_please_login_with_your_acc' })}
              </div>
            </div>

            <GoogleLogin
              clientId={config.GOOGLE_CLIENT_KEY}
              render={renderProps => (
                <div className={styles.main}>
                  <CardCompany
                    microsoftLogin={() => microsoftLogin(ACCOUNT_TYPE_BUSINESS)}
                    googleLogin={() => {
                      localStorage.setItem('type', ACCOUNT_TYPE_BUSINESS);
                      renderProps.onClick();
                    }}
                  />
                  <div ref={scrollIntoCardPerson}>
                    <CardPerson
                      microsoftLogin={() => microsoftLogin(ACCOUNT_TYPE_PERSON)}
                      googleLogin={() => {
                        localStorage.setItem('type', ACCOUNT_TYPE_PERSON);
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
          </div>
          <Footer />
        </Spin>
      )}
    </>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(Login);
