import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { slotLabelFormat } from '../../../commons/function';

import {
  addEvent,
  autoGenerateEventMobile,
  customizeGenerateEventMobile,
  deleteAllEvent,
  dropEventMobile,
  nextWeek,
  prevWeek,
  resizeEventMobile,
  setCalendarRef,
  sendAddMemberEmail,
} from '@/components/Mobile/AvailableTime/actions';
import Content from '@/components/Mobile/AvailableTime/components/Content';
import Header from '@/components/Mobile/AvailableTime/components/Header';

function AvailableTimeSetting(props) {
  const { formatMessage } = useIntl();

  const {
    // actions
    onDeleteEvent,
    onResizeEvent,
    onDropEvent,
    onSetCalendarRef,
    onCustomizeGenerateEvent,
    onAsyncToWeek,
    // props
    addTimeBlock,
    viewEventCalendar,
    dateIncrement,
    isHeight,
    gotoDateCalendar,
    isSelected,
    currentTime,
    // state
    availableTime,
    masterStore,
  } = props;

  const {
    calendarRef,
    calendarHeaders,
    displayEvents,
    bookedEvents,
    members,
  } = availableTime;

  // Get store data
  const { profile } = masterStore;
  const [firstDay, setFirstDay] = useState(moment().isoWeekday());
  const [isReloadMemberChange, setReloadMemberChange] = useState(false);
  const gotoDate = gotoDateCalendar ? new Date(gotoDateCalendar) : new Date();
  // const [currentTime, setcurrentTime] = useState(
  //   moment().format('HH') + ':00:00',
  // );

  // Fetch data
  useEffect(() => {
    onSetCalendarRef(React.createRef());
  }, []);

  useEffect(() => {
    if (members.length && isReloadMemberChange) {
      handleReloadMemberChange();
      setReloadMemberChange(false);
    }
  }, [isReloadMemberChange]);

  useEffect(() => {
    const firstDay =
      calendarHeaders && calendarHeaders.length
        ? calendarHeaders[0]?.weekDay
        : moment().isoWeekday();
    setFirstDay(firstDay);
  }, [calendarHeaders]);

  useEffect(() => {
    if (members && members.length > 0) {
      generate();
    }
  }, [members]);

  useEffect(() => {
    if (profile?.id && members && members.length > 0) {
      generate();
    }
  }, [bookedEvents]);

  const generate = () => {
    onCustomizeGenerateEvent();
  };

  const handleReloadMemberChange = async () => {
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    await onAsyncToWeek({
      listMember: members,
      startTime,
      endTime,
    });
    generate();
  };

  displayEvents.forEach(
    event =>
      (event.name =
        event.hide || (event.isBooked && event.name == null)
          ? formatMessage({ id: 'i18n_anonymous_event' })
          : event.name),
  );

  const ids = new Set(displayEvents.map(event => event.event_id));
  const renderDisplayEvents = displayEvents.filter(event => {
    return !ids.has(event.srcId);
  });

  // Select events
  const [selected, setSelected] = useState({});

  const onSelect = event => {
    setSelected(event);
  };

  const renderClassName = event => {
    const eProps = event.event._def.extendedProps;
    if (eProps.isBooked) {
      return 'isBooked';
    }
    if (eProps.isSync) {
      return 'syncData';
    }
    if (eProps.recentAdded || eProps.checked) {
      return 'recentAdded';
    }
    return '';
  };

  return (
    <FullCalendar
      ref={calendarRef}
      eventOverlap={true}
      headerToolbar={false}
      expandRows={true}
      timeZone={'local'}
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGrid"
      initialDate={gotoDate}
      height={isHeight ?? '80vh'}
      duration={{ days: viewEventCalendar }}
      events={renderDisplayEvents.filter(event => !event.isDeleted)}
      slotMinTime={'00:00:00'}
      slotMaxTime={'24:00:00'}
      slotDuration={'00:15:00'}
      slotLabelInterval={{ hours: 1 }}
      eventMinHeight={15}
      editable={true}
      allDaySlot={true}
      allDayText={''}
      slotLabelFormat={slotLabelFormat}
      eventClassNames={event => renderClassName(event)}
      dateIncrement={{
        days: dateIncrement,
      }}
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false,
        hourCycle: 'h23',
      }}
      dateClick={info => addTimeBlock(info)}
      eventResize={onResizeEvent}
      eventDrop={onDropEvent}
      firstDay={firstDay}
      scrollTimeReset={false}
      scrollTime={currentTime}
      dayHeaderContent={value => (
        <Header
          value={value}
          calendarHeaders={calendarHeaders}
          displayEvents={displayEvents}
        />
      )}
      eventContent={info => (
        <Content
          info={info}
          selected={selected}
          onSelect={onSelect}
          deleteEvent={onDeleteEvent}
          isSelected={isSelected}
        />
      )}
      windowResize={true}
    />
  );
}

const mapStateToProps = ({
  AVAILABLE_TIME,
  EVENT,
  CALENDAR_CREATION,
  MASTER,
  BASIC_SETTING,
}) => ({
  availableTime: AVAILABLE_TIME,
  eventStore: EVENT,
  calendarStore: CALENDAR_CREATION,
  masterStore: MASTER,
  basicSetting: BASIC_SETTING,
});

function mapDispatchToProps(dispatch) {
  return {
    onResizeEvent: info => dispatch(resizeEventMobile(info)),
    onDropEvent: info => dispatch(dropEventMobile(info)),
    onNextWeek: step => dispatch(nextWeek(step)),
    onPrevWeek: step => dispatch(prevWeek(step)),
    onResetAvailableTime: () =>
      dispatch({
        type: 'AVAILABLE_TIME/reset',
      }),
    onSetCalendarRef: value => dispatch(setCalendarRef(value)),
    onAutoGenerateEvent: payload => dispatch(autoGenerateEventMobile(payload)),
    onCustomizeGenerateEvent: () => dispatch(customizeGenerateEventMobile()),
    onDeleteAllEvent: () => dispatch(deleteAllEvent()),
    onSendAddMemberEmail: (provider, email) =>
      dispatch(sendAddMemberEmail(provider, email)),
    onAsyncToWeek: payload =>
      dispatch({
        type: 'AVAILABLE_TIME/asyncToWeek',
        payload,
      }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AvailableTimeSetting);
