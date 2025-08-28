import Footer from '@/components/Footer';
import { Tabs } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import PastEvents from './PastEvents';
import styles from './styles.less';
import UpComingEvents from './UpComingEvents';

function ListEvent(props) {
  const { TabPane } = Tabs;
  const intl = useIntl();
  const { dispatch, eventStore, masterStore } = props;
  const { profile, defaultActiveKey } = masterStore;
  const { formatMessage } = intl;
  const [visibleModal, setVisibleModal] = useState(false);
  const [syncCalendar, setSyncCalendar] = useState(false);

  // const checkSync = async () => {
  //   if (profile?.id) {
  //     if (profile.type_login === 1 && !syncCalendar) {
  //       await syncGG();
  //     } else if (profile.type_login === 2 && !syncCalendar) {
  //       await syncMicrosoft();
  //     } else {
  //       setSyncCalendar(true);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   checkSync();
  // }, [profile]);

  // const syncMicrosoft = async () => {
  //   const res = await dispatch({
  //     type: 'EVENT/syncMicrosoftCalendar',
  //     payload: {
  //       timeZone: zone.tz.guess(),
  //     },
  //   });
  //   if (res) {
  //     setSyncCalendar(true);
  //   } else {
  //     await dispatch({
  //       type: 'EVENT/syncMicrosoftCalendar',
  //       payload: {
  //         timeZone: zone.tz.guess(),
  //       },
  //     });
  //     setVisibleModal(true);
  //   }
  // };

  // const syncGG = async () => {
  //   const res = await dispatch({
  //     type: 'EVENT/syncGoogleCalendar',
  //     payload: {
  //       start_date: moment()
  //         .hour(0)
  //         .minute(0)
  //         .second(0)
  //         .format('YYYY-MM-DDTHH:mm:ssZ'),
  //     },
  //   });
  //   if (res) {
  //     setSyncCalendar(true);
  //   } else {
  //     await dispatch({
  //       type: 'EVENT/syncGoogleCalendar',
  //       payload: {
  //         start_date: moment()
  //           .hour(0)
  //           .minute(0)
  //           .second(0)
  //           .format('YYYY-MM-DDTHH:mm:ssZ'),
  //       },
  //     });
  //     setVisibleModal(true);
  //   }
  // };
  return (
    <div className={styles.listEvent}>
      {/* <ReLoginPopup
        setVisibleModal={setVisibleModal}
        visibleModal={visibleModal}
        setSyncCalendar={setSyncCalendar}
      /> */}
      <Tabs
        defaultActiveKey="1"
        activeKey={defaultActiveKey}
        onChange={key => {
          switch (key) {
            case '1':
              dispatch({ type: 'MASTER/setDefaultActiveKey', payload: '1' });
              break;
            case '2':
              dispatch({ type: 'MASTER/setDefaultActiveKey', payload: '2' });
              break;

            default:
              break;
          }
        }}
      >
        <TabPane tab={formatMessage({ id: 'i18n_in_comming_event' })} key="1">
          <UpComingEvents />
        </TabPane>
        <TabPane tab={formatMessage({ id: 'i18n_passed_event' })} key="2">
          <PastEvents />
        </TabPane>
      </Tabs>
      <Footer />
    </div>
  );
}

export default connect(({ CALENDAR, MASTER, EVENT }) => ({
  calendarStore: CALENDAR,
  masterStore: MASTER,
  eventStore: EVENT,
}))(ListEvent);
