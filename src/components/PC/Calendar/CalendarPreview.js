import { slotLabelFormat } from '@/commons/function';
import {
  addEventMobile,
  deleteEventMobile,
  deleteEventPC,
  dragStopBlockCalendar,
  dropBlockCalendar,
  memberCheckedMobile,
  nextWeek,
  prevWeek,
  resizeEvent,
  sendAddMemberEmail,
  setBlockCalendar,
  setCalendarRef,
  setCheckedGenerateBlockCalendar,
  setCurrentStartDate,
  setDataEventMobile,
  setViewEventCalendar,
} from '@/components/Mobile/AvailableTime/actions';
import {
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
} from '@ant-design/icons';
// import interactionPlugin from './@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Select, Spin } from 'antd';
import { connect } from 'dva';
import useCalendarPreview from './utils/useCalendarPreview';
import styles from './styles/calendarPreview.less';
import './styles/calendarPreviewPc.less';
import CalendarPreviewContent from './CalendarPreviewContent';
import CalendarPreviewHeader from './CalendarPreviewHeader';
import { history } from 'umi';
import { eventDragStopBlockTime, eventDropBlockTime } from '@/util/eventBus';

function CalendarPreview(props) {
  const { state, ...hooks } = useCalendarPreview(props);
  const { scheduleSetting } = props.calendarStore;
  // const fromCalendar = props.fromCalendar;

  const dateIncrement = props.dateIncrement || 7;

  return (
    <div className={`${styles.rightPanel} calendar-pc`}>
      {/* Header */}
      <div className={styles.headerView}>
        <div className={styles.headerLeft}>
          <button className={styles.btnToday} onClick={hooks.handleGoToToday}>
            今日
          </button>
          <div className={styles.btnPrev} onClick={hooks.handlePrev}>
            <LeftOutlined color="#3368C7" />
          </div>
          <div className={styles.btnNext} onClick={hooks.handleNext}>
            <RightOutlined color="#3368C7" />
          </div>
          {/* <span className={styles.dateStr}>{state.monthFormat}</span> */}
          <Select
            value={hooks.selectedYear}
            onChange={hooks.handleChangeYear}
            dropdownMatchSelectWidth={false}
            options={hooks.renderYearNavigation()}
          />
          <Select
            value={hooks.selectedMonth}
            onChange={hooks.handleChangeMonth}
            options={hooks.renderMonthNavigation()}
          />
        </div>

        <div
          className={styles.btnCalendar}
          onClick={() => {
            history.push('/');
          }}
        >
          <img
            src={require('@/assets/images/pc/calendar-sync.png')}
            alt={'calendar'}
            className={styles.btnCalendarIcon}
          />
          <span>調整一覧</span>
        </div>
      </div>

      {/* Calendar */}
      <div className={`${styles.calendarView} calendar-view`}>
        <Spin spinning={state.loadingEvent}>
          <FullCalendar
            // key={state.calendarKey}
            ref={hooks.calendarRef}
            eventOverlap={true}
            headerToolbar={false}
            expandRows={true}
            timeZone={'local'}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGrid"
            // initialDate={gotoDate}
            height="calc(100vh - 65px - 68px - 84px)"
            duration={{ days: dateIncrement }}
            events={hooks.displayEvents}
            dayMaxEventRows={hooks.expanded ? false : 2}
            moreLinkClick={arg => {
              // hooks.handleToggleExpand();
              return 'expand';
            }}
            moreLinkText={num => `他${num}件`}
            eventOrder="start,title"
            slotMinTime={'00:00:00'}
            slotMaxTime={'24:00:00'}
            slotDuration={'00:15:00'}
            slotLabelInterval={{ hours: 1 }}
            eventMinHeight={15}
            editable={true}
            allDaySlot={true}
            allDayContent={
              hooks.showExpandRow ? (
                <div
                  className={styles.expandRows}
                  onClick={hooks.handleToggleExpand}
                >
                  {hooks.expanded ? <UpOutlined /> : <DownOutlined />}
                </div>
              ) : (
                ''
              )
            }
            slotLabelFormat={slotLabelFormat}
            eventClassNames={event => hooks.renderClassName(event)}
            dateIncrement={{
              days: dateIncrement,
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hourCycle: 'h23',
            }}
            dateClick={info => hooks.addTimeBlock(info)}
            // eventResize={onResizeEvent}
            eventDrop={e => {
              // console.log('eventDrop e: ', e);
              props.dropBlockCalendar?.(e);
              eventDropBlockTime(e);
            }}
            // eventDragStop={e => {
            //   // console.log('eventDrop e: ', e);
            //   props.dropBlockCalendar?.(e);
            //   eventDragStopBlockTime(e);
            // }}
            firstDay={state.firstDay}
            scrollTimeReset={false}
            // scrollTime={currentTime}
            scrollTime={scheduleSetting?.default_start_time || '09:00:00'}
            dayHeaderContent={value => (
              // <Header
              //   value={value}
              //   calendarHeaders={calendarHeaders}
              //   displayEvents={displayEvents}
              // />
              <CalendarPreviewHeader value={value} />
            )}
            eventContent={info => (
              <CalendarPreviewContent
                info={info}
                selected={hooks.selected}
                onSelect={hooks.setSelect}
                deleteEvent={payload => {
                  hooks.onDeleteEvent(payload);
                  props.onDeleteEvent(payload);
                }}
                voters={state.voters}
              />
            )}
            windowResize={true}
            datesSet={arg => {
              hooks.handleDatesSet(arg);
            }}
          />
        </Spin>
      </div>
    </div>
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
    onSetCalendarRef: value => dispatch(setCalendarRef(value)),
    onSyncCalendar: value => dispatch(syncCalendar(value)),
    onLoadingData: (...props) => dispatch(loadingData(...props)),
    onAddEvent: (info, block_number) =>
      dispatch(addEventMobile(info, block_number)),
    onDeleteEvent: event => dispatch(deleteEventPC(event)),
    onResizeEvent: info => dispatch(resizeEvent(info)),
    onMemberChecked: payload => dispatch(memberCheckedMobile(payload)),
    onSendAddMemberEmail: (provider, email) =>
      dispatch(sendAddMemberEmail(provider, email)),
    onNextWeek: step => dispatch(nextWeek(step)),
    onPrevWeek: step => dispatch(prevWeek(step)),
    onCheckedGenerateBlockCalendar: event =>
      dispatch(setCheckedGenerateBlockCalendar(event)),
    onSetDataEventMobile: event => dispatch(setDataEventMobile(event)),
    onSetBlockCalendar: (block, clicked) =>
      dispatch(setBlockCalendar(block, clicked)),
    onSetViewEventCalendar: view => dispatch(setViewEventCalendar(view)),
    onSetCurrentStartDate: date => dispatch(setCurrentStartDate(date)),
    dropBlockCalendar: payload => {
      dispatch(dropBlockCalendar(payload));
    },
    dragStopBlockCalendar: payload => dispatch(dragStopBlockCalendar(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarPreview);
