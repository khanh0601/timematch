import { deleteLocalInfo, getCookie } from '@/commons/function';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { history, useIntl } from 'umi';
import MenuItem from './MenuItem';
import styles from './styles.less';
import CollaborationModal from './CollaborationModal';
import EventBus, { EventBusNames } from '@/util/eventBus';

const { confirm } = Modal;

const PCHeader = props => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const { masterStore, dispatch } = props;
  const intl = useIntl();
  const { profile } = masterStore;

  const isLogin = getCookie('token');

  useEffect(() => {
    EventBus.addEventListener(EventBusNames.REFRESH_PROFILE, e => {
      getProfile();
    });
  }, []);

  useEffect(() => {
    if (isLogin && !profile?.id) {
      getProfile();
    }
  }, [isLogin]);

  const getProfile = () => {
    dispatch({
      type: 'MASTER/getProfile',
      payload: {},
    });
  };

  const handleToggleMenu = () => {
    if (!isLogin) {
      history.push('/login');
      return;
    }
    setShowMenu(!showMenu);
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
        // location.reload();
      },
    });
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerLeft}>
        {!showMenu && isLogin && (
          <div className={styles.icBarView} onClick={handleToggleMenu}>
            <img
              src={require('@/assets/images/pc/menu.png')}
              alt={'menu'}
              className={styles.icBar}
            />
          </div>
        )}

        <img
          src={require('@/assets/images/logo.png')}
          alt={'logo'}
          className={styles.logo}
          onClick={() => {
            history.push('/');
          }}
        />
        {showMenu && (
          <img
            src={require('@/assets/images/pc/x.png')}
            alt={'x'}
            className={styles.icClose}
            onClick={handleToggleMenu}
          />
        )}

        {showMenu && (
          <div className={styles.menuView}>
            <MenuItem
              icon={require('@/assets/images/pc/icMenu1.png')}
              name="調整一覧"
              path="/"
            />

            <MenuItem
              icon={require('@/assets/images/pc/icMenu2.png')}
              name="カレンダー"
              path="/pc/calendar"
            />
            <MenuItem
              onClick={() => {
                history.push('/profile');
              }}
              icon={require('@/assets/images/pc/icMenu3.png')}
              name="プロフィール"
              path="/profile"
            />
            <MenuItem
              onClick={() => {
                history.push('/mail-template');
              }}
              icon={require('@/assets/images/pc/icMenu4.png')}
              name="定型文の作成"
              path="/mail-template"
            />
            <MenuItem
              onClick={() => {
                history.push('/contact-management');
              }}
              icon={require('@/assets/images/pc/icMenu5.png')}
              name="メールの送付先管理"
              path="/contact-management"
            />
            <MenuItem
              icon={require('@/assets/images/pc/icMenu6.png')}
              name="ご利用のガイド"
              path="/documentation"
            />

            <div
              className={`${styles.menuItem} ${styles.lastItem}`}
              onClick={() => {
                window.open('https://vision-net.co.jp/privacy.html', '_blank');
                setShowMenu(false);
              }}
            >
              <img
                src={require('@/assets/images/pc/icMenu7.png')}
                alt={'help'}
                className={styles.icMenu}
              />
              <span className={styles.menuText}>プライバシーポリシー</span>
            </div>

            <div className={styles.logoutItem} onClick={handleLogout}>
              <img
                src={require('@/assets/images/pc/icLogout.png')}
                alt={'help'}
                className={styles.icMenu}
              />
              <span className={styles.menuText}>ログアウト</span>
            </div>
          </div>
        )}
      </div>

      <div
        className={styles.headerRight}
        onClick={() => {
          // history.push('/profile');
          setShowModal(true);
        }}
      >
        {isLogin && (
          <img
            src={profile?.avatar || require('@/assets/images/pc/avatar.png')}
            alt={'avatar'}
            className={styles.avatar}
          />
        )}
        <span>{profile?.name}</span>
      </div>

      {showModal && <CollaborationModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(PCHeader);
