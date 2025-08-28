import React, { useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { Modal, Button } from 'antd';
import GoogleLogin from 'react-google-login';
import config from '@/config';
import { connect } from 'dva';
import moment from 'moment';
import MicrosoftLogin from 'react-microsoft-login';
import zone from 'moment-timezone';

function ReLoginPopup(props) {
  const {
    dispatch,
    masterStore,
    visibleModal,
    setVisibleModal,
    setSyncCalendar,
  } = props;
  const { profile } = masterStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const syncGG = async () => {
    await dispatch({
      type: 'EVENT/syncGoogleCalendar',
      payload: {
        start_date: moment()
          .hour(0)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DDTHH:mm:ssZ'),
      },
    });
  };

  const responseGoogle = async googleResponse => {
    if (!googleResponse.error) {
      const payload = {
        data: {
          token: googleResponse.accessToken,
        },
        setSyncCalendar: setSyncCalendar(true),
        closeModal: setVisibleModal(false),
      };
      await dispatch({ type: 'MASTER/googleReLogin', payload });
      await syncGG();
    }
  };

  const syncMicrosoft = async () => {
    await dispatch({
      type: 'EVENT/syncMicrosoftCalendar',
      payload: {
        timeZone: zone.tz.guess(),
      },
    });
  };

  const microsoftLogin = async (err, data) => {
    if (!err) {
      const payload = {
        data: {
          token:
            data.accessToken || data.authResponseWithAccessToken.accessToken,
        },
        setSyncCalendar: setSyncCalendar(true),
        closeModal: setVisibleModal(false),
      };
      await dispatch({ type: 'MASTER/microsoftReLogin', payload });
      await syncMicrosoft();
    }
  };

  return (
    <Modal title="" visible={visibleModal} footer={null} closable={false}>
      {profile.type_login === 1 && (
        <GoogleLogin
          clientId={config.GOOGLE_CLIENT_KEY}
          render={renderProps => (
            <>
              <p>{formatMessage({ id: 'i18n_google_relogin' })}</p>
              <Button
                className={styles.reLoginBtn}
                onClick={renderProps.onClick}
              >
                {formatMessage({ id: 'i18n_sync' })}
              </Button>
            </>
          )}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={() => {}}
          cookiePolicy={'single_host_origin'}
        />
      )}
      {profile.type_login === 2 && (
        <div>
          <p>{formatMessage({ id: 'i18n_microsoft_relogin' })}</p>
          <div className={styles.microsoftLogin}>
            <MicrosoftLogin
              clientId={config.MICROSOFT_CLIENT_KEY}
              authCallback={microsoftLogin}
              redirectUri={config.WEB_DOMAIN}
              children={
                <>
                  <Button className={styles.reLoginBtn}>
                    {formatMessage({ id: 'i18n_sync' })}
                  </Button>
                </>
              }
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(ReLoginPopup);
