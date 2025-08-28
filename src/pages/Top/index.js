import helper from '@/assets/images/imgQuestion.png';
import MenuSPBottom from '@/components/MenuSPBottom';
import { Tabs, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState, useCallback } from 'react';
import { useIntl, withRouter } from 'umi';
import './styles.less';
import AdjustmentList from './AdjustmentList';
import Header from './Header';
import PlusIcon from './icon/PlusIcon';
import SwipableItem from '@/components/SwipableItem';
import { history } from 'umi';
import UpComingEvent from './UpcomingEvent';
import PastEvent from './PastEvent';
import AllEvent from './AllEvent';

function TopPage(props) {
  const { location, calendarStore, dispatch } = props;
  const { TabPane } = Tabs;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [currentTab, setCurrentTab] = useState('1');

  useEffect(() => {
    dispatch({ type: 'EVENT/clearDetailEventType', payload: {} });
  }, []);

  useEffect(() => {
    const { query } = location;
    if (query.tab) {
      setCurrentTab(query.tab);
    }
  }, [location.query.tab]);
  const onScrollTop = useCallback(() => {
    var my_element = document.getElementById('first-item');
    my_element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }, []);
  return (
    <div className="eventManage">
      <Header onScrollTop={onScrollTop} />
      <Tabs
        activeKey={currentTab}
        onChange={setCurrentTab}
        className="eventManageTabs"
      >
        <TabPane
          tab={
            <div
              onClick={() => {
                history.push('/?tab=1');
              }}
              className="tabName"
            >
              <span>{formatMessage({ id: 'i18n_all_adjustment_list' })}</span>
            </div>
          }
          key="1"
        >
          <AllEvent />
        </TabPane>
        <TabPane
          tab={
            <div
              onClick={() => {
                history.push('/?tab=2');
              }}
              className="tabName"
            >
              <span>{formatMessage({ id: 'i18n_adjusting_list' })}</span>
            </div>
          }
          key="2"
        >
          <UpComingEvent />
        </TabPane>
        <TabPane
          tab={
            <div
              onClick={() => {
                history.push('/?tab=3');
              }}
              className="tabName"
            >
              {formatMessage({ id: 'i18n_adjustment' })}
            </div>
          }
          key="3"
        >
          <PastEvent />
        </TabPane>
      </Tabs>
      <div
        style={{
          position: 'sticky',
          bottom: 80,
          zIndex: 5,
          background: '#6996ff',
          width: 40,
          height: 40,
          borderRadius: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          right: 10,
          float: 'right',
        }}
        onClick={() => {
          history.push('/create-calendar');
        }}
      >
        <PlusIcon />
      </div>
      <MenuSPBottom />
    </div>
  );
}

export default connect(({ CALENDAR }) => ({ calendarStore: CALENDAR }))(
  withRouter(TopPage),
);
