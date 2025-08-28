import TooltipFormat from '@/components/TooltipFormat';
import helper from '@/assets/images/imgQuestion.png';
import googleClendarIcon from '@/assets/images/google-calendar-icon.png';
import outlookIcon from '@/assets/images/outlook-icon.png';
import useWindowDimensions from '@/commons/useWindowDimensions';
import {
  ExclamationCircleOutlined,
  CloseOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import config from '@/config';
import iconGoogle from '@/assets/images/google.png';
import iconOffice from '@/assets/images/microsoft.png';
import MicrosoftLogin from 'react-microsoft-login';
import GoogleLogin from 'react-google-login';
import { Button, Form, Input, Modal, Spin, message, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useHistory, useIntl } from 'umi';
import { profileFromStorage } from '@/commons/function';
import styles from './styles.less';
const listDataTooltipCancelPackage = [
  '契約中の有料プランの解約ができます。',
  '解約しても契約期間内は有料プランの機能を利用することが可能です。',
  '契約期間が終了するとプランが終了し、有料プランの機能が利用できなくなります。',
];
const listDataTooltipUnlinkPackage = [
  'Google・Microsoftのアカウントとの連携を解除できます。',
  '解除すると、カレンダーへの自動追加やダブルブッキングの防止ができなくなるのでご注意ください。',
];

const listDataTooltipDeleteAccount = [
  'アカウントのデータをすべて削除することができます。',
  '削除後に、セキュリティのためデータを削除しますので、',
  'アカウントの復旧はできないのでご注意ください。',
];

const CollaborationPage = props => {
  const { dispatch, calendarStore, eventStore } = props;
  const { width } = useWindowDimensions();
  const intl = useIntl();
  const { formatMessage } = intl;
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);
  const [loadingCancelPlan, setLoadingCancelPlan] = useState(false);
  const [disableCancelPlan, setDisableCancelPlan] = useState(true);
  const [detailProfile, setDetailProfile] = useState({});
  const profile = profileFromStorage();
  const [loginPage, setLoginPage] = useState(true);
  const [acceptTerm, setAcceptTerm] = useState(loginPage);
  const [urlMeet, setUrlMeet] = useState('');
  const [urlZoom, setUrlZoom] = useState('');
  const redirectUri = `${window.location.protocol}//${window.location.host}/msteam-login-success`;
  const urlMSTeam = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${config.MICROSOFT_CLIENT_KEY}&scope=User.Read Calendars.Read Calendars.ReadWrite offline_access&response_type=code&redirect_uri=${redirectUri}&state=ClientStateGoesHere&prompt=login`;

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

  const handleClickCancelPlan = () => {
    confirm({
      title: formatMessage({ id: 'i18n_cancel_plan_confirm' }),
      icon: <ExclamationCircleOutlined />,
      okText: formatMessage({ id: 'i18n_confirm_delete' }),
      cancelText: formatMessage({ id: 'i18n_confirm_not_delete' }),
      className: styles.logoutConfirm,
      onOk: () => {
        dispatch({
          type: 'MASTER/cancelPlan',
          payload: {
            loadingFunc: setLoadingCancelPlan,
            showMessage: message,
            formatMessage,
            setDisableCancelPlan,
          },
        });
      },
    });
  };

  const handleClickDeleteAccount = () => {
    confirm({
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
    confirm({
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid darkblue',
          padding: 15,
        }}
      >
        <div></div>
        <div className={styles.header}>プロフィール</div>
        <div
          style={{
            width: 30,
            height: 30,
            background: 'dodgerblue',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}
          onClick={() => history.go(-1)}
        >
          <CloseOutlined style={{ color: '#FFF' }} />
        </div>
      </div>
      <div style={{ padding: '30px 10px' }}>
        <div className={styles.groupPart}>
          <div style={{ marginBottom: 20 }}>
            <img src={googleClendarIcon} alt="" />
            Googleカレンダー
          </div>
          <div style={{ textAlign: 'right' }}>
            {profile?.google_email ? (
              <Button
                type="primary"
                danger
                loading={loadingCancelPlan}
                onClick={handleClickCancelPlan}
              >
                解約する
              </Button>
            ) : (
              <a
                target="_blank"
                href={calendarStore.urlMeet}
                className={`${styles.btnSocial}`}
              >
                <img src={iconGoogle} alt={'Google'} />
                Googleカレンダー連携
              </a>
            )}
          </div>
        </div>
        <div className={styles.groupPart}>
          <div>
            <img src={outlookIcon} alt="" />
            Outlookカレンダー
          </div>
          <div style={{ textAlign: 'right' }}>
            {profile?.microsoft_email ? (
              <Button type="primary" danger onClick={handleClickUnlinkage}>
                {formatMessage({ id: 'i18n_btn_delete_linked' })}
              </Button>
            ) : (
              <a
                target="_blank"
                href={urlMSTeam}
                className={`${styles.btnSocial}`}
              >
                <img src={iconOffice} alt={'Microsoft'} />
                Microsoftカレンダー連携
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ PAYMENT, CALENDAR_CREATION, EVENT }) => ({
  paymentStore: PAYMENT,
  calendarStore: CALENDAR_CREATION,
  eventStore: EVENT,
}))(CollaborationPage);
