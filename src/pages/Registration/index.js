import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import { useIntl } from 'umi';
import { Spin } from 'antd';
import { connect } from 'dva';
import config from '@/config';
import GoogleLogin from 'react-google-login';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import CardCompany from './components/CardCompany';
import CardPerson from './components/CardPerson';
import { ACCOUNT_TYPE_BUSINESS, ACCOUNT_TYPE_PERSON } from '@/constant';
import useWindowDimensions from '@/commons/useWindowDimensions';

function Registration(props) {
  const { dispatch, masterStore } = props;
  const { loginLoading, errorRegister } = masterStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [remindTermComp, setRemindTermComp] = useState(false);
  const [remindTermPers, setRemindTermPers] = useState(false);
  const [termComp, setTermComp] = useState(false);
  const [termPers, settermPers] = useState(false);
  const [type, setType] = useState(0);
  const { width } = useWindowDimensions();

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
    <Spin spinning={loginLoading}>
      <Header headerLogin={true} />
      <div className={styles.login}>
        <div className={styles.loginHeader}>
          <div className={styles.eventTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon}></div>
              <div className={styles.normalColIcon}></div>
            </div>
            <h2>{formatMessage({ id: 'i18n_register_title' })}</h2>
            {width <= 832 && (
              <p
                className={styles.scrollToCardPersonButton}
                onClick={() => setIsScrollIntoCardPerson(true)}
              >
                個人の方はこちら
              </p>
            )}
          </div>
          <div className={styles.subTitle}>
            {width > 510 ? (
              <span>{formatMessage({ id: 'i18n_signup_other_method' })}</span>
            ) : (
              <>
                <span>
                  {formatMessage({ id: 'i18n_signup_other_method_mobile_1' })}
                </span>
                <br />
                <span>
                  {formatMessage({ id: 'i18n_signup_other_method_mobile_2' })}
                </span>
              </>
            )}
          </div>
        </div>

        <GoogleLogin
          clientId={config.GOOGLE_CLIENT_KEY}
          render={renderProps => (
            <div className={styles.main}>
              <CardCompany
                acceptTerm={termComp}
                remindAcceptTerm={remindTermComp}
                setRemindAcceptTerm={setRemindTermComp}
                microsoftLogin={() => microsoftLogin(ACCOUNT_TYPE_BUSINESS)}
                googleLogin={renderProps.onClick}
                onCheck={() => {
                  setType(ACCOUNT_TYPE_BUSINESS);
                  setTermComp(old => !old);
                }}
              />
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
      <Footer />
    </Spin>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(Registration);
