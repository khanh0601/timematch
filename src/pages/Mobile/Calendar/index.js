import { connect } from 'dva';
import config from '@/config';
import React, { useEffect, useState, useCallback } from 'react';
import { useIntl, useDispatch, Link } from 'umi';
import { Spin, Modal, Button } from 'antd';
import { EVENT_RELATIONSHIP_TYPE, ROUTER } from '@/constant';
import HeaderMobile from '@/components/Mobile/Header';
import MenuSPBottom from '@/components/MenuSPBottom';
import Navigation from '@/components/Mobile/Navigation';
import styles from './styles.less';
import iconGoogle from '@/assets/images/google.png';
import iconOffice from '@/assets/images/microsoft.png';
import useWindowDimensions from '@/commons/useWindowDimensions';
import {
  memberCheckedMobile,
  nextWeek,
  prevWeek,
  sendAddMemberEmail,
  setCalendarRef,
  setCheckedGenerateBlockCalendar,
  setDataEventMobile,
  setBlockCalendar,
  setViewEventCalendar,
  setCurrentStartDate,
} from '@/components/Mobile/AvailableTime/actions';
import { syncCalendar, loadingData } from '@/pages/Mobile/Calendar/actions';
import moment from 'moment';
import AvailableTime from '@/components/Mobile/AvailableTime';
import { createTimeAsync, profileFromStorage } from '../../../commons/function';
import { history } from 'umi';
import PlusIcon from '../../Top/icon/PlusIcon';
import CalendarSidebar from '@/components/Mobile/CalendarSidebar';
import TeamList from '@/components/Mobile/AvailableTime/components/TeamList';
import { v4 as uuidv4 } from 'uuid';
import { useSwipeable } from 'react-swipeable';

function Calendar(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    onSetCalendarRef,
    availableTime,
    calendarCreationStore,
    eventStore,
    // action
    onSendAddMemberEmail,
    onPrevWeek,
    onNextWeek,
    onDeleteEvent,
    onMemberChecked,
    onSyncCalendar,
    onLoadingData,
    onCheckedGenerateBlockCalendar,
    onSetDataEventMobile,
    onSetBlockCalendar,
    onSetViewEventCalendar,
    onSetCurrentStartDate,
  } = props;

  // state
  const { sync } = calendarCreationStore;
  const { listEventType, totalEventType } = eventStore;
  const {
    loading,
    calendarHeaders,
    displayEvents,
    calendarRef,
    memberMobile,
    viewEventCalendar,
    currentStartDate,
  } = availableTime;

  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const pageSize = 1000000;
  const profile = profileFromStorage();

  // loading
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const [currentTab, setCurrentTab] = useState('2');
  const [createEventType, setCreateEventType] = useState(false);
  const calendarParentRef = React.useRef();
  const [dateIncrement, setDateIncrement] = useState(3);
  const [firstDay, setFirstDay] = useState(moment().isoWeekday());
  const [modalVisible, setModalVisible] = useState(false);
  // const [viewEventCalendar, setViewEventCalendar] = useState(3);
  const [selected, onSelect] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [isKeepAvailableTime, setIsKeepAvailableTime] = useState([]);
  const [isMemoEventMobile, setIsMemoEventMobile] = useState({});
  const [isSidebar, setIsSidebar] = useState(false);
  const [provider, setProvider] = useState(false);
  const [isSelectMonth, setIsSelectMonth] = useState(false);
  const [isSelectYear, setIsSelectYear] = useState(false);
  const [changeMonth, setChangeMonth] = useState(null);
  const [changeYear, setChangeYear] = useState(null);
  const [modalTeamVisible, setModalTeamVisible] = useState(false);
  const teamId = Number(history.location.query.team_id) || null;
  const memberId = Number(history.location.query.member_id) || null;
  const eventId = Number(history.location.query.idEvent) || null;
  const isClone = Number(history.location.query.clone) || 0;
  const currentDate = history.location.query.currentDate || null;
  const [isMyCalendar, setIsMyCalendar] = useState([]);
  const [isOtherCalendar, setIsOtherCalendar] = useState([]);
  const [currentTime, setcurrentTime] = useState(
    moment().format('HH') + ':00:00',
  );

  useEffect(() => {
    onSetCalendarRef(React.createRef());
    onCheckedGenerateBlockCalendar({});
    if (profile?.id) {
      onSyncCalendar(profile);
    }
  }, []);

  useEffect(() => {
    if (sync) {
      onLoadingData(
        teamId,
        memberId,
        eventId,
        profile,
        isClone,
        createTimeAsync(),
      );
    }
  }, [sync]);

  useEffect(() => {
    if (memberMobile.length > 0) {
      setIsMyCalendar(memberMobile.filter(item => item.provider === null));
      setIsOtherCalendar(
        memberMobile.filter(item => item.provider !== null && item.email),
      );
    }
  }, [memberMobile]);

  // Hook ensures that the firstDay state variable always reflects the first day in the calendarHeaders array
  // or the current day of the week if calendarHeaders is not defined or empty.
  useEffect(() => {
    const firstDay =
      calendarHeaders && calendarHeaders.length
        ? calendarHeaders[0].weekDay
        : moment().isoWeekday();
    setFirstDay(firstDay);
  }, [calendarHeaders]);

  const getList = useCallback(() => {
    const payload = {
      relationship_type: EVENT_RELATIONSHIP_TYPE.vote,
      pageSize: pageSize,
      page: pageIndex,
      has_pagination: false,
    };

    dispatch({ type: 'EVENT/getListEventTypeMobile', payload });
  }, [pageIndex, pageSize]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    if (!totalEventType <= 0 && !listEventType) {
      return;
    }
    const namePattern = /[?&]name=([^&]+)/;

    const flatDataEventVoted = listEventType.flatMap(item => {
      const uuidFullURL = item.vote.full_url.match(namePattern);
      return item.calendars.map(calendar => ({
        start_time: calendar.start_time,
        end_time: moment(calendar.start_time)
          .add(calendar.block_number, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
        id: item.id,
        srcId: uuidFullURL ? uuidFullURL[1] : null,
        name: calendar.event_name,
        isEventClose: true,
        slugURL: item.vote.slug,
        eventByUser: item.user_id,
        uuidVote: uuidFullURL ? uuidFullURL[1] : null,
      }));
    });

    const flatDataEventVote = listEventType.flatMap(item => {
      const uuidFullURL = item.vote.full_url.match(namePattern);
      return item.event_datetimes.map(calendar => ({
        start_time: calendar.start_time,
        end_time: calendar.end_time,
        id: item.id,
        srcId: item.id,
        name: item.name,
        backgroundColor: '#FFFFFF',
        borderColor: '#3368C7',
        textColor: '#3368C7',
        isEventClose: false,
        slugURL: item.vote.slug,
        eventByUser: item.user_id,
        uuidVote: uuidFullURL ? uuidFullURL[1] : null,
      }));
    });

    const mergeDataEvent = flatDataEventVoted.concat(flatDataEventVote);

    const flatDataEvent = mergeDataEvent.map(item => ({
      ...item,
      end: item.end_time,
      start: item.start_time,
      srcId: item.srcId ?? uuidv4(),
      title: item.name ?? '',
      editable: false,
    }));

    onSetDataEventMobile(flatDataEvent);
  }, [listEventType]);

  // Listen to the date starting from the calendar screen
  useEffect(() => {
    if (currentStartDate && calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      calendar.gotoDate(currentStartDate);
      setChangeMonth(moment(currentStartDate).format('MM'));
      setChangeYear(moment(currentStartDate).format('YYYY'));
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment(calendar.view.currentStart).format(`YYYY-MM-DD`),
          endTime: moment(calendar.view.currentEnd).format(`YYYY-MM-DD`),
        },
      });
    }
  }, [currentStartDate, calendarRef]);

  const addTimeBlock = info => {
    const formatBlockTime = moment(info.dateStr, 'YYYY-MM-DD HH:mm:00').format(
      'YYYY-MM-DD HH:mm:00',
    );

    // is true when the user clicks on the calendar to create a new event block
    onSetBlockCalendar(formatBlockTime, true);
    history.push('/create-calendar');
  };

  const showModal = () => {
    setIsSidebar(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const showSidebar = () => {
    setIsSidebar(true);
  };

  const handleChangeViewEventCalendar = async (key, val) => {
    setLoadingCalendar(true);
    setDateIncrement(val);
    if (key === 'view') {
      onSetViewEventCalendar(val);
      // setViewEventCalendar(val);
    }
    if (key === 'prev') {
      await onPrevWeek(val);
    }
    if (key === 'next') {
      await onNextWeek(val);
    }
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      calendar.scrollToTime(currentTime);
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment(calendar.view.currentStart).format(`YYYY-MM-DD`),
          endTime: moment(calendar.view.currentEnd).format(`YYYY-MM-DD`),
        },
      });
      setChangeMonth(moment(calendar.view.currentStart).format('MM'));
      setChangeYear(moment(calendar.view.currentStart).format('YYYY'));
      onSetCurrentStartDate(
        moment(calendar.view.currentStart).format('YYYY-MM-DD'),
      );
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 1000);
  };

  const handleOnTodayEvent = () => {
    setLoadingCalendar(true);
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      calendar.today();
      setIsSelectMonth(!isSelectMonth);
      setIsSelectYear(!isSelectYear);
      calendar.scrollToTime(currentTime);
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 1000);
  };

  const handleOnSelectMonth = (month, year) => {
    setLoadingCalendar(true);
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment()
            .month(Number(month) - 1)
            .startOf('months')
            .format(`${year}-${month.toString().padStart(2, '0')}-DD`),
          endTime: moment()
            .month(Number(month) - 1)
            .endOf('months')
            .format(`${year}-${month.toString().padStart(2, '0')}-DD`),
        },
      });
      calendar.gotoDate(
        moment().format(`${year}-${month.toString().padStart(2, '0')}-01`),
      );
      calendar.scrollToTime(currentTime);
      onSetCurrentStartDate(
        moment().format(`${year}-${month.toString().padStart(2, '0')}-01`),
      );
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 2000);
  };

  const handleOnSelectYear = (year, month) => {
    setLoadingCalendar(true);
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment()
            .year(Number(year))
            .startOf('year')
            .format(`${year}-${month.toString().padStart(2, '0')}-DD`),
          endTime: moment()
            .year(Number(year))
            .endOf('year')
            .format(`${year}-${month.toString().padStart(2, '0')}-DD`),
        },
      });
      calendar.gotoDate(
        moment().format(`${year}-${month.toString().padStart(2, '0')}-01`),
      );
      calendar.scrollToTime(currentTime);
      onSetCurrentStartDate(
        moment().format(`${year}-${month.toString().padStart(2, '0')}-01`),
      );
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 2000);
  };

  const isCloseSidebar = () => {
    setIsSidebar(false);
  };

  const handleSetProvider = provider => () => {
    setModalVisible(false);
    setProvider(provider);
    setModalTeamVisible(true);
  };

  const closeModalTeam = () => {
    setModalTeamVisible(false);
  };

  const onChangeCheckedMember = (e, member) => {
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    const timeAsync = {
      startTime,
      endTime,
    };
    const payload = {
      checked: e,
      member,
      timeAsync,
    };

    onMemberChecked(payload);
  };

  const handleClickNextMonth = () => {
    if (calendarRef && calendarRef?.current) {
      const calendar = calendarRef.current.getApi();
      calendar.next();
      calendar.scrollToTime(currentTime);
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment(calendar.view.currentStart).format(`YYYY-MM-DD`),
          endTime: moment(calendar.view.currentEnd).format(`YYYY-MM-DD`),
        },
      });
      setChangeMonth(moment(calendar.view.currentStart).format('MM'));
      setChangeYear(moment(calendar.view.currentStart).format('YYYY'));
      onSetCurrentStartDate(
        moment(calendar.view.currentStart).format('YYYY-MM-DD'),
      );
    }
  };

  const handleClickPreviousMonth = () => {
    if (calendarRef && calendarRef?.current) {
      const calendar = calendarRef.current.getApi();
      calendar.prev();
      calendar.scrollToTime(currentTime);
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profile.id,
          need_sync: true,
          startTime: moment(calendar.view.currentStart).format(`YYYY-MM-DD`),
          endTime: moment(calendar.view.currentEnd).format(`YYYY-MM-DD`),
        },
      });
      setChangeMonth(moment(calendar.view.currentStart).format('MM'));
      setChangeYear(moment(calendar.view.currentStart).format('YYYY'));
      onSetCurrentStartDate(
        moment(calendar.view.currentStart).format('YYYY-MM-DD'),
      );
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleClickNextMonth,
    onSwipedRight: handleClickPreviousMonth,
    onSwipeStart: () => true,
    onSwiped: () => false,
    onTouchEndOrOnMouseUp: () => false,
    swipeDuration: 500,
    preventScrollOnSwipe: false,
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <Spin spinning={loadingPage}>
      <HeaderMobile
        title={formatMessage({ id: 'i18n_calendar_title' })}
        isShowLeft={true}
        itemLeft={{
          url: ROUTER.profileCollaboration,
          bgColor: 'bgPrimaryBlue',
          textColor: 'textLightGray',
          event: 'back',
          text: profile?.name,
        }}
        customStyleLeft={{ width: '100%' }}
      />
      <Navigation
        viewEventCalendar={viewEventCalendar}
        onChangeViewEventCalendar={handleChangeViewEventCalendar}
        onTodayEvent={handleOnTodayEvent}
        onSelectMonth={handleOnSelectMonth}
        onSelectYear={handleOnSelectYear}
        showSidebar={showSidebar}
        isSelectMonth={isSelectMonth}
        isSelectYear={isSelectYear}
        changeMonth={changeMonth}
        changeYear={changeYear}
      />
      <CalendarSidebar
        createEventType={createEventType}
        isSidebar={isSidebar}
        isCloseSidebar={isCloseSidebar}
        showModal={showModal}
        onChecked={onChangeCheckedMember}
        isMyCalendar={isMyCalendar}
        isOtherCalendar={isOtherCalendar}
      />
      <Spin spinning={loading || loadingCalendar}>
        <div
          ref={calendarParentRef}
          className={styles.bookingCalendarParent}
          style={{ width: width < 767 ? width : '' }}
        >
          <div
            style={{
              width:
                width < 767
                  ? (width / (viewEventCalendar === 7 ? 10 : 10)) * 10 // (viewEventCalendar === 7 ? 5 : 10) => mobile
                  : '',
            }}
            {...handlers}
          >
            <AvailableTime
              calendarRef={calendarRef}
              displayEvents={displayEvents}
              viewEventCalendar={viewEventCalendar}
              addTimeBlock={addTimeBlock}
              firstDay={firstDay}
              dateIncrement={viewEventCalendar}
              selected={selected}
              onSelect={onSelect}
              onDeleteEvent={onDeleteEvent}
              memoEventMobile={isMemoEventMobile}
              isSelected={false}
              currentTime={currentTime}
            />
          </div>
        </div>
      </Spin>
      <Modal
        title={formatMessage({ id: 'i18n_calendar_link_other' })}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <div className={styles.calendarLinkOtherDesc}>
          <p
            className={`${styles.calendarLinkOtherTitle} ${styles.textPrimaryBlue}`}
          >
            <svg
              width="25"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248zM262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z" />
            </svg>
            {formatMessage({ id: 'i18n_calendar_link_other_title' })}
          </p>
          <p className={styles.textPrimaryBlue}>
            {formatMessage({ id: 'i18n_calendar_link_other_content_1' })}
          </p>
          <p
            className={`${styles.calendarLinkOtherTitle} ${styles.textPrimaryBlue}`}
          >
            <svg
              width="25"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M466.5 83.7l-192-80a48.2 48.2 0 0 0 -36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z" />
            </svg>
            {formatMessage({ id: 'i18n_calendar_link_other_title' })}
          </p>
          <p className={styles.textPrimaryBlue}>
            {formatMessage({ id: 'i18n_calendar_link_other_content_2' })}
          </p>
        </div>
        <div className={styles.calendarLinkOtherBtn}>
          <Button
            onClick={handleSetProvider('google')}
            className={styles.calendarLinkOtherItem}
          >
            <img src={iconGoogle} alt="Google" />
            {formatMessage({ id: 'i18n_calendar_link_other_google' })}
          </Button>
          <Button
            onClick={handleSetProvider('microsoft')}
            className={styles.calendarLinkOtherItem}
          >
            <img src={iconOffice} alt="Office" />
            {formatMessage({ id: 'i18n_calendar_link_other_microsoft' })}
          </Button>
        </div>
        <div className={styles.calendarLinkOtherFooter}>
          <Link to={'/term-of-user'} className={styles.textDarkBlue}>
            {formatMessage({ id: 'i18n_footer_service' })}
          </Link>
          <Link
            to={'https://vision-net.co.jp/privacy.html'}
            className={styles.textDarkBlue}
          >
            {formatMessage({ id: 'i18n_footer_privacy' })}
          </Link>
        </div>
      </Modal>
      <Modal
        title={formatMessage({ id: 'i18n_add_member_send_email_title' })}
        open={modalTeamVisible}
        onCancel={closeModalTeam}
        footer={null}
      >
        <TeamList
          provider={provider}
          onSendEmail={onSendAddMemberEmail}
          modalTeamVisible={setModalTeamVisible}
        />
      </Modal>
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
          history.push(`${ROUTER.calendarCreation}`);
        }}
      >
        <PlusIcon />
      </div>
      <MenuSPBottom currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </Spin>
  );
}

const mapStateToProps = ({
  AVAILABLE_TIME,
  EVENT,
  CALENDAR,
  CALENDAR_CREATION,
  MASTER,
  BASIC_SETTING,
}) => ({
  availableTime: AVAILABLE_TIME,
  eventStore: EVENT,
  calendarStore: CALENDAR,
  calendarCreationStore: CALENDAR_CREATION,
  masterStore: MASTER,
  basicSetting: BASIC_SETTING,
});

function mapDispatchToProps(dispatch) {
  return {
    onSyncCalendar: value => dispatch(syncCalendar(value)),
    onLoadingData: (...props) => dispatch(loadingData(...props)),
    onNextWeek: step => dispatch(nextWeek(step)),
    onPrevWeek: step => dispatch(prevWeek(step)),
    onResetAvailableTime: () =>
      dispatch({
        type: 'AVAILABLE_TIME/reset',
      }),
    onSetCalendarRef: value => dispatch(setCalendarRef(value)),
    onMemberChecked: payload => dispatch(memberCheckedMobile(payload)),
    onSendAddMemberEmail: (provider, email) =>
      dispatch(sendAddMemberEmail(provider, email)),
    onAsyncToWeek: payload =>
      dispatch({
        type: 'AVAILABLE_TIME/asyncToWeek',
        payload,
      }),
    onCheckedGenerateBlockCalendar: event =>
      dispatch(setCheckedGenerateBlockCalendar(event)),
    onSetDataEventMobile: event => dispatch(setDataEventMobile(event)),
    onSetBlockCalendar: (block, clicked) =>
      dispatch(setBlockCalendar(block, clicked)),
    onSetViewEventCalendar: view => dispatch(setViewEventCalendar(view)),
    onSetCurrentStartDate: date => dispatch(setCurrentStartDate(date)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
