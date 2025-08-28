import { connect } from 'dva';
import config from '@/config';
import React, { useEffect, useState, useCallback } from 'react';
import { useIntl, useDispatch, Link } from 'umi';
import { Spin, Modal, Button } from 'antd';
import { EVENT_RELATIONSHIP_TYPE } from '@/constant';
import HeaderMobile from '@/components/Mobile/Header';
import MenuSPBottom from '@/components/MenuSPBottom';
import Navigation from '@/components/Mobile/Navigation';
import styles from './styles.less';
import iconGoogle from '@/assets/images/google.png';
import iconOffice from '@/assets/images/microsoft.png';
import useWindowDimensions from '@/commons/useWindowDimensions';
import {
  addEvent,
  autoGenerateEvent,
  customizeGenerateEvent,
  deleteAllEvent,
  deleteEvent,
  dropEvent,
  memberChecked,
  nextWeek,
  prevWeek,
  resizeEvent,
  sendAddMemberEmail,
  setCalendarRef,
  switchChange,
} from '@/components/EventTypeSetting/AvailableTimeSetting/actions';
import moment from 'moment';
import AvailableTime from '../../../components/Mobile/AvailableTime';
import { profileFromStorage } from '../../../commons/function';
import { history } from '../../../.umi/core/history';
import PlusIcon from '../../Top/icon/PlusIcon';

function Calendar(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    location,
    onPrevWeek,
    onNextWeek,
    onSetCalendarRef,
    availableTime,
    onDeleteEvent,
    onResizeEvent,
    onDropEvent,
    basicSetting,
    calendarStore,
    calendarCreationStore,
    onAddEvent,
    eventStore,
  } = props;
  const dispatch = useDispatch();
  const { listCalendar } = calendarStore;
  const { checkAccountMicroSoft } = calendarCreationStore;
  const {
    listEventType,
    totalEventType,
    allBookedScheduleByUserSP,
  } = eventStore;
  const { calendarHeaders, displayEvents, calendarRef } = availableTime;
  const [loading, setLoading] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [currentTab, setCurrentTab] = useState('2');
  const [createEventType, setCreateEventType] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [headerGuest, setHeaderGuest] = useState(false);
  const [typeHeader, setTypeHeader] = useState('');
  const calendarParentRef = React.useRef();
  const { width } = useWindowDimensions();
  const [dateIncrement, setDateIncrement] = useState(3);
  const [firstDay, setFirstDay] = useState(moment().isoWeekday());
  const [modalVisible, setModalVisible] = useState(false);
  const [viewEventCalendar, setViewEventCalendar] = useState(3);
  const [selected, onSelect] = useState({});
  const pageSize = 1000000;
  const [pageIndex, setPageIndex] = useState(1);
  const profile = profileFromStorage();
  // URL Microsoft Team
  const [isLinkMicrosoft, setLinkMicrosoft] = useState(false);
  const redirectUri = `${window.location.protocol}//${window.location.host}/msteam-login-success`;
  const urlMSTeam = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${config.MICROSOFT_CLIENT_KEY}&scope=User.Read Calendars.Read Calendars.ReadWrite offline_access&response_type=code&redirect_uri=${redirectUri}&state=ClientStateGoesHere&prompt=login`;

  useEffect(() => {
    onSetCalendarRef(React.createRef());
    setTypeHeader('calendar');
    dispatch({
      type: 'CALENDAR_CREATION/checkAccountMicrosoft',
    });
    if (profile?.is_link_google) {
      dispatch({
        type: 'EVENT/getAllBookedScheduleByUserMobile',
        payload: {
          user_id: profileFromStorage().id,
          need_sync: true,
          startTime: moment().format('YYYY-MM-DD'),
          endTime: moment()
            .add(1, 'months')
            .format('YYYY-MM-DD'),
        },
      });
    }
    setTimeout(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const firstDay =
      calendarHeaders && calendarHeaders.length
        ? calendarHeaders[0].weekDay
        : moment().isoWeekday();
    setFirstDay(firstDay);
  }, [calendarHeaders]);

  useEffect(() => {
    setLinkMicrosoft(checkAccountMicroSoft.isChecked);
  }, [checkAccountMicroSoft]);

  // Synchronous handling function Google Calendar
  useEffect(() => {
    if (allBookedScheduleByUserSP.length > 0) {
      console.log('>>> allBookedScheduleByUserSP: ', allBookedScheduleByUserSP);
    }
  }, [allBookedScheduleByUserSP]);

  const addTimeBlock = info => {
    const formatBlockTime = moment(info.dateStr, 'YYYY-MM-DD HH:00:00').format(
      'YYYY-MM-DD HH:00:00',
    );
    localStorage.setItem('add_block_time', JSON.stringify(formatBlockTime));
    window.location.href = '/create-calendar';
    if (!basicSetting.block_number) {
      return;
    }
    onAddEvent(info, basicSetting);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleChangeViewEventCalendar = async (key, val) => {
    setLoadingCalendar(true);
    setDateIncrement(val);
    if (key === 'view') {
      setViewEventCalendar(val);
    }
    if (key === 'prev') {
      await onPrevWeek(val);
    }
    if (key === 'next') {
      await onNextWeek(val);
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
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 1000);
  };

  const getList = useCallback(() => {
    setLoading(true);
    const payload = {
      relationship_type: EVENT_RELATIONSHIP_TYPE.vote,
      pageSize: pageSize,
      page: pageIndex,
    };

    dispatch({ type: 'EVENT/getListEventType', payload });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [pageIndex, pageSize]);

  useEffect(() => {
    getList();
  }, [getList]);
  useEffect(() => {
    if (totalEventType > 0) {
      const data = listEventType.map(event => {
        const eventTitle = event.vote?.is_finished
          ? formatMessage({ id: 'i18n_voted' })
          : formatMessage({ id: 'i18n_voting' });
        if (event.event_datetimes && event.event_datetimes.length > 0) {
          return event.event_datetimes.map(dt => {
            return {
              title: eventTitle,
              start: dt.start_time,
              end: dt.end_time,
              id: dt.id,
              isDeleted: dt.deleted_at,
              backgroundColor: event.vote?.is_finished ? '#ffffff' : 'none',
              borderColor: event.vote?.is_finished ? '#3368c7' : 'none',
              textColor: event.vote?.is_finished ? '#3368c7' : '#ffffff',
              timeText: `${moment(dt.start_time).format('HH:mm')} ~ ${moment(
                dt.end_time,
              ).format('HH:mm')}`,
              srcId: event.id,
              eventCode: event.event_code,
              isStartTime: moment(dt.start_time).format('YYYY-MM-DD HH:mm:ss'),
              isEndTime: moment(dt.start_time)
                .add(event.block_number, 'minutes')
                .format('YYYY-MM-DD HH:mm:ss'),
              customType: dt.custom_type,
              dayOfWeek: dt.day_of_week,
              dtStatus: dt.status,
              blockNumber: event.block_number,
            };
          });
        }
      });
      const combinedArray = data
        .flat()
        .reduce((acc, val) => acc.concat(val), []);
      const filteredArray = combinedArray.filter(function(el) {
        return el != null;
      });
      dispatch({
        type: 'AVAILABLE_TIME/setDisplayEvents',
        payload: filteredArray,
      });
    }
  }, [listEventType]);

  const handleOnResizeAndDropEvent = async info => {
    const currentTime = moment().format('YYYY-MM-DD');
    if (
      moment(info.event.start).isBefore(moment()) ||
      moment(info.event.end).isAfter(
        moment(info.event.start)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
      ) ||
      moment(info.event.start).format('YYYY-MM-DD') >
        moment(currentTime).format('YYYY-MM-DD')
    ) {
      return info.revert();
    }

    const startTime = moment(info.event.start).format('YYYY-MM-DD HH:mm:ss');
    const endTime =
      info.event.end == null
        ? moment(info.event.start)
            .add(info.event._def.extendedProps.blockNumber, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss')
        : moment(info.event.end).format('YYYY-MM-DD HH:mm:ss');
    setLoadingCalendar(true);
    const payload = {
      start_time: startTime,
      end_time: endTime,
      event_id: info.event._def.extendedProps.srcId,
      id: Number(info.event.id),
      custom_type: info.event._def.extendedProps.customType,
      day_of_week: info.event._def.extendedProps.dayOfWeek,
      status: info.event._def.extendedProps.dtStatus,
    };
    dispatch({
      type: 'EVENT/updateTimeAvailable',
      payload: payload,
    });
    await getList();
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 2000);
  };

  const handleEventClick = info => {
    window.location.href = `/past-appointment/${info.event._def.extendedProps.srcId}`;
  };

  const handleOnSelectMonth = val => {
    setLoadingCalendar(true);
    if (calendarRef && calendarRef.current) {
      const calendar = calendarRef.current.getApi();
      calendar.gotoDate(val);
    }
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 2000);
  };

  return (
    <Spin spinning={loading}>
      <HeaderMobile
        createEventType={createEventType}
        hideHeader={hideHeader}
        headerGuest={headerGuest}
        typeHeader={typeHeader}
        showModal={showModal}
        title={formatMessage({ id: 'i18n_calendar_title' })}
      />
      <Navigation
        viewEventCalendar={viewEventCalendar}
        onChangeViewEventCalendar={handleChangeViewEventCalendar}
        onTodayEvent={handleOnTodayEvent}
        onSelectMonth={handleOnSelectMonth}
      />
      <Spin spinning={loadingCalendar}>
        <div
          ref={calendarParentRef}
          className={styles.bookingCalendarParent}
          style={{ width: width < 767 ? width : '' }}
        >
          <div
            style={{
              width:
                width < 767
                  ? (width / (viewEventCalendar === 7 ? 5 : 10)) * 10
                  : '',
            }}
          >
            <AvailableTime
              calendarRef={calendarRef}
              displayEvents={displayEvents}
              viewEventCalendar={viewEventCalendar}
              addTimeBlock={addTimeBlock}
              handleOnResizeAndDropEvent={handleOnResizeAndDropEvent}
              firstDay={firstDay}
              dateIncrement={dateIncrement}
              selected={selected}
              onSelect={onSelect}
              onDeleteEvent={onDeleteEvent}
              handleEventClick={handleEventClick}
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
          <p className={styles.calendarLinkOtherTitle}>
            <svg
              width="25"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M504 256c0 137-111 248-248 248S8 393 8 256C8 119.1 119 8 256 8s248 111.1 248 248zM262.7 90c-54.5 0-89.3 23-116.5 63.8-3.5 5.3-2.4 12.4 2.7 16.3l34.7 26.3c5.2 3.9 12.6 3 16.7-2.1 17.9-22.7 30.1-35.8 57.3-35.8 20.4 0 45.7 13.1 45.7 33 0 15-12.4 22.7-32.5 34C247.1 238.5 216 254.9 216 296v4c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12v-1.3c0-28.5 83.2-29.6 83.2-106.7 0-58-60.2-102-116.5-102zM256 338c-25.4 0-46 20.6-46 46 0 25.4 20.6 46 46 46s46-20.6 46-46c0-25.4-20.6-46-46-46z" />
            </svg>
            {formatMessage({ id: 'i18n_calendar_link_other_title' })}
          </p>
          <p>{formatMessage({ id: 'i18n_calendar_link_other_content_1' })}</p>
          <p className={styles.calendarLinkOtherTitle}>
            <svg
              width="25"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M466.5 83.7l-192-80a48.2 48.2 0 0 0 -36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z" />
            </svg>
            {formatMessage({ id: 'i18n_calendar_link_other_title' })}
          </p>
          <p>{formatMessage({ id: 'i18n_calendar_link_other_content_2' })}</p>
        </div>
        <div className={styles.calendarLinkOtherBtn}>
          <Button
            className={`${styles.calendarLinkOtherItem} ${
              profile?.is_link_google ? styles.isLinked : ''
            }`}
          >
            <img src={iconGoogle} alt="Google" />
            {formatMessage({
              id: `${
                profile?.is_link_google
                  ? 'i18n_calendar_unlink_other_google'
                  : 'i18n_calendar_link_other_google'
              }`,
            })}
          </Button>
          <Button
            className={`${styles.calendarLinkOtherItem} ${
              profile?.is_link_google ? styles.isLinked : ''
            }`}
          >
            <img src={iconOffice} alt="Office" />
            {formatMessage({
              id: `${
                profile?.is_link_google
                  ? 'i18n_calendar_unlink_other_microsoft'
                  : 'i18n_calendar_link_other_microsoft'
              }`,
            })}
          </Button>
        </div>
        <div className={styles.calendarLinkOtherFooter}>
          <Link to={'/term-of-user'}>
            {formatMessage({ id: 'i18n_footer_service' })}
          </Link>
          <Link to={'/privacy-policy'}>
            {formatMessage({ id: 'i18n_footer_privacy' })}
          </Link>
        </div>
      </Modal>
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
    onSwitchChange: (day, isAuto) => dispatch(switchChange(day, isAuto)),
    onAddEvent: (info, basicSetting) => dispatch(addEvent(info, basicSetting)),
    onDeleteEvent: (event, isManualSetting) =>
      dispatch(deleteEvent(event, isManualSetting)),
    onResizeEvent: info => dispatch(resizeEvent(info)),
    onDropEvent: info => dispatch(dropEvent(info)),
    onNextWeek: step => dispatch(nextWeek(step)),
    onPrevWeek: step => dispatch(prevWeek(step)),
    onResetAvailableTime: () =>
      dispatch({
        type: 'AVAILABLE_TIME/reset',
      }),
    onSetCalendarRef: value => dispatch(setCalendarRef(value)),
    onAutoGenerateEvent: payload => dispatch(autoGenerateEvent(payload)),
    onCustomizeGenerateEvent: () => dispatch(customizeGenerateEvent()),
    onDeleteAllEvent: () => dispatch(deleteAllEvent()),
    onMemberChecked: payload => dispatch(memberChecked(payload)),
    onSendAddMemberEmail: (provider, email) =>
      dispatch(sendAddMemberEmail(provider, email)),
    onAsyncToWeek: payload =>
      dispatch({
        type: 'AVAILABLE_TIME/asyncToWeek',
        payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
