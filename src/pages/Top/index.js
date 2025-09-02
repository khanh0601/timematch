import MenuSPBottom from '@/components/MenuSPBottom';
import { Tabs } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState, useCallback } from 'react';
import { useIntl, withRouter } from 'umi';
import './styles.less';
import Header from './Header';
import PlusIcon from './icon/PlusIcon';
import { history } from 'umi';
import UpComingEvent from './UpcomingEvent';
import PastEvent from './PastEvent';
import { profileFromStorage } from '@/commons/function';
import useIsMobile from '@/hooks/useIsMobile';
import TopPagePC from './PC';

function TopPage(props) {
  const { location, calendarStore, dispatch } = props;
  const { TabPane } = Tabs;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [currentTab, setCurrentTab] = useState('1');
  const profile = profileFromStorage();
  const [isDataEvent, setIsDataEvent] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch({ type: 'EVENT/clearDetailEventType', payload: {} });
  }, []);

  useEffect(() => {
    const { query } = location;
    setCurrentTab(query.tab || '1');
    if (query.tab) {
      setIsDataEvent(false);
    }
  }, [location.query.tab]);

  useEffect(() => {
    handleScrollCurrentTime();
  }, [isDataEvent]);

  const handleScrollCurrentTime = useCallback(() => {
    const currentTime = document.querySelectorAll('.swipableItem');
    const currentTimeArray = Array.from(currentTime).map(item =>
      item.getAttribute('data-current-time'),
    );
    const currentTimeArrayFiltered = currentTimeArray.filter(
      item => new Date(item) > new Date(),
    );
    const currentTimeArrayFilteredSorted = currentTimeArrayFiltered.sort(
      (a, b) => new Date(a) - new Date(b),
    );
    const firstItem = currentTimeArrayFilteredSorted[0];
    const index =
      window.location.search !== '?tab=2'
        ? 0
        : currentTimeArray.indexOf(firstItem);
    const element = document.querySelectorAll('.swipableItem')[index];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, []);

  const onScrollTop = () => {
    handleScrollCurrentTime();
  };

  const getAdjustingEvents = () => {
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

    handleScrollCurrentTime();
  };

  const getAdjustedEvents = () => {
    const payload = {
      user_id_of_member: profile?.id,
      relationship_type: 3,
      is_finished: 1,
    };

    dispatch({
      type: 'TAB/getOnePaginateAdjustedEventsMember',
      payload,
    });

    history.push('/?tab=2');
  };

  const getTabContentStyle = () => {
    return currentTab === '1' ? { marginTop: '100px' } : { marginTop: '150px' };
  };

  if (!isMobile) {
    return (
      <TopPagePC
        getAdjustingEvents={getAdjustingEvents}
        getAdjustedEvents={getAdjustedEvents}
        setIsDataEvent={setIsDataEvent}
        onScrollTop={onScrollTop}
        currentTab={currentTab}
      />
    );
  }

  return (
    <div className="eventManage">
      <Header />
      <Tabs
        activeKey={currentTab}
        onChange={setCurrentTab}
        className="eventManageTabs"
      >
        <TabPane
          tab={
            <div onClick={() => getAdjustingEvents()} className="tabName">
              <span>{formatMessage({ id: 'i18n_adjusting_list' })}</span>
            </div>
          }
          key="1"
        >
          <div style={getTabContentStyle()}>
            <UpComingEvent calHeight={100} />
          </div>
        </TabPane>
        <TabPane
          tab={
            <div onClick={() => getAdjustedEvents()} className="tabName">
              {formatMessage({ id: 'i18n_adjustment' })}
            </div>
          }
          key="2"
        >
          <div className="todayFixed">
            <button className="todayFixedBtn" onClick={() => onScrollTop()}>
              今日
            </button>
          </div>
          <div style={getTabContentStyle()}>
            <PastEvent onDataEvent={setIsDataEvent} calHeight={150} />
          </div>
        </TabPane>
      </Tabs>
      <div
        style={{
          position: 'sticky',
          bottom: 80,
          zIndex: 5,
          background: '#3368c7',
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
      <MenuSPBottom currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default connect(({ CALENDAR }) => ({ calendarStore: CALENDAR }))(
  withRouter(TopPage),
);
