import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import { Menu, Dropdown, Modal, Tooltip } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useIntl, Link, history } from 'umi';
import logoImage from '@/assets/images/logo-black.svg';
import { deleteLocalInfo } from '../../commons/function';
import { getCookie } from '@/commons/function';
import { connect } from 'dva';
import { ROLE_MEMBER } from '@/constant';

import useWindowDimensions from '@/commons/useWindowDimensions';

const { confirm } = Modal;
function HeaderPreview({
  dispatch,
  masterStore,
  userByCode,
  bookingState,
  isVote,
  isScheduleAdjust,
  togetherModalInfor,
  currentStep,
  previewCalendar,
}) {
  const intl = useIntl();
  const [localProfile, setLocalProfile] = useState({});
  const { profile } = masterStore;
  const { width } = useWindowDimensions();

  const isLogin = getCookie('token');

  const dispatchSetScrollToProfilePage = () => {
    dispatch({
      type: 'MASTER/setIsScrollToScheduleSetting',
      payload: false,
    });
  };
  const dispatchSetScrollToScheduleSetting = () => {
    dispatch({
      type: 'MASTER/setIsScrollToScheduleSetting',
      payload: true,
    });
  };

  useEffect(() => {
    if (isLogin && !profile?.id) {
      getProfile();
    }
  }, [isLogin]);
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const getProfile = () => {
    dispatch({
      type: 'MASTER/getProfile',
      payload: {},
    });
  };

  const handleLogout = () => {
    confirm({
      title: intl.formatMessage({ id: 'i18n_confirm_logout' }),
      icon: <ExclamationCircleOutlined />,
      cancelText: intl.formatMessage({ id: 'i18n_cancel_text' }),
      okText: intl.formatMessage({ id: 'i18n_logout' }),
      className: styles.logoutConfirm,
      onOk: () => {
        deleteLocalInfo();
        history.push('/');
      },
    });
  };

  const menu = () => (
    <Menu className={styles.dropdownMenuAccount}>
      <Menu.Item key="0">
        <Link to="/profile" onClick={dispatchSetScrollToProfilePage}>
          {intl.formatMessage({ id: 'i18n_account_settings' })}
        </Link>
      </Menu.Item>

      {localProfile.connection_role !== ROLE_MEMBER && (
        <Menu.Item key="1">
          <Link to="/account-status">
            {intl.formatMessage({ id: 'i18n_change_user_manager' })}
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="2">
        <Link to="/profile" onClick={dispatchSetScrollToScheduleSetting}>
          {intl.formatMessage({ id: 'i18n_schedule_setting' })}
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/event?tab=3">
          {intl.formatMessage({ id: 'i18n_schedule' })}
        </Link>
      </Menu.Item>
      {localProfile.connection_role !== ROLE_MEMBER && (
        <Menu.Item key="4">
          <Link to="/add-member">
            {intl.formatMessage({ id: 'i18n_invite_member' })}
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="5">
        <Link to="/zoom-meet">
          {intl.formatMessage({ id: 'i18n_cooperate' })}
        </Link>
      </Menu.Item>
      {localProfile.connection_role !== ROLE_MEMBER && (
        <>
          <Menu.Item key="6">
            <Link to="/payment?addPlan=creditCard">
              {intl.formatMessage({ id: 'i18n_account_purchase' })}
            </Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/contract-detail">
              {intl.formatMessage({ id: 'i18n_contract_and_payment' })}
            </Link>
          </Menu.Item>
        </>
      )}
      <Menu.Item key="8">
        <a href="# " onClick={handleLogout}>
          {intl.formatMessage({ id: 'i18n_logout' })}
        </a>
      </Menu.Item>
    </Menu>
  );

  const redirectQA = () => {
    history.push('/qa');
  };

  const mainHeaderCss = () => {
    let listCss = styles.mainHeader;

    if (isScheduleAdjust) {
      listCss += ' ' + styles.headerPreviewAdjustment;
    }

    if (isVote) {
      listCss += ' ' + styles.headerPreviewVote;
    }

    if (
      (isVote && currentStep === 4) ||
      (isScheduleAdjust && currentStep === 4)
    ) {
      listCss += ' ' + styles.headerSuccessVote;
    }

    if (previewCalendar) {
      listCss += ' ' + styles.headerCalendar;
    }

    return listCss;
  };

  return (
    <div className={mainHeaderCss()}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.headerLogo} onClick={() => history.push('/')}>
            <div className={styles.imgLogo} />
          </div>

          <div className={styles.boxMessageName}>
            <Tooltip
              title={`${
                bookingState
                  ? userByCode?.code === 'smoothly-2020'
                    ? 'Smoothlyの管理者'
                    : userByCode?.name
                  : profile.name
              }
            ${intl.formatMessage({
              id: 'i18n_header_preview',
            })}`}
            >
              <div className={styles.headerTitleText}>
                {bookingState
                  ? userByCode?.code === 'smoothly-2020'
                    ? `Smoothlyの管理者${intl.formatMessage({
                        id: 'i18n_header_admin',
                      })}`
                    : `${userByCode?.name}${intl.formatMessage({
                        id: 'i18n_header_preview',
                      })}`
                  : `${profile.name}${intl.formatMessage({
                      id: 'i18n_header_preview',
                    })}`}
              </div>
            </Tooltip>
          </div>

          {(!currentStep || currentStep !== 4) && (
            <div
              onClick={togetherModalInfor}
              className={styles.headerInforBooking}
            >
              <a>ミーティング情報</a>
            </div>
          )}
        </div>
        <ul className={styles.headerMenu}>
          {isLogin && !currentStep && (
            <li
              className={`${styles.headerMenuItem} ${styles.headerMenuItemFirst}`}
              onClick={() => history.push('/')}
            >
              <a href="">{intl.formatMessage({ id: 'i18n_header_menu_1' })}</a>
            </li>
          )}

          {!isLogin && (
            <li
              className={`${styles.headerMenuItem}`}
              style={{ paddingRight: '10px' }}
            >
              <a onClick={() => redirectQA()}>
                {intl.formatMessage({ id: 'i18n_header_menu_2' })}
              </a>
            </li>
          )}

          {isLogin && (
            <Dropdown
              overlay={menu}
              trigger={['hover', 'click']}
              placement="bottomCenter"
            >
              <li
                className={styles.headerMenuItem}
                onClick={e => e.preventDefault()}
              >
                <div className={styles.headerMenuItemAvt}>
                  <div className={styles.defaultAvatar}>
                    {profile.avatar ? (
                      <img src={profile.avatar} />
                    ) : (
                      <div className={styles.bgAvatar} />
                    )}
                  </div>
                </div>
                <div className="ant-dropdown-link">
                  {intl.formatMessage({ id: 'i18n_header_menu_3' })}
                  <DownOutlined />
                </div>
              </li>
            </Dropdown>
          )}
        </ul>
      </div>
    </div>
  );
}

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(
  HeaderPreview,
);
