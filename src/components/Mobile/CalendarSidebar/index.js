import { Drawer, Collapse, Spin, notification, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import {
  formatMessage,
  history,
  Link,
  useHistory,
  useIntl,
  withRouter,
} from 'umi';
import styles from './styles.less';
import { profileFromStorage } from '@/commons/function';
import { PlusOutlined } from '@ant-design/icons';

const CalendarSidebar = props => {
  const intl = useIntl();
  const {
    dispatch,
    isSidebar,
    isCloseSidebar,
    showModal,
    onChecked,
    isMyCalendar,
    isOtherCalendar,
  } = props;
  const profile = profileFromStorage();
  const { Panel } = Collapse;
  const [loading, setLoading] = useState(false);

  const handleTest = () => {
    return (
      <div class="info">
        <img src={profile?.avatar} width={25} />
        <span>{profile?.name}</span>
      </div>
    );
  };

  const renderCheckboxes = calendarList =>
    calendarList.map((member, index) => (
      <div key={index}>
        <Checkbox
          style={{
            '--background-color': member.color,
            '--border-color': member.color,
          }}
          checked={member.checked}
          className={styles.listCheckBoxTeamMember}
          onChange={e => onChecked(e.target.checked, member)}
        >
          <span title={member.email} className={styles.lineClamp}>
            {member.hide
              ? `${formatMessage({ id: 'i18n_anonymous_member' })}${
                  member.hide
                }`
              : member.name
              ? member.name
              : member.email}
          </span>
        </Checkbox>
      </div>
    ));

  return (
    <Spin spinning={loading}>
      <Drawer
        placement={'left'}
        closable={false}
        onClose={isCloseSidebar}
        open={isSidebar}
        key={'left'}
        width={300}
        className={styles.sidebarContainer}
      >
        <Collapse
          defaultActiveKey={['1']}
          expandIconPosition={'end'}
          className={styles.sidebarItem}
        >
          <Panel
            header={formatMessage({ id: 'i18n_individual_title' })}
            key="1"
          >
            <Collapse
              defaultActiveKey={['1']}
              expandIconPosition={'end'}
              className={styles.sidebarItem}
            >
              <Panel header={handleTest()} key="1">
                <Collapse
                  expandIconPosition={'end'}
                  className={`${styles.sidebarItem} ${styles.notWeight}`}
                  defaultActiveKey={['1', '2']}
                >
                  <Panel
                    header={formatMessage({ id: 'i18n_my_calendar' })}
                    key="1"
                  >
                    {renderCheckboxes(isMyCalendar)}
                  </Panel>
                  {/*<Panel*/}
                  {/*  header={formatMessage({ id: 'i18n_other_calendar' })}*/}
                  {/*  key="2"*/}
                  {/*>*/}
                  {/*  {renderCheckboxes(isOtherCalendar)}*/}
                  {/*</Panel>*/}
                </Collapse>
              </Panel>
            </Collapse>
          </Panel>
        </Collapse>
        {/*<Button onClick={showModal} className={styles.addCalendarBtn}>*/}
        {/*  <PlusOutlined twoToneColor="#263240" />*/}
        {/*  {formatMessage({ id: 'i18n_add_calendar' })}*/}
        {/*</Button>*/}
      </Drawer>
    </Spin>
  );
};

export default connect(
  ({ MASTER, ACCOUNT, AVAILABLE_TIME, TEAM, ACCOUNT_TEAM, FOOTER }) => ({
    masterStore: MASTER,
    accountStore: ACCOUNT,
    teamStore: TEAM,
    accountTeamStore: ACCOUNT_TEAM,
    footerStore: FOOTER,
    availableTimeStore: AVAILABLE_TIME,
  }),
)(withRouter(CalendarSidebar));
