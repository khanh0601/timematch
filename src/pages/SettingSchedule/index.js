import { profileFromStorage } from '@/commons/function';
import useWindowDimensions from '@/commons/useWindowDimensions';
import { ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Spin, message } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useHistory, useIntl, withRouter } from 'umi';
import SettingBlocktime from './SettingBlocktime';
import styles from './styles.less';
const { Item } = Form;
const { confirm } = Modal;
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
function SettingSchedule(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();
  const { masterStore, dispatch } = props;
  const { isScrollToProfilePage, isScrollToScheduleSetting } = masterStore;
  const [avatar, setAvatar] = useState(undefined);
  const [fileImage, setFileImage] = useState(undefined);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);
  const [loadingCancelPlan, setLoadingCancelPlan] = useState(false);
  const [detailProfile, setDetailProfile] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [loadingBtnSave, setLoadingBtnSave] = useState(false);
  const history = useHistory();
  const { width } = useWindowDimensions();
  const [disableCancelPlan, setDisableCancelPlan] = useState(true);

  useEffect(() => {
    dispatch({
      type: 'MASTER/checkSlotStatus',
      payload: {
        showMessage: message,
        setDisableCancelPlan,
      },
    });
  }, []);

  useEffect(() => {
    const profile = profileFromStorage();
    const { avatar, name, company, katakana_name, code } = profile;

    form.setFieldsValue({
      fullName: name,
      company: company,
      userName: katakana_name,
      calendarUrl: code,
    });
    setDetailProfile(profile);
    setAvatar(avatar);
  }, []);

  const updateLocalStorage = values => {
    const profile = profileFromStorage();
    if (fileImage) profile.avatar = avatar;
    profile.company = values.company;
    profile.name = values.fullName;
    profile.katakana_name = values.userName;
    profile.code = values.calendarUrl;
    localStorage.setItem('profile', JSON.stringify(profile));
  };

  const handleSubmitForm = values => {
    const formData = new FormData();
    if (fileImage) {
      formData.append('image', fileImage);
    }
    formData.append('name', values.fullName);
    formData.append('company', values.company);
    // formData.append('katakana_name', values.userName);
    formData.append('code', values.calendarUrl);
    formData.append('_method', 'put');
    dispatch({
      type: 'MASTER/updateProfile',
      payload: {
        formData,
        message,
        formatMessage,
        setLoadingBtnSave,
        updateLocalStorage: () => updateLocalStorage(values),
      },
    });
  };

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const handleSelectImage = async file => {
    const imgUrl = await toBase64(file.file);
    setAvatar(imgUrl);
    setFileImage(file.file);
    setUpdatingAvatar(true);
  };

  const handleResetAvatar = () => {
    setAvatar(profile.avatar);
    setFileImage(undefined);
    setUpdatingAvatar(false);
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

  const scrollToScheduleSetting = ref => {
    if (
      ref &&
      isScrollToScheduleSetting === true &&
      isScrollToProfilePage === false
    ) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {loadingData ? (
        <Spin className="loading-page" size="large" />
      ) : (
        <div className={styles.profileContainer}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid darkblue',
              padding: 15,
            }}
          >
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
              onClick={() => history.goBack()}
            >
              <LeftOutlined style={{ color: '#FFF' }} />
            </div>
            <div className={styles.header}>プロフィール</div>
            <div></div>
          </div>
          <div
            style={{ padding: 15 }}
            ref={scrollToScheduleSetting}
            className={styles.groupPart}
          >
            <div className={styles.partName}>
              <div className={styles.partNameBorder}></div>
              <div className={styles.partNameTitle}>
                {formatMessage({ id: 'i18n_update_default_settings' })}
              </div>
            </div>
            <SettingBlocktime />
          </div>
          {/* 
          

          <div className={styles.groupPart}>
            <div className={styles.partName}>
              <div className={styles.partNameBorder}></div>
              <div className={styles.partNameTitle}>
                {formatMessage({ id: 'i18n_cancel_plan' })}
                <Tooltip
                  title={
                    <TooltipFormat dataFormat={listDataTooltipCancelPackage} />
                  }
                  trigger={['hover', 'click']}
                >
                  <img
                    src={helper}
                    style={{
                      marginLeft: width <= 767 ? '8px' : '10px',
                      marginTop: width <= 767 ? '-2px' : '-5px',
                      width: width <= 767 ? '20px' : '30px',
                      height: width <= 767 ? '20px' : '30px',
                    }}
                    className="helper"
                  />
                </Tooltip>
              </div>
            </div>
            <Button
              loading={loadingCancelPlan}
              className={`btn btn-grey ${styles.disconnectBtn}`}
              onClick={handleClickCancelPlan}
              disabled={disableCancelPlan}
            >
              解約する
            </Button>
          </div>

          <div className={styles.groupPart}>
            <div className={styles.partName}>
              <div className={styles.partNameBorder}></div>
              <div className={styles.partNameTitle}>
                {formatMessage({ id: 'i18n_account_unlinkage' })}
                <Tooltip
                  title={
                    <TooltipFormat dataFormat={listDataTooltipUnlinkPackage} />
                  }
                  trigger={['hover', 'click']}
                >
                  <img
                    src={helper}
                    style={{
                      marginLeft: '10px',
                      marginTop: '-5px',
                      width: width <= 767 ? '20px' : '30px',
                      height: width <= 767 ? '20px' : '30px',
                    }}
                    className="helper"
                  />
                </Tooltip>
              </div>
            </div>
            <Button
              disabled={!detailProfile.has_token}
              onClick={handleClickUnlinkage}
              className={`btn btn-grey ${styles.disconnectBtn}`}
            >
              {formatMessage({ id: 'i18n_btn_delete_linked' })}
            </Button>
          </div>
          <div className={styles.groupPart}>
            <div className={styles.partName}>
              <div className={styles.partNameBorder}></div>
              <div className={styles.partNameTitle}>
                {formatMessage({ id: 'i18n_delete_account' })}
                <Tooltip
                  title={
                    <TooltipFormat dataFormat={listDataTooltipDeleteAccount} />
                  }
                  trigger={['hover', 'click']}
                >
                  <img
                    src={helper}
                    style={{
                      marginLeft: width <= 767 ? '-2px' : '-10px',
                      marginTop: '-5px',
                      width: width <= 767 ? '20px' : '30px',
                      height: width <= 767 ? '20px' : '30px',
                    }}
                    className="helper"
                  />
                </Tooltip>
              </div>
            </div>
            <Button
              loading={loadingDeleteAccount}
              className={`btn btn-grey ${styles.disconnectBtn}`}
              onClick={handleClickDeleteAccount}
            >
              {formatMessage({ id: 'i18n_account_delete' })}
            </Button>
          </div> */}
          {/* <Form>
            <Item className={styles.backToHome}>
              <Button
                onClick={() => history.push('/')}
                className="btn btnGreen m-auto"
              >
                {formatMessage({ id: 'i18n_return_home' })}
              </Button>
            </Item>
          </Form> */}
        </div>
      )}

      {/* <Footer /> */}
    </div>
  );
}

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(
  withRouter(SettingSchedule),
);
