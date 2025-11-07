import PCHeader from '@/components/PC/Header';
import { connect } from 'dva';
import { withRouter, useIntl, history } from 'umi';
import FooterMobile from '@/components/Mobile/Footer';
import styles from './styles.less';
import { PlusOutlined } from '@ant-design/icons';
import UpComingEvent from '../UpcomingEvent';
import PastEvent from '../PastEvent';
import './stylesPc.less';
import SearchIcon from '../icon/SearchIcon';
import { useEffect, useState } from 'react';
import { profileFromStorage } from '@/commons/function';
import { useDispatch } from 'dva';
import EventDetailModal from './components/EventDetailModal';
import PastEventDetailModal from './components/PastEventDetailModal';
import { eventDeleteEvent } from '@/util/eventBus';
import useIsPc from '@/hooks/useIsPc';
import useIsMobile from '@/hooks/useIsMobile';

const initEventDetail = {
  eventId: null,
  eventName: null,
};
const initPastEventDetail = {
  eventId: null,
  eventName: null,
  chooseSchedule: null,
  role: null,
};

function TopPagePC(props) {
  const isPc = useIsPc();
  const isMobile = useIsMobile();
  const [searchValue, setSearchValue] = useState('');
  const [eventDetail, setEventDetail] = useState(initEventDetail);
  const [pastEventDetail, setPastEventDetail] = useState(initPastEventDetail);

  const profile = profileFromStorage();

  const intl = useIntl();
  const dispatch = useDispatch();

  const { formatMessage } = intl;

  const isTab2 = props.currentTab === '2';

  const payloadAdjusted = {
    user_id_of_member: profile?.id,
    relationship_type: 3,
    is_finished: 1,
    keyword: searchValue,
  };

  const payloadAdjusting = {
    user_id_of_member: profile?.id,
    relationship_type: 3,
    is_finished: 0,
    keyword: searchValue,
  };

  useEffect(() => {
    if (!isTab2) {
      dispatch({
        type: 'TAB/getOnePaginateAdjustingEventsMember',
        payload: payloadAdjusting,
      });
    }

    if (isTab2) {
      dispatch({
        type: 'TAB/getOnePaginateAdjustedEventsMember',
        payload: payloadAdjusted,
      });
    }
  }, [searchValue, profile?.id, isTab2]);

  useEffect(() => {
    setSearchValue('');
  }, [props.currentTab]);

  const handleShowModalDetail = event => {
    setEventDetail(event);
  };
  const handleShowModalPastDetail = event => {
    setPastEventDetail(event);
  };

  const handleCloseModal = () => {
    setEventDetail(initEventDetail);
  };
  const handleCloseModalPast = () => {
    setPastEventDetail(initPastEventDetail);
  };

  const handleRefreshUpcomingEvent = payload => {
    dispatch({
      type: 'TAB/deleteAdjustingEvents',
      payload,
    });
  };

  const handleRefreshPastEvent = payload => {
    dispatch({
      type: 'TAB/deleteAdjustedEvents',
      payload,
    });
  };

  return (
    <div>
      <PCHeader />

      <div className={styles.mainContainer}>
        {/* Left panel */}

        {/* right panel */}
        <div className={styles.rightPanel}>
          <div className={styles.rightPanelTop}>
            <div className={styles.rightPanelTopTitle}>
              <span>調整一覧</span>
            </div>
            {isPc && (
              <div
                className={styles.btnCalendar}
                onClick={() => {
                  history.push('/pc/calendar');
                }}
              >
                <span>カレンダーを見る</span>
              </div>
            )}
            {isMobile && (
              <button className={styles.btnToday} onClick={props.onScrollTop}>
                今日
              </button>
            )}
          </div>
          <div className={styles.headerPanel}>
            <div className={styles.btnGroup}>
              <div
                className={`${styles.btnGroupItem} ${!isTab2 &&
                  styles.btnGroupItemActive}`}
                onClick={props.getAdjustingEvents}
              >
                調整中
              </div>
              <div
                className={`${styles.btnGroupItem} ${isTab2 &&
                  styles.btnGroupItemActive}`}
                onClick={props.getAdjustedEvents}
              >
                <span>調整済み</span>
              </div>
              <div
                className={styles.btnEvent}
                onClick={() => history.push('/pc/create-calendar')}
              >
                <PlusOutlined className={styles.btnEventIcon} />
                <span className={styles.btnEventText}>
                  {formatMessage({ id: 'i18n_top_pc_create_event' })}
                </span>
              </div>
            </div>
            <div className={styles.searchPanel}>
              <div className={styles.searchInputPanel}>
                <input
                  type="text"
                  className={styles.searchInput}
                  onChange={e => setSearchValue(e.target.value)}
                  value={searchValue}
                  // onKeyDown={e => {
                  //   if (e.key === 'Enter') {
                  //     // props.onSearch();
                  //   }
                  // }}
                />
                <SearchIcon fill={'#3368c7'} width={24} height={24} />
              </div>

              {isTab2 && (
                <button className={styles.btnToday} onClick={props.onScrollTop}>
                  今日
                </button>
              )}
            </div>
          </div>

          <div className={`${styles.contentPanel} top-pc`}>
            <div className={styles.eventList}>
              {isTab2 ? (
                <PastEvent
                  blockSwipe
                  onDataEvent={props.setIsDataEvent}
                  calHeight={150}
                  onClickDetail={handleShowModalPastDetail}
                />
              ) : (
                <UpComingEvent
                  blockSwipe
                  calHeight={100}
                  onClickDetail={handleShowModalDetail}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <FooterMobile />

      {eventDetail.eventId && (
        <EventDetailModal
          {...eventDetail}
          onClose={handleCloseModal}
          onRefresh={handleRefreshUpcomingEvent}
        />
      )}

      {pastEventDetail.eventId && (
        <PastEventDetailModal
          {...pastEventDetail}
          onClose={handleCloseModalPast}
          onRefresh={handleRefreshPastEvent}
        />
      )}
    </div>
  );
}
export default connect(({ CALENDAR, TAB }) => ({
  calendarStore: CALENDAR,
  tabStore: TAB,
}))(withRouter(TopPagePC));
