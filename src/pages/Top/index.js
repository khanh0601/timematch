import MenuSPBottom from '@/components/MenuSPBottom';
import { Tabs } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState, useCallback } from 'react';
import { useIntl, withRouter } from 'umi';
import './styles.less';
import PCHeader from '@/components/PC/Header';
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

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Tìm item có ngày gần với ngày hiện tại nhất
    let closestItem = null;
    let minDiff = Infinity;
    let closestIndex = -1;

    currentTimeArray.forEach((dateStr, index) => {
      if (!dateStr) return;

      const itemDate = new Date(dateStr);
      const itemDay = new Date(
        itemDate.getFullYear(),
        itemDate.getMonth(),
        itemDate.getDate(),
      );
      const diff = Math.abs(itemDay - today);

      if (diff < minDiff) {
        minDiff = diff;
        closestItem = dateStr;
        closestIndex = index;
      }
    });
    console.log('closestIndex:', closestIndex);
    const element = document.querySelectorAll('.swipableItem')[closestIndex];
    console.log('element:', element);
    if (element) {
      // Tìm scroll container - có thể là eventList (CSS Modules) hoặc simplebar
      const scrollContainer =
        document.querySelector('[class*="eventList"]') ||
        document.querySelector('.simplebar-content-wrapper');

      const headerElement = document.querySelector('.upcomming_head');
      const headerHeight = headerElement ? headerElement.offsetHeight : 0;
      const offsetPosition = element.offsetTop - headerHeight;

      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
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

  return (
    <TopPagePC
      getAdjustingEvents={getAdjustingEvents}
      getAdjustedEvents={getAdjustedEvents}
      setIsDataEvent={setIsDataEvent}
      onScrollTop={onScrollTop}
      currentTab={currentTab}
    />
  );

  // return (
  //   <div className="eventManage">
  //     <PCHeader />
  //     <Tabs
  //       activeKey={currentTab}
  //       onChange={setCurrentTab}
  //       className="eventManageTabs"
  //     >
  //       <TabPane
  //         tab={
  //           <div onClick={() => getAdjustingEvents()} className="tabName">
  //             <span>{formatMessage({ id: 'i18n_adjusting_list' })}</span>
  //           </div>
  //         }
  //         key="1"
  //       >
  //         <div style={getTabContentStyle()}>
  //           <UpComingEvent calHeight={100} />
  //         </div>
  //       </TabPane>
  //       <TabPane
  //         tab={
  //           <div onClick={() => getAdjustedEvents()} className="tabName">
  //             {formatMessage({ id: 'i18n_adjustment' })}
  //           </div>
  //         }
  //         key="2"
  //       >
  //         <div className="todayFixed">
  //           <button className="todayFixedBtn" onClick={() => onScrollTop()}>
  //             今日
  //           </button>
  //         </div>
  //         <div style={getTabContentStyle()}>
  //           <PastEvent onDataEvent={setIsDataEvent} calHeight={150} />
  //         </div>
  //       </TabPane>
  //     </Tabs>
  //     <div
  //       style={{
  //         position: 'sticky',
  //         bottom: 80,
  //         zIndex: 5,
  //         background: '#3368c7',
  //         width: 56,
  //         height: 56,

  //         borderRadius: '50%',
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         right: 16,
  //         float: 'right',
  //       }}
  //       onClick={() => {
  //         history.push('/create-calendar');
  //       }}
  //     >
  //       <PlusIcon />
  //     </div>
  //     {/* <MenuSPBottom currentTab={currentTab} setCurrentTab={setCurrentTab} /> */}
  //   </div>
  // );
}

export default connect(({ CALENDAR }) => ({ calendarStore: CALENDAR }))(
  withRouter(TopPage),
);
