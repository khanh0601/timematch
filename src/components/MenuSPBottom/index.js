import React, { useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';

import icon01 from '@/assets/images/i-menu-footer-01.png';
import icon01Active from '@/assets/images/i-menu-footer-01-active.png';
import icon02 from '@/assets/images/i-menu-footer-02.png';
import icon02Active from '@/assets/images/i-menu-footer-02-active.png';
import icon03 from '@/assets/images/i-menu-footer-03.png';
import icon03Active from '@/assets/images/i-menu-footer-03-active.png';
import { Menu, Dropdown } from 'antd';

import { TYPE_EVENT_RELATIONSHIP, TYPE_VOTE_RELATIONSHIP } from '@/constant';

import logoCalendar from '@/assets/images/calendar.png';
import logoCheckSuccess from '@/assets/images/check-success.png';
import logoUserGroup from '@/assets/images/user-group.png';
import { connect } from 'dva';
import { profileFromStorage } from '../../commons/function';

function MenuSPBottom(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    setCurrentTab,
    // relationshipType,
    // setRelationshipType,
    dispatch,
    masterStore,
    accountTeamStore,
  } = props;

  const profile = profileFromStorage();
  const location = history.location;
  const {
    listPaginateTeam,
    listPaginateEvents,
    paginateEvents,
  } = accountTeamStore;

  const currentTab =
    location.pathname === '/'
      ? '1'
      : location.pathname === '/calendar'
      ? '2'
      : '3';

  const redirectListEventTypePurpose = () => {
    if (setCurrentTab) {
      setCurrentTab('1');
    }

    const payload = {
      user_id_of_member: profile?.id,
      relationship_type: 3,
      is_finished: 0,
    };

    dispatch({
      type: 'TAB/getOnePaginateAdjustingEventsMember',
      payload,
    });

    history.push('/');
  };

  const createEventType = click_event => {
    const menu = [
      {
        type: TYPE_EVENT_RELATIONSHIP,
        isOneTime: 0,
      },
      {
        type: TYPE_EVENT_RELATIONSHIP,
        isOneTime: 1,
      },
      {
        type: TYPE_VOTE_RELATIONSHIP,
        isOneTime: 0,
      },
    ];

    if (history.location.query.team_id) {
      history.push(
        `/calendar-creation?relationship_type=${
          menu[click_event['key']].type
        }&team_id=${history.location.query.team_id}&isOneTime=${
          menu[click_event['key']].isOneTime
        }`,
      );
    } else if (history.location.query.member_id) {
      history.push(
        `/calendar-creation?relationship_type=${
          menu[click_event['key']].type
        }&member_id=${history.location.query.member_id}&isOneTime=${
          menu[click_event['key']].isOneTime
        }`,
      );
    } else if (history.location.query.member_all) {
      history.push(
        `/calendar-creation?relationship_type=${
          menu[click_event['key']].type
        }&member_id=${listPaginateEvents[0].id}&isOneTime=${
          menu[click_event['key']].isOneTime
        }`,
      );
    } else if (history.location.query.team_all) {
      history.push(
        `/calendar-creation?relationship_type=${
          menu[click_event['key']].type
        }&team_id=${listPaginateTeam.data[0].id}&isOneTime=${
          menu[click_event['key']].isOneTime
        }`,
      );
    } else {
      if (currentTab === '2') {
        history.push(
          `/calendar-creation?relationship_type=${
            menu[click_event['key']].type
          }&team_id=${paginateEvents.id}&isOneTime=${
            menu[click_event['key']].isOneTime
          }`,
        );
      } else {
        history.push(
          `/calendar-creation?relationship_type=${
            menu[click_event['key']].type
          }&member_id=${profile?.id}&isOneTime=${
            menu[click_event['key']].isOneTime
          }`,
        );
      }
    }
  };

  const menuAdd = (
    <Menu
      className={styles.menuCreateRoom}
      onClick={click_event => createEventType(click_event)}
    >
      <Menu.Item key="0" icon={<img src={logoCalendar} width={32} />}>
        <h4>日程調整ページを作成</h4>
        <p>何度も繰り返し日程調整できるURLを発行</p>
      </Menu.Item>
      <Menu.Item key="1" icon={<img src={logoCheckSuccess} width={32} />}>
        <h4>1回限りの日程調整 </h4>
        <p>1回限りの日程調整URLを発行</p>
      </Menu.Item>
      <Menu.Item key="2" icon={<img src={logoUserGroup} width={32} />}>
        <h4>投票ページを作成</h4>
        <p>複数社が、投票形式で日程調整できる機能</p>
      </Menu.Item>
    </Menu>
  );
  const menuReservationList = (
    <Menu
    //  onClick={click_event => createEventType(id, click_event)}
    >
      <Menu.Item key="0">
        <li
          onClick={() => {
            history.push('/?tab=2');
            dispatch({ type: 'MASTER/setDefaultActiveKey', payload: '1' });
          }}
        >
          今後の予定
        </li>
      </Menu.Item>
      <Menu.Item key="1">
        <li
          onClick={() => {
            history.push('/?tab=2');
            dispatch({ type: 'MASTER/setDefaultActiveKey', payload: '2' });
          }}
        >
          過去の予定
        </li>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.xsMenu}>
      <div className={styles.fixed}>
        <ul className={styles.menu}>
          <li
            onClick={() => redirectListEventTypePurpose()}
            className={`${styles.menuItem} ${
              currentTab === '1' ? styles.active : ''
            }`}
          >
            <img src={icon01Active} className={styles.imgActive} />
            <img src={icon01} className={styles.imgNonActive} />
            <div className={`${styles.textList} ${styles.text}`}>調整一覧</div>
          </li>

          <li
            onClick={() => {
              history.push('/calendar');
            }}
            className={`${styles.menuItem} ${
              currentTab === '2' ? styles.active : ''
            }`}
          >
            <img src={icon02Active} className={styles.imgActive} />
            <img src={icon02} className={styles.imgNonActive} />
            <div className={`${styles.textCreate} ${styles.text}`}>
              カレンダー
            </div>
          </li>
          <li
            onClick={() => {
              history.push('/menu');
            }}
            className={`${styles.menuItem} ${
              currentTab === '3' ? styles.active : ''
            }`}
          >
            <img src={icon03Active} className={styles.imgActive} />
            <img src={icon03} className={styles.imgNonActive} />
            <div className={`${styles.textList} ${styles.text}`}>メニュー</div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default connect(({ CALENDAR, MASTER, EVENT, ACCOUNT_TEAM }) => ({
  calendarStore: CALENDAR,
  masterStore: MASTER,
  eventStore: EVENT,
  accountTeamStore: ACCOUNT_TEAM,
}))(MenuSPBottom);
