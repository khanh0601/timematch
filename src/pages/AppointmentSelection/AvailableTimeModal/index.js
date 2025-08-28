import { connect } from 'dva';
import React, { useEffect, useState, useCallback } from 'react';
import { useIntl, useDispatch, Link } from 'umi';
import { Spin, Modal } from 'antd';
import { EVENT_RELATIONSHIP_TYPE } from '@/constant';
import HeaderMobile from '@/components/Mobile/Header';
import MenuSPBottom from '@/components/MenuSPBottom';
import Navigation from '../Navigator';
import styles from './styles.less';
import iconGoogle from '@/assets/images/google.png';
import iconOffice from '@/assets/images/microsoft.png';
import useWindowDimensions from '@/commons/useWindowDimensions';
import moment from 'moment';
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
import AvailableTime from '@/components/Mobile/AvailableTime';

const AvailableTimeModal = ({
  open,
  onClose,
  availableTimes,
  onTimeSelect,
  ...props
}) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    location,
    onSetCalendarRef,
    availableTime,
    onDeleteEvent,
    onResizeEvent,
    onDropEvent,
    basicSetting,
    calendarStore,
    onAddEvent,
    eventStore,
  } = props;
  const dispatch = useDispatch();
  const { listCalendar } = calendarStore;
  const { listEventType, totalEventType } = eventStore;
  const [loading, setLoading] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [currentTab, setCurrentTab] = useState('2');
  const [createEventType, setCreateEventType] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [headerGuest, setHeaderGuest] = useState(false);
  const [typeHeader, setTypeHeader] = useState('');
  const calendarParentRef = React.useRef();
  const { width } = useWindowDimensions();
  const [dateIncrement, setDateIncrement] = useState(7);
  const [firstDay, setFirstDay] = useState(moment().isoWeekday());
  const { calendarHeaders, displayEvents } = availableTime;
  const [modalVisible, setModalVisible] = useState(false);
  const [viewEventCalendar, setViewEventCalendar] = useState(3);
  const [selected, onSelect] = useState({});
  const pageSize = 1000000;
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    onSetCalendarRef(React.createRef());
    setTypeHeader('calendar');
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

  const handleChangeViewEventCalendar = value => {
    setViewEventCalendar(value);
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
    // getList();
  }, [getList]);

  useEffect(() => {
    if (totalEventType > 0) {
      const data = listEventType
        .map(event => {
          const eventTitle = event.vote?.is_finished
            ? formatMessage({ id: 'i18n_voted' })
            : formatMessage({ id: 'i18n_voting' });
          if (event.event_datetimes && event.event_datetimes.length > 0) {
            return event.event_datetimes.map(dt => {
              return {
                title: eventTitle,
                start: dt.start_time,
                end: moment(dt.start_time)
                  .add(dt.block_number, 'minutes')
                  .format('YYYY-MM-DD HH:mm:ss'),
                id: dt.id,
                isDeleted: dt.deleted_at,
                backgroundColor: event.vote?.is_finished ? '#ffffff' : 'none',
                borderColor: event.vote?.is_finished ? '#3368c7' : 'none',
                textColor: event.vote?.is_finished ? '#3368c7' : '#ffffff',
                timeText: `${moment(dt.start_time).format('HH:mm')} ~ ${moment(
                  dt.end_time,
                ).format('HH:mm')}`,
              };
            });
          }
        })
        .filter(item => item !== undefined);
      const combinedArray = data
        .flat()
        .reduce((acc, val) => acc.concat(val), []);
      dispatch({
        type: 'AVAILABLE_TIME/setDisplayEvents',
        payload: combinedArray,
      });
    }
  }, [listEventType]);

  const handleOnResizeAndDropEvent = info => {
    if (
      moment(info.event.start).isBefore(moment()) ||
      moment(info.event.end).isAfter(
        moment(info.event.start)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss'),
      )
    ) {
      return info.revert();
    }
    setLoadingCalendar(true);
    const data = [
      {
        title: 'hello',
        start: moment(info.event.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(info.event.end).format('YYYY-MM-DD HH:mm:ss'),
        id: info.event.id,
        overlap: false,
      },
    ];
    dispatch({
      type: 'AVAILABLE_TIME/setDisplayEvents',
      payload: data,
    });
    setTimeout(() => {
      setLoadingCalendar(false);
    }, 2000);
  };

  const handleEventClick = info => {
    onSelect(info.event);
  };

  return (
    <Modal
      footer={null}
      centered
      style={{ overflow: 'scroll', width: '100%' }}
      open={open}
      onCancel={onClose}
      title={
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            <div
              style={{ height: 30, width: 5, background: 'dodgerblue' }}
            ></div>
            <div>懇親会</div>
          </div>
          <div style={{ fontSize: 12, marginTop: 10 }}>
            ○○日までに回答をお願いいたします。
          </div>
        </div>
      }
    >
      <Navigation
        viewEventCalendar={viewEventCalendar}
        onChangeViewEventCalendar={handleChangeViewEventCalendar}
        showMenu={false}
      />
      <Spin spinning={loadingCalendar}>
        <div
          ref={calendarParentRef}
          className={styles.bookingCalendarParent}
          style={{ width: '100%' }}
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
              displayEvents={displayEvents}
              viewEventCalendar={viewEventCalendar}
              addTimeBlock={() => {}}
              handleOnResizeAndDropEvent={handleOnResizeAndDropEvent}
              firstDay={firstDay}
              dateIncrement={dateIncrement}
              selected={() => {}}
              onSelect={() => {}}
              onDeleteEvent={() => {}}
              handleEventClick={() => {}}
            />
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

const mapStateToProps = ({
  AVAILABLE_TIME,
  EVENT,
  CALENDAR,
  MASTER,
  BASIC_SETTING,
}) => ({
  availableTime: AVAILABLE_TIME,
  eventStore: EVENT,
  calendarStore: CALENDAR,
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

export default connect(mapStateToProps, mapDispatchToProps)(AvailableTimeModal);
