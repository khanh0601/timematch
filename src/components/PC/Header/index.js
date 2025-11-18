import { deleteLocalInfo, getCookie } from '@/commons/function';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useRef } from 'react';
import { history, useIntl } from 'umi';
import MenuItem from './MenuItem';
import useIsPc from '@/hooks/useIsPc';
import useIsMobile from '@/hooks/useIsMobile';
import styles from './styles.less';
import CollaborationModal from './CollaborationModal';
import EventBus, { EventBusNames } from '@/util/eventBus';

const { confirm } = Modal;

const PCHeader = props => {
  const isPc = useIsPc();
  const isMobile = useIsMobile();
  const items = [
    { name: '調整一覧', path: '/' },
    { name: 'カレンダー', path: '/pc/calendar' },
    { name: 'プロフィール', path: '/profile' },
    { name: '自動日程調整オプション', path: '/profile/schedule-setting' },
    { name: '定型文の作成', path: '/mail-template' },
    { name: 'メールの送付先管理', path: '/contact-management' },
    { name: 'ご利用のガイド', path: '/documentation' },
  ];
  const isActive = p =>
    p === '/' ? location.pathname === '/' : location.pathname.startsWith(p);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const menuRef = useRef(null);
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
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);
  const handleLogout = () => {
    if (isMobile) {
      setShowMenu(false);
    }
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
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <img
            src={require('@/assets/images/logo.png')}
            alt={'logo'}
            className={styles.logo}
            onClick={() => {
              history.push('/');
            }}
          />
        </div>

        <div className={styles.headerRight}>
          {isPc && (
            <div
              className={styles.avatarWrap}
              onClick={() => {
                // history.push('/profile');

                setShowModal(true);
              }}
            >
              {isLogin && (
                <img
                  src={
                    profile?.avatar || require('@/assets/images/pc/avatar.png')
                  }
                  alt={'avatar'}
                  className={styles.avatar}
                />
              )}
              <span>{profile?.name}</span>
            </div>
          )}
          {!showMenu && isLogin && (
            <div className={styles.icBarView} onClick={handleToggleMenu}>
              <img
                src={require('@/assets/images/pc/menu.png')}
                alt={'menu'}
                className={styles.icBar}
              />
            </div>
          )}
          {showMenu && (
            <img
              src={require('@/assets/images/pc/x.png')}
              alt={'x'}
              className={styles.icClose}
              onClick={handleToggleMenu}
            />
          )}

          {showMenu && (
            <div className={styles.menuView} ref={menuRef}>
              {items.map(it => (
                <div
                  key={it.path}
                  className={`${styles.menuItem} ${
                    isActive(it.path) ? styles.active : ''
                  }`}
                  onClick={() => {
                    history.push(it.path);
                    setShowMenu(false);
                  }}
                >
                  <span className={styles.menuText}>{it.name}</span>
                </div>
              ))}

              <div
                className={`${styles.menuItem} ${styles.lastItem}`}
                onClick={() => {
                  window.open(
                    'https://vision-net.co.jp/privacy.html',
                    '_blank',
                  );
                  setShowMenu(false);
                }}
              >
                <span className={styles.menuText}>プライバシーポリシー</span>
              </div>
              <div className={styles.logoutWrap}>
                {isMobile && (
                  <div
                    className={styles.avatarWrap}
                    onClick={() => {
                      // history.push('/profile');
                      setShowMenu(false);
                      setShowModal(true);
                    }}
                  >
                    {isLogin && (
                      <img
                        src={
                          profile?.avatar ||
                          require('@/assets/images/pc/avatar.png')
                        }
                        alt={'avatar'}
                        className={styles.avatar}
                      />
                    )}
                    <span>{profile?.name}</span>
                  </div>
                )}
                <div className={styles.logoutItem} onClick={handleLogout}>
                  <span className={styles.menuText}>ログアウト</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {showModal && (
          <CollaborationModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </header>
  );
};

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(PCHeader);
