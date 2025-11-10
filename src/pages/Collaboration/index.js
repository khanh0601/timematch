import googleClendarIcon from '@/assets/images/google-calendar-icon.png';
import googleClendarIconPc from '@/assets/images/pc/gg.png';
import iconGoogle from '@/assets/images/google.png';
import iconBack from '@/assets/images/i-back-white.png';
import iconOffice from '@/assets/images/microsoft.png';
import outlookIcon from '@/assets/images/outlook-icon.png';
import outlookIconPc from '@/assets/images/pc/outlook.png';
import iconClose from '@/assets/images/pc/icon_Menu.png';
import { profileFromStorage } from '@/commons/function';
import useWindowDimensions from '@/commons/useWindowDimensions';
import HeaderMobile from '@/components/Mobile/Header';
import config from '@/config';
import useIsPc from '@/hooks/useIsPc';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from './styles.less';
import useIsMobile from '@/hooks/useIsMobile';

const CollaborationPage = props => {
  const { dispatch, calendarStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);
  const [detailProfile, setDetailProfile] = useState({});
  const profile = profileFromStorage();
  const [loginPage, setLoginPage] = useState(true);
  const [urlMeet, setUrlMeet] = useState('');
  const redirectUri = `${window.location.protocol}//${window.location.host}/msteam-login-success`;
  const urlMSTeam = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${config.MICROSOFT_CLIENT_KEY}&scope=User.Read Calendars.Read Calendars.ReadWrite offline_access&response_type=code&redirect_uri=${redirectUri}&state=ClientStateGoesHere&prompt=login`;
  const isMobile = useIsMobile();

  const isPc = useIsPc();

  useEffect(() => {
    const payload = {
      setUrlMeet: setUrlMeet,
    };
    dispatch({ type: 'CALENDAR_CREATION/loadingData', payload });
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

  const handleClickCancelPlan = account_type => {
    Modal.confirm({
      title: formatMessage({ id: 'i18n_cancel_collaboration_confirm' }),
      icon: <ExclamationCircleOutlined />,
      okText: formatMessage({ id: 'i18n_confirm_delete' }),
      cancelText: formatMessage({ id: 'i18n_confirm_not_delete' }),
      className: styles.logoutConfirm,
      onOk: () => {
        dispatch({
          type: 'MASTER/cancelAccountIntegrates',
          payload: {
            showMessage: message,
            formatMessage,
            setDetailProfile,
            detailProfile,
            account_type,
            isMobile,
          },
        });
      },
    });
  };

  const handleClickDeleteAccount = () => {
    Modal.confirm({
      title: formatMessage({ id: 'i18n_delete_account_confirm' }),
      icon: <ExclamationCircleOutlined />,
      okText: formatMessage({ id: 'i18n_confirm_delete' }),
      cancelText: formatMessage({ id: 'i18n_confirm_not_delete' }),
      className: styles.logoutConfirm,
      onOk: () => {
        dispatch({
          type: 'MASTER/deleteProfile',
          payload: {
            loadingFunc: setLoadingDeleteAccount,
            showMessage: message,
            formatMessage,
          },
        });
      },
    });
  };

  const handleClickUnlinkage = () => {
    Modal.confirm({
      title: formatMessage({ id: 'i18n_unlinkage_confirm' }),
      icon: <ExclamationCircleOutlined />,
      okText: formatMessage({ id: 'i18n_release' }),
      cancelText: formatMessage({ id: 'i18n_will_not_release' }),
      className: styles.logoutConfirm,
      onOk: () => {
        dispatch({
          type: 'MASTER/accountUnlinkage',
          payload: {
            showMessage: message,
            formatMessage,
            setDetailProfile,
            detailProfile,
          },
        });
      },
    });
  };

  return (
    <div className={styles.collaborationContainer}>
      <div className={styles.collaborationTitleWrap}>
        <div className={styles.collaborationTitle}>他社カレンダー連動</div>
        {isMobile ? null : (
          <div className={styles.collaborationClose} onClick={props.onClose}>
            <img src={iconClose} alt="close" />
          </div>
        )}
      </div>
      <div>
        <div className={styles.groupPart}>
          <div
            style={{
              marginBottom: 16,
              textAlign: isMobile ? 'left' : 'center',
            }}
          >
            <img
              className={styles.groupPartIcon}
              src={isPc ? googleClendarIconPc : googleClendarIcon}
              alt=""
            />
            <span className={styles.groupPartLabel}>
              {formatMessage({ id: 'i18n_collaboration_google_title' })}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            {profile?.is_link_google ? (
              <Button
                type="primary"
                danger
                disabled={profile?.google_email}
                onClick={() => handleClickCancelPlan(1)}
              >
                {formatMessage({ id: 'i18n_btn_cancel_collaboration' })}
              </Button>
            ) : (
              <a
                target="_blank"
                href={calendarStore.urlMeet}
                className={`${styles.btnSocial}`}
              >
                <img src={iconGoogle} alt={'Google'} />
                {formatMessage({ id: 'i18n_calendar_link_other_google' })}
              </a>
            )}
          </div>
        </div>
        <div className={styles.groupPart}>
          <div style={{ textAlign: isMobile ? 'left' : 'center' }}>
            <img
              className={styles.groupPartIcon}
              src={isPc ? outlookIconPc : outlookIcon}
              alt=""
            />
            <span className={styles.groupPartLabel}>
              {formatMessage({ id: 'i18n_collaboration_microsoft_title' })}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            {profile?.is_link_microsoft ? (
              <Button
                type="primary"
                danger
                disabled={profile?.microsoft_email}
                onClick={() => handleClickCancelPlan(2)}
              >
                {formatMessage({ id: 'i18n_btn_delete_linked' })}
              </Button>
            ) : (
              <a
                target="_blank"
                href={urlMSTeam}
                className={`${styles.btnSocial}`}
              >
                <img src={iconOffice} alt={'Microsoft'} />
                {formatMessage({ id: 'i18n_calendar_link_other_microsoft' })}
              </a>
            )}
          </div>
        </div>
        {isMobile ? (
          <div className={styles.btnReturn} onClick={props.onClose}>
            戻る
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default connect(({ PAYMENT, CALENDAR_CREATION, EVENT }) => ({
  paymentStore: PAYMENT,
  calendarStore: CALENDAR_CREATION,
  eventStore: EVENT,
}))(CollaborationPage);
