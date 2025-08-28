import wasteBacket from '@/assets/images/i-waste-backet.svg';
import { getDayInWeek } from '@/commons/function';
import { FULL_DATE_HOUR, YYYYMMDD } from '@/constant';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Spin, Switch, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import styles from '../basic_styles.less';
import stylesHeaderCalendar from '../../EventTypeSetting/basic_styles.less';
import { slotLabelFormat } from '../../../commons/function';

function AvailableTimeSetting(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { defaultFreeTime, setDefaultFreeTime, loading } = props;
  const [currentEvent, setCurrentEvent] = useState(undefined);
  const currentWeekDay = moment().weekday();

  const deleteEvent = eventInfo => {
    const result = defaultFreeTime.filter(
      item => item.srcId !== eventInfo.event._def.extendedProps.srcId,
    );
    setDefaultFreeTime(result);
  };

  const addEvent = info => {
    const curDay = defaultFreeTime.find(
      item =>
        moment(info.date).format(YYYYMMDD) ===
        moment(item.thisDay).format(YYYYMMDD),
    ).day_of_week;
    setDefaultFreeTime([
      ...defaultFreeTime,
      {
        end: new Date(info.dateStr).setMinutes(
          new Date(info.dateStr).getMinutes() + 30,
        ),
        start: new Date(info.dateStr),
        day_of_week: curDay,
        status: 0,
        srcId: defaultFreeTime.length,
        thisDay: info.dateStr,
        recentAdded: true,
      },
    ]);
  };

  const onSwitchChange = (value, day_of_week) => {
    const result = defaultFreeTime.map(item => {
      if (item.day_of_week === day_of_week) {
        item.status = value;
      }
      return item;
    });
    setDefaultFreeTime(result);
  };

  const renderDayHeader = dayValue => {
    const result = defaultFreeTime.find(
      item =>
        moment(item.thisDay).format(YYYYMMDD) ===
        moment(dayValue.date).format(YYYYMMDD),
    );
    const { day_of_week } = result;
    return (
      <div className={stylesHeaderCalendar.headerTableCalendar}>
        <p className={stylesHeaderCalendar.titleMonth}>
          {moment(dayValue.date).month() + 1}
          {formatMessage({ id: 'i18n_month' })}
        </p>
        <p className={stylesHeaderCalendar.date}>
          {moment(dayValue.date).date()}
        </p>
        <p className={stylesHeaderCalendar.titleDay}>
          {getDayInWeek(moment(dayValue.date).day())}
        </p>
        <p className={stylesHeaderCalendar.titleDaySm}>
          {getDayInWeek(moment(dayValue.date).day())}
        </p>
        <Switch
          className={stylesHeaderCalendar.switchStatus}
          checkedChildren={formatMessage({ id: 'i18n_day_on' })}
          unCheckedChildren={formatMessage({ id: 'i18n_day_off' })}
          checked={result ? !!result.status : false}
          onChange={value => onSwitchChange(value, day_of_week)}
        />

        <div
          className={`${stylesHeaderCalendar.switchMobile} ${
            day_of_week ? stylesHeaderCalendar.activeSwitchSM : ''
          }`}
          onClick={value => onSwitchChange(value, day_of_week)}
        >
          <div className={stylesHeaderCalendar.checkedTime} />
          <div className={stylesHeaderCalendar.dayWeek}>
            {!day_of_week && (
              <>
                <p>終日</p>
                <p>オフ</p>
              </>
            )}

            {day_of_week && <p>オン</p>}
          </div>
        </div>
      </div>
    );
  };

  const resizeEvent = eventResizeInfo => {
    const result = defaultFreeTime.map(item => {
      if (item.srcId === eventResizeInfo.event._def.extendedProps.srcId) {
        const oldEndTime = new Date(item.end);
        item.end = new Date(
          oldEndTime.setMinutes(
            oldEndTime.getMinutes() +
              eventResizeInfo.endDelta.milliseconds / 60000,
          ),
        );
      }
      return item;
    });
    setDefaultFreeTime(result);
  };

  const renderEventContent = eventInfo => {
    return (
      <>
        <div
          className={`${styles.eventContent} ${
            checkCurrentEvent(eventInfo.event._def.extendedProps)
              ? styles.currentEvent
              : ''
          } ${
            eventInfo.event._def.extendedProps.recentAdded
              ? styles.recentAdded
              : ''
          }`}
          onClick={() => setCurrentEvent(eventInfo.event._def.extendedProps)}
        >
          <div className={styles.resizeIconTop}>
            <div></div>
            <div></div>
          </div>
          <Tooltip
            title={
              <div
                className={styles.deleteEventBtn}
                onClick={() => deleteEvent(eventInfo)}
              >
                <img src={wasteBacket} />
                {formatMessage({ id: 'i18n_delete_event' })}
              </div>
            }
            trigger={'click'}
          >
            <p className={styles.timeText}>{eventInfo.timeText}</p>
          </Tooltip>
        </div>
      </>
    );
  };

  const dropEvent = eventDropInfo => {
    let dateMovedTo = undefined;
    let previousDate = undefined;
    const result = defaultFreeTime.map(item => {
      if (item.srcId === eventDropInfo.event._def.extendedProps.srcId) {
        previousDate = moment(item.start).format(YYYYMMDD);
        const oldStartTime = new Date(item.start);
        const oldEndTime = new Date(item.end);
        const newStartHour = new Date(
          oldStartTime.setMinutes(
            oldStartTime.getMinutes() +
              eventDropInfo.delta.milliseconds / 60000,
          ),
        );
        const newEndHour = new Date(
          oldEndTime.setMinutes(
            oldEndTime.getMinutes() + eventDropInfo.delta.milliseconds / 60000,
          ),
        );
        const newStartTime = new Date(
          newStartHour.setDate(
            newStartHour.getDate() + eventDropInfo.delta.days,
          ),
        );
        const newEndTime = new Date(
          newEndHour.setDate(newEndHour.getDate() + eventDropInfo.delta.days),
        );

        item.start = newStartTime;
        item.end = newEndTime;
        item.day_of_week =
          eventDropInfo.event._def.extendedProps.day_of_week +
          eventDropInfo.delta.days;
        item.status = defaultFreeTime.find(
          free =>
            moment()
              .weekday(item.day_of_week)
              .format(YYYYMMDD) === moment(free.thisDay).format(YYYYMMDD),
        ).status;
        item.thisDay = moment()
          .weekday(item.day_of_week)
          .format(YYYYMMDD);
        dateMovedTo = moment(newStartTime).format(YYYYMMDD);
      }
      return item;
    });
    for (let i = currentWeekDay; i <= currentWeekDay + 7; i++) {
      if (!result.some(item => item.day_of_week === i)) {
        result.push({
          day_of_week: i,
          srcId: i,
          status: 0,
          thisDay: moment()
            .weekday(i)
            .format(YYYYMMDD),
        });
      }
      if (
        !result.some(
          item =>
            moment(item.thisDay).format(YYYYMMDD) === previousDate &&
            item.start &&
            item.end &&
            moment(item.start).isValid() &&
            moment(item.end).isValid(),
        )
      ) {
        const tempDate = result.find(
          item => moment(item.thisDay).format(YYYYMMDD) === previousDate,
        );
      }
    }
    setDefaultFreeTime(result);
  };

  const checkCurrentEvent = value => {
    return (
      currentEvent &&
      currentEvent.day_of_week === value.day_of_week &&
      moment(value.thisDay).format(FULL_DATE_HOUR) ===
        moment(currentEvent.thisDay).format(FULL_DATE_HOUR)
    );
  };
  return (
    <div className={styles.calendarViewContainer}>
      <div className={styles.stepCalendarTitle}>
        <div className={styles.titleIcon}>
          <div className={styles.bolderColIcon}></div>
          <div className={styles.normalColIcon}></div>
        </div>
        <h2 className={styles.titleStep2}>
          2 : {formatMessage({ id: 'i18n_calendar_creation_step_2' })}
        </h2>
        <p>{formatMessage({ id: 'i18n_calendar_creation_step_2_tips' })}</p>
      </div>
      <Spin spinning={loading}>
        <FullCalendar
          eventOverlap={false}
          headerToolbar={false}
          expandRows={true}
          timeZone={'local'}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={defaultFreeTime}
          slotMinTime={'00:00:00'}
          slotMaxTime={'24:00:00'}
          slotLabelFormat={slotLabelFormat}
          editable={true}
          allDaySlot={false}
          dayHeaderContent={renderDayHeader}
          eventContent={eventInfo => renderEventContent(eventInfo)}
          dateClick={info => addEvent(info)}
          eventResize={eventResizeInfo => resizeEvent(eventResizeInfo)}
          eventDrop={eventDropInfo => dropEvent(eventDropInfo)}
          firstDay={moment().weekday()}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hourCycle: 'h23',
          }}
          slotDuration={'00:15:00'}
          slotLabelInterval={{ hours: 1 }}
          eventMinHeight={15}
        />
      </Spin>
    </div>
  );
}

export default AvailableTimeSetting;
