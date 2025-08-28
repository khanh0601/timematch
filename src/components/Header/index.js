import logoImage from '@/assets/images/logo-black.svg';
import calendarTemplateImage from '@/assets/images/calendar.svg';
import trashTemplateImage from '@/assets/images/trashTemplate.svg';
import linkTemplateImage from '@/assets/images/linkTemplate.svg';
import multiUserIcon from '@/assets/images/groupUserWhite.png';
import userIcon from '@/assets/images/user-white.png';
import { getCookie, notify } from '@/commons/function';
import useWindowDimensions from '@/commons/useWindowDimensions';
import EventTemplateModal from '@/components/EventTemplateModal';
import { ROLE_MEMBER, MOUSE_LEAVE_DELAY_TIME } from '@/constant';
import {
  CloseOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { AutoComplete, Input, Menu, Modal, notification, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import {
  history,
  Link,
  useHistory,
  useIntl,
  useLocation,
  withRouter,
} from 'umi';
import { deleteLocalInfo, isExpired } from '../../commons/function';
import styles from './styles.less';

import DropdownMenu from '@/components/DropdownMenu';
import eraserImage from '@/assets/images/eraser.png';
import helper from '@/assets/images/imgQuestion.png';
import DialogChooseSettingTemplate from '../../pages/SettingTemplate/components/DialogChooseSettingTemplate';
import config from '../../config';

const { confirm } = Modal;
function Header(props) {
  const intl = useIntl();
  const [localProfile, setLocalProfile] = useState({});
  const [isVisible, setIsVisible] = useState(true);
  const {
    location,
    dispatch,
    masterStore,
    availableTimeStore,
    createEventType,
    accountStore,
    teamStore,
    accountTeamStore,
    footerStore,
    hideHeader,
    cssCalendar,
    headerLogin,
    cssCalendarCreationCopy,
  } = props;
  const { isScroll } = footerStore;
  const scrollIntoStartView = ref => {
    if (ref && isScroll === true) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      dispatch({ type: 'FOOTER/setIsScroll', payload: false });
    }
  };
  const { profile } = masterStore;
  const { listConnection } = accountStore;
  const { listTeam } = teamStore;
  const isLogin = getCookie('token');
  const { listPaginateTeamFull } = accountTeamStore;
  const { width } = useWindowDimensions();
  const [embedTemplateVisible, setEmbedTemplateVisible] = useState(false);
  const historyRouter = useHistory();

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
    if (isLogin) {
      getList();
      dispatch({
        type: 'TEAM/getTeam',
      });
      dispatch({
        type: 'ACCOUNT/getUserConnections',
      });
    }
  }, []);

  useEffect(() => {
    if (isLogin) {
      getProfile();
    }
  }, [isLogin]);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  useEffect(() => {}, [dropdownVisible]);

  const getList = async () => {
    dispatch({ type: 'ACCOUNT_TEAM/setLoading', payload: true });
    const payload = {
      has_pagination: false,
    };
    await dispatch({ type: 'ACCOUNT_TEAM/getPaginateTeamFull', payload });
    dispatch({ type: 'ACCOUNT_TEAM/setLoading', payload: false });
  };

  const listAccountConnection = () => {
    return listConnection
      .filter(item => item.user_connection)
      .filter(item => item.user_connection.status);
  };

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
        // location.reload();
      },
    });
  };

  const menu = () => (
    <Menu className={styles.dropdownMenuAccount}>
      <Menu.Item key="0" className={styles.greyHover}>
        <Link to="/profile" onClick={dispatchSetScrollToProfilePage}>
          {intl.formatMessage({ id: 'i18n_account_settings' })}
        </Link>
      </Menu.Item>

      {localProfile.connection_role !== ROLE_MEMBER && (
        <Menu.Item key="1" className={styles.greyHover}>
          <Link to="/account-status">
            {intl.formatMessage({ id: 'i18n_change_user_manager' })}
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="2" className={styles.greyHover}>
        <Link to="/profile" onClick={dispatchSetScrollToScheduleSetting}>
          {intl.formatMessage({ id: 'i18n_schedule_setting' })}
        </Link>
      </Menu.Item>
      <Menu.Item key="3" className={styles.greyHover}>
        <Link to="/event?tab=3">
          {intl.formatMessage({ id: 'i18n_schedule' })}
        </Link>
      </Menu.Item>
      {localProfile.connection_role !== ROLE_MEMBER && (
        <Menu.Item key="4" className={styles.greyHover}>
          <Link to="/add-member">
            {intl.formatMessage({ id: 'i18n_invite_member' })}
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="5" className={styles.greyHover}>
        <Link to="/zoom-meet">
          {intl.formatMessage({ id: 'i18n_cooperate' })}
        </Link>
      </Menu.Item>
      {localProfile.connection_role !== ROLE_MEMBER && (
        <>
          <Menu.Item key="6" className={styles.greyHover}>
            <Link to="/payment?addPlan=creditCard">
              {intl.formatMessage({ id: 'i18n_account_purchase' })}
            </Link>
          </Menu.Item>
          <Menu.Item key="7" className={styles.greyHover}>
            <Link to="/contract-detail">
              {intl.formatMessage({ id: 'i18n_contract_and_payment' })}
            </Link>
          </Menu.Item>
        </>
      )}
      <Menu.Item key="8" className={styles.greyHover}>
        <a href="#" onClick={handleLogout}>
          {intl.formatMessage({ id: 'i18n_logout' })}
        </a>
      </Menu.Item>
    </Menu>
  );

  const [keyword, setKeyword] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(true);
  const handleMenuClick = e => {
    setDropdownVisible(true);
  };

  const filterValueSearch = (arrFilter, type, keySearch) => {
    return arrFilter.reduce((currentArr, nextItem) => {
      const { name } = nextItem;
      if (name.toLocaleUpperCase().includes(keySearch)) {
        return currentArr.concat({ ...nextItem, type });
      } else {
        return currentArr;
      }
    }, []);
  };
  const redirectAddMember = () => {
    const { is_admin_contract } = listPaginateTeamFull;
    if (!is_admin_contract) {
      return notify();
    }
    history.push('/add-member');
  };

  const renderDataSearch = () => {
    const redirectToMemberItem = item => {
      const { type, id } = item;
      const { tab } = history.location.query;
      let params = `?tab=${tab ? tab : 1}`;
      if (type === 1) {
        params += `&member_id=${id}`;
      }
      if (type === 2) {
        params += `&team_id=${id}`;
      }
      history.push({
        pathname: '/',
        search: params,
      });
    };
    if (!keyword) {
      return (
        <Menu.Item className={styles.unstyleItem} key="1">
          <div className={styles.wrapperProfile}>
            <div className={styles.avatar}>
              <div className={styles.defaultAvatar}>
                <img src={profile.avatar ? profile.avatar : logoImage} />
              </div>
            </div>
            <div className={styles.nameAccount}>{profile.name}</div>
          </div>
        </Menu.Item>
      );
    }

    const keySearch = keyword.trim().toLocaleUpperCase();
    let listValueSearch = [];
    if (listPaginateTeamFull && listPaginateTeamFull.data.length) {
      const listAccount = filterValueSearch(
        listPaginateTeamFull.data,
        1,
        keySearch,
      );
      listValueSearch = [...listValueSearch, ...listAccount];
    }

    if (listTeam && listTeam.length) {
      const listAccount = filterValueSearch(listTeam, 2, keySearch);
      if (listAccount.length) {
        listValueSearch = [...listValueSearch, ...listAccount];
      }
    }

    if (listValueSearch) {
      return listValueSearch.map((item, index) => (
        <Menu.Item
          className={styles.unstyleItem}
          key={index + 33}
          onClick={() => redirectToMemberItem(item)}
        >
          <div
            className={`${styles.wrapperProfile} ${
              item.type === 2 ? styles.wrapperProfileTeam : ''
            }`}
          >
            <div className={styles.avatar}>
              <div className={styles.defaultAvatar}>
                <img src={item.avatar ? item.avatar : logoImage} />
              </div>
            </div>
            <div className={styles.nameAccount}>{item.name}</div>
          </div>
        </Menu.Item>
      ));
    }

    return (
      <Menu.Item className={styles.unstyleItem} key="1">
        <div className={styles.wrapperProfile}>
          <div className={styles.avatar}>
            <div className={styles.defaultAvatar}>
              <img src={profile.avatar ? profile.avatar : logoImage} />
            </div>
          </div>
          <div className={styles.nameAccount}>{profile.name}</div>
        </div>
      </Menu.Item>
    );
  };

  const menuSelectCalendar = () => {
    return (
      <Menu className={styles.dropdownMenuSelectCalendar}>
        <Menu.Item className={styles.unstyleItem} key="0">
          <AutoComplete
            className={styles.customInput}
            onSearch={value => setKeyword(value)}
          >
            <Input prefix={<SearchOutlined />} bordered={false} />
          </AutoComplete>
        </Menu.Item>

        {renderDataSearch()}

        <Menu.Item className={styles.unstyleItem} key="3">
          <div className={styles.titleMain}>
            {intl.formatMessage({ id: 'i18n_all_team_user' })}
          </div>
        </Menu.Item>
        <Menu.Item key="4" className={styles.greyHover}>
          <div className={styles.wrapperUser} onClick={redirectAddMember}>
            <div className={styles.linkAdd}>
              <div className={styles.iconGrey} />
              <p>{intl.formatMessage({ id: 'i18n_user_manager' })}</p>
            </div>
            <div className={styles.linkAdd}>
              {intl.formatMessage({ id: 'i18n_new_apply' })}
            </div>
          </div>
        </Menu.Item>
        <Menu.Item key="5" className={styles.greyHover}>
          <div className={styles.listUser}>
            <div className={styles.iconUser}>
              <img src={userIcon} width="20" height="20" />
            </div>
            <Link
              to={{
                pathname: '/',
                search: `?tab=${
                  history.location.query.tab == 1 ||
                  history.location.query.tab == 2
                    ? history.location.query.tab
                    : 1
                }&member_all=true`,
              }}
            >
              {intl.formatMessage({ id: 'i18n_all_user' })}
            </Link>
          </div>
        </Menu.Item>

        {renderListPaginateTeam()}

        <Menu.Item key="6" className={styles.greyHover}>
          <Link
            to={{
              pathname: '/create-team',
              search: `?tab=${
                history.location.query.tab ? history.location.query.tab : 1
              }`,
            }}
          >
            <div className={styles.wrapperUser}>
              <div className={styles.linkAdd}>
                <span className={styles.iconGreen} />
                <p>{intl.formatMessage({ id: 'i18n_team' })}</p>
              </div>
              <div className={styles.linkAdd}>
                {intl.formatMessage({ id: 'i18n_new_apply' })}
              </div>
            </div>
          </Link>
        </Menu.Item>
        <Menu.Item key="7" className={styles.greyHover}>
          <div className={styles.listUser}>
            <div className={styles.iconUser}>
              <img src={multiUserIcon} width="20" height="20" />
            </div>
            <Link
              to={{
                pathname: '/',
                search: `?tab=${
                  history.location.query.tab == 1 ||
                  history.location.query.tab == 2
                    ? history.location.query.tab
                    : 1
                }&team_all=true`,
              }}
            >
              {intl.formatMessage({ id: 'i18n_all_team' })}
            </Link>
          </div>
        </Menu.Item>
        {renderListTeam()}
      </Menu>
    );
  };

  const renderListPaginateTeam = () => {
    if (!listPaginateTeamFull) {
      return null;
    }
    return (
      listPaginateTeamFull &&
      listPaginateTeamFull.data.map((item, index) => (
        <Menu.Item key={index + 8} className={styles.greyHover}>
          <Link
            to={{
              pathname: '/',
              search: `?tab=${
                history.location.query.tab == 1 ||
                history.location.query.tab == 2
                  ? history.location.query.tab
                  : 1
              }&member_id=${item.id}`,
            }}
          >
            <div className={styles.wrapperProfileMember}>
              <div className={styles.avatar}>
                <div className={styles.defaultAvatar}>
                  <img src={item.avatar ? item.avatar : logoImage} />
                </div>
              </div>
              <div className={styles.nameAccount}>{item.name}</div>
            </div>
          </Link>
        </Menu.Item>
      ))
    );
  };

  const renderListTeam = () => {
    if (!listTeam) {
      return null;
    }

    return listTeam.map((item, index) => (
      <Menu.Item key={index + 100} className={styles.greyHover}>
        <Link
          to={{
            pathname: '/',
            search: `?tab=${
              history.location.query.tab == 1 || history.location.query.tab == 2
                ? history.location.query.tab
                : 1
            }&team_id=${item.id}`,
          }}
        >
          <div
            style={{
              marginLeft: '3.3rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.name}
          </div>
        </Link>
      </Menu.Item>
    ));
  };

  const menuSelectTemplate = () => (
    <EventTemplateModal
      getList
      relationship_type={1}
      // setIsVisible={setIsVisible}
    />
  );

  const menuSettingTemplate = () => {
    const checkExprited = isAnswer => {
      const { is_form_expired } = profile;
      if (is_form_expired || isExpired()) {
        notification.open({
          description: (
            <>
              <div>
                <p>
                  オンライン予約ページをご利用いただくにはお申し込みが必要です。
                </p>
                <p>もしくは、有効期限が切れています。</p>
                <p>
                  オンライン予約ページをご利用いただける場合は、下記よりお問合せください。
                </p>
                <span>
                  <a href="https://info.smoothly.jp/company/">
                    https://info.smoothly.jp/company/
                  </a>
                </span>
              </div>
            </>
          ),
          style: {
            background: '#51B3CD',
            color: '#fff',
          },
          className: styles.notifySettingTemplate,
          icon: (
            <CloseOutlined
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                border: '1px solid',
                borderRadius: '20px',
                padding: '.2rem',
              }}
            />
          ),
          duration: 2,
        });
        return true;
      }
    };

    const onRedirectSetting = () => {
      if (checkExprited()) {
        return;
      }
      setEmbedTemplateVisible(true);
    };

    const onConfirmDeleteTemplate = () => {
      if (checkExprited()) {
        return;
      }
      confirm({
        title: 'フォームを削除しましか？',
        cancelText: 'いいえ',
        okText: 'はい',
        cancelType: 'primary',
        className: styles.confirmDeleteTemplate,
        onOk: () => {
          dispatch({
            type: 'SETTING_TEMPLATE/deleteTemplate',
          });
        },
      });
    };

    const onRedirectViewSetting = async () => {
      if (checkExprited()) {
        return;
      }
      const res = await dispatch({
        type: 'SETTING_TEMPLATE/getDataViewTemplate',
      });
      if (res) {
        historyRouter.push('/view-template');
      }
    };

    const onRedirectViewAnswer = () => {
      historyRouter.push('/view-answers');
    };

    return (
      <Menu className={styles.dropdownSettingTemplate}>
        <Menu.Item
          onClick={onRedirectSetting}
          key="0"
          className={styles.greyHover}
        >
          <img src={calendarTemplateImage} alt="hihi" />
          <span>作成・編集</span>
        </Menu.Item>
        <Menu.Item
          onClick={onConfirmDeleteTemplate}
          key="1"
          className={styles.greyHover}
        >
          <img src={trashTemplateImage} alt="smoothly" />
          <span>削除</span>
        </Menu.Item>
        <Menu.Item
          key="2"
          className={styles.greyHover}
          onClick={onRedirectViewSetting}
        >
          <img src={linkTemplateImage} alt="smoothly" />
          <span>コードのコピー</span>
        </Menu.Item>
        <Menu.Item
          key="3"
          className={styles.greyHover}
          onClick={onRedirectViewAnswer}
        >
          <TeamOutlined style={{ fontSize: '20px' }} />
          {/*<img src={linkTemplateImage} alt="smoothly" />*/}
          <span>顧客管理</span>
        </Menu.Item>
      </Menu>
    );
  };

  const redirectHome = () => {
    history.push('/');
  };
  const redirectQA = () => {
    history.push('/qa');
  };

  const mainHeaderCss = () => {
    let listCss = styles.mainHeader;
    if (hideHeader) {
      listCss += ' ' + styles.hideHeader;
    }
    return listCss;
  };

  const headerCss = () => {
    const { headerSettingAdvance } = availableTimeStore;
    let listCss = styles.header;

    if (cssCalendar) {
      listCss += ' ' + styles.headerCalendar;
    }

    if (headerLogin) {
      listCss += ' ' + styles.headerLogin;
    }

    if (cssCalendarCreationCopy) {
      listCss += ' ' + styles.headerCalendarCopy;
    }

    if (headerSettingAdvance) {
      listCss += ' ' + styles.headerSettingAdvanceCalendar;
    }

    return listCss;
  };

  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const deleteAllEvent = () => {
    dispatch({
      type: 'AVAILABLE_TIME/deleteAllEvent',
    });
  };

  return (
    <div className={mainHeaderCss()} ref={scrollIntoStartView} id="header">
      <div className={headerCss()}>
        <div className={styles.headerTitle}>
          <div className={styles.headerLogo}>
            <div className={styles.imgLogo} onClick={() => redirectHome()} />
          </div>
          {createEventType && (
            <div className={styles.headerTitleText}>
              {intl.formatMessage({
                id: 'i18n_title_header_create_event_type',
              })}
            </div>
          )}
        </div>
        <ul className={styles.headerMenu}>
          {isLogin && (
            <li
              className={`${styles.headerMenuItem} ${styles.homeItem}`}
              onClick={() => history.push('/')}
            >
              <span>{intl.formatMessage({ id: 'i18n_header_menu_1' })}</span>
            </li>
          )}
          {isLogin && (
            <DropdownMenu
              dropdownName={() => (
                <li
                  className={styles.headerMenuItem}
                  onClick={e => e.preventDefault()}
                >
                  <div className="ant-dropdown-link">
                    <span>
                      {intl.formatMessage({ id: 'i18n_header_menu_4' })}
                    </span>
                    <DownOutlined />
                  </div>
                </li>
              )}
              overlay={menuSelectCalendar}
              listCss={styles.dropDownItem}
              style={{ paddingTop: '30px', left: '-80px' }}
              visible={dropdownVisible}
              setVisible={setDropdownVisible}
            />
          )}

          {isLogin && (
            <DropdownMenu
              dropdownName={() => (
                <li
                  className={styles.headerMenuItem}
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <div className="ant-dropdown-link">
                    <span>
                      {intl.formatMessage({ id: 'i18n_header_menu_5' })}
                    </span>
                    <DownOutlined />
                  </div>
                </li>
              )}
              overlay={menuSelectTemplate}
              listCss={styles.dropDownItem}
              visible={isVisible}
              setVisible={setIsVisible}
            />
          )}

          {isLogin && (
            <DropdownMenu
              dropdownName={() => (
                <li
                  className={styles.headerMenuItem}
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <div className="ant-dropdown-link">
                    <span>予約ページ</span>
                    <DownOutlined />
                  </div>
                </li>
              )}
              overlay={menuSettingTemplate}
              listCss={styles.dropDownItem}
              visible={isVisible}
              setVisible={setIsVisible}
            />
          )}

          <li
            className={`${styles.headerMenuItem} ${styles.qAItem}`}
            onClick={() => redirectQA()}
          >
            <span className={styles.fontWeightNormal}>
              {intl.formatMessage({ id: 'i18n_header_menu_2' })}
            </span>
          </li>
          {isLogin && (
            <DropdownMenu
              dropdownName={() => (
                <li
                  className={`${styles.headerMenuItem} ${styles.headerMenuItemLast}`}
                  onClick={e => e.preventDefault()}
                >
                  <div className={styles.headerMenuItemAvt}>
                    <div className={styles.defaultAvatar}>
                      <img src={profile.avatar ? profile.avatar : logoImage} />
                    </div>
                  </div>
                  <div className="ant-dropdown-link">
                    <span className={styles.textAccount}>
                      {intl.formatMessage({ id: 'i18n_header_menu_3' })}
                    </span>
                    <DownOutlined />
                  </div>
                </li>
              )}
              overlay={menu}
              visible={isMenuVisible}
              listCss={styles.dropDownItem}
              setVisible={setIsMenuVisible}
              style={{ right: '-4px' }}
            />
          )}

          <div className={styles.buttonDeleteCalendarContainer}>
            <button
              // className={styles.buttonDeleteCalendarContainer}
              onClick={deleteAllEvent}
            >
              <img src={eraserImage} />
              <span className={styles.buttonDeleteCalendar}>
                {intl.formatMessage({ id: 'i18n_name_delete_button_calendar' })}
              </span>
              <Tooltip
                title={intl.formatMessage({
                  id: 'i18n_description_delete_button_calendar',
                })}
              >
                <img src={helper} className="helper" />
              </Tooltip>
            </button>
          </div>
        </ul>
      </div>
      <DialogChooseSettingTemplate
        visible={embedTemplateVisible}
        closeModal={() => setEmbedTemplateVisible(false)}
      />
    </div>
  );
}

export default connect(
  ({ MASTER, ACCOUNT, AVAILABLE_TIME, TEAM, ACCOUNT_TEAM, FOOTER }) => ({
    masterStore: MASTER,
    accountStore: ACCOUNT,
    teamStore: TEAM,
    accountTeamStore: ACCOUNT_TEAM,
    footerStore: FOOTER,
    availableTimeStore: AVAILABLE_TIME,
  }),
)(withRouter(Header));
