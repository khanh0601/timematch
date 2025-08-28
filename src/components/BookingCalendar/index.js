import {
  findMinHour,
  getDayInWeek,
  getDayInWeekWithShortName,
} from '@/commons/function';
import { FULL_DATE_HOUR, YYYYMMDD } from '@/constant';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from './styles.less';
import styleHeader from '../EventTypeSetting/basic_styles.less';
import { slotLabelFormat } from '../../commons/function';
import useWindowDimensions from '@/commons/useWindowDimensions';

function BookingCalendar(props) {
  const {
    listTimeFrame,
    onSelectTime,
    eventInfo,
    nextWeek,
    prevWeek,
    currentPeriodForPreview,
    isScheduleAdjust,
    firstWeekDate,
  } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [defaultFreeTime, setDefaultFreeTime] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const calendarRef = React.createRef();
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [disabledNav, setDisabledNav] = useState(false);
  const { width } = useWindowDimensions();
  const calendarParentRef = React.useRef();

  const [currentMonth, setCurrentMonth] = useState(moment());
  const [firstDay, setFirstDay] = useState(moment().isoWeekday());

  const [dateIncrement, setDateIncrement] = useState(7);

  useEffect(() => {
    if (firstWeekDate) {
      setFirstDay(moment(firstWeekDate).isoWeekday());
      setCurrentMonth(moment(firstWeekDate));

      let calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(firstWeekDate);
    }
  }, [firstWeekDate]);

  useEffect(() => {
    if (listTimeFrame) {
      setDefaultFreeTime(listTimeFrame);
    }
  }, [listTimeFrame]);

  useEffect(() => {
    if (width <= 768) {
      setDateIncrement(3);
      return;
    }

    setDateIncrement(7);
  }, []);

  const selectTime = async value => {
    await setLoading(true);
    await setCurrentEvent(value);
    await onSelectTime(value);
    await setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const checkCurrentEvent = value => {
    return (
      currentEvent &&
      currentEvent.day_of_week === value.day_of_week &&
      moment(value.start_time).format(FULL_DATE_HOUR) ===
        moment(currentEvent.start_time).format(FULL_DATE_HOUR)
    );
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
            eventInfo.event._def.extendedProps.isBooked ? styles.isBooked : ''
          }`}
          onClick={() => selectTime(eventInfo.event._def.extendedProps)}
        >
          <div className={styles.timeText}>
            {/* <p className={`${styles.time} ${styles.notShowOnMobile}`}>
              {eventInfo.timeText.replace('-', '~')}
              {eventInfo.timeText}
            </p> */}
            <p className={`${styles.time}`}>
              {eventInfo.timeText.replace('-', '~')}
              {/* {eventInfo.timeText} */}
            </p>
            {/* <div className={`${styles.time} ${styles.showOnMobile}`}>
              <p>
                {eventInfo.timeText.slice(0, eventInfo.timeText.indexOf('-'))}
              </p>
              <span className={styles.rotateOnMobile}>~</span>
              <p>
                {eventInfo.timeText.slice(eventInfo.timeText.indexOf('-') + 1)}
              </p>
            </div> */}
            {eventInfo.event.extendedProps.name && (
              <p className={styles.eventName}>
                {eventInfo.event.extendedProps.name}
              </p>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderDayHeader = dayValue => {
    const result = defaultFreeTime.find(
      item =>
        moment(item.thisDay).format(YYYYMMDD) ===
        moment(dayValue.date).format(YYYYMMDD),
    );
    return (
      <div className={styleHeader.headerTableCalendar}>
        <p className={styleHeader.titleMonth}>
          {moment(dayValue.date).month() + 1}
          {formatMessage({ id: 'i18n_month' })}
        </p>
        <p className={styleHeader.date}>{moment(dayValue.date).date()}</p>
        <p className={styleHeader.titleDay}>
          {getDayInWeek(moment(dayValue.date).day())}
        </p>
        <p className={styleHeader.titleDaySm}>
          {moment(dayValue.date).format('MM/DD')}
        </p>
        <p className={styleHeader.titleDaySm}>
          {getDayInWeekWithShortName(moment(dayValue.date).day())}
        </p>
      </div>
    );
  };

  const onNext = () => {
    calendarParentRef.current.scrollTo(0, 0);

    setDisabledNav(true);
    setLoading(true);

    setCurrentMonth(moment(currentMonth).add(dateIncrement, 'd'));
    setFirstDay(
      moment(currentMonth)
        .add(dateIncrement, 'd')
        .isoWeekday(),
    );

    const newPeriod =
      currentPeriod + 1 <=
      (eventInfo && eventInfo.period ? eventInfo.period : 99999)
        ? currentPeriod + 1
        : currentPeriod;
    setCurrentPeriod(currentPeriod + 1);
    nextWeek(newPeriod);

    let calendarApi = calendarRef.current.getApi();
    calendarApi.next();

    setTimeout(() => {
      setLoading(false);
    }, 100);
    setTimeout(() => {
      setDisabledNav(false);
    }, 100);
  };
  const onPrev = () => {
    calendarParentRef.current.scrollTo(0, 0);

    setDisabledNav(true);
    setLoading(true);

    setCurrentMonth(moment(currentMonth).subtract(dateIncrement, 'd'));
    setFirstDay(
      moment(currentMonth)
        .subtract(dateIncrement, 'd')
        .isoWeekday(),
    );
    const newPeriod = Number(currentPeriod - 1) >= 0 ? currentPeriod - 1 : 0;
    setCurrentPeriod(currentPeriod - 1);
    prevWeek(newPeriod);
    let calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setTimeout(() => {
      setLoading(false);
    }, 100);
    setTimeout(() => {
      setDisabledNav(false);
    }, 100);
  };

  const getCalendarStartTime = () => {
    let startTime = findMinHour(JSON.parse(JSON.stringify(listTimeFrame)));
    if (startTime) {
      return startTime;
    }
    return '00:00:00';
  };
  return (
    <div className={styles.bookingCalendar}>
      <div className={styles.btnAction}>
        <div
          className={`${styles.prevBtn}
           ${isScheduleAdjust ? styles.btnScheduleAdjust : ''}
           ${disabledNav || currentPeriod === 0 ? styles.disabledNav : ''}
          `}
          onClick={() => onPrev()}
        >
          <div className={styles.nextBtnIcon} />
          {isScheduleAdjust && <span>前週</span>}
        </div>

        <div
          className={`${styles.nextBtn}
            ${isScheduleAdjust ? styles.btnScheduleAdjust : ''}
           ${
             disabledNav ||
             (eventInfo && eventInfo.period ? eventInfo.period : 999999) -
               currentPeriod ===
               1 ||
             ((currentPeriodForPreview || currentPeriodForPreview === 0) &&
               currentPeriod === currentPeriodForPreview)
               ? styles.disabledNav
               : ''
           }`}
          onClick={() => onNext()}
        >
          <div className={styles.nextBtnIcon} />

          {isScheduleAdjust && <span>翌週</span>}
        </div>
      </div>

      <div className={styles.btnActionMobile}>
        <div>
          <div
            className={
              disabledNav || currentPeriod === 0 ? styles.disabledNav : ''
            }
            onClick={onPrev}
          >
            <div className={styles.prevBtn}>
              <div className={styles.nextBtnIcon} />
            </div>
            {formatMessage({ id: 'i18b_3_day_before' })}
          </div>
        </div>
        <div>
          <div
            className={`${
              disabledNav ||
              ((eventInfo && eventInfo.period ? eventInfo.period : 999999) *
                7) /
                3 -
                1 <=
                currentPeriod ||
              ((currentPeriodForPreview || currentPeriodForPreview === 0) &&
                currentPeriod === currentPeriodForPreview)
                ? styles.disabledNav
                : ''
            }`}
            onClick={onNext}
          >
            {formatMessage({ id: 'i18b_3_day_after' })}
            <div className={styles.nextBtn}>
              <div className={styles.nextBtnIcon} />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={calendarParentRef}
        className={styles.bookingCalendarParent}
        style={{ width: width < 767 ? width : '' }}
      >
        <div style={{ width: width < 767 ? ((width - 45) / 3) * 7 : '' }}>
          <Spin spinning={loading}>
            <FullCalendar
              ref={calendarRef}
              eventOverlap={true}
              headerToolbar={false}
              expandRows={true}
              timeZone={'local'}
              plugins={[timeGridPlugin]}
              initialView="timeGridWeek"
              events={listTimeFrame}
              slotMinTime={getCalendarStartTime()}
              slotMaxTime={'24:00:00'}
              slotLabelFormat={slotLabelFormat}
              editable={false}
              allDaySlot={false}
              dayHeaderContent={renderDayHeader}
              eventContent={eventInfo => renderEventContent(eventInfo)}
              firstDay={firstDay}
              slotDuration={'00:15:00'}
              slotLabelInterval={{ hours: 1 }}
              eventMinHeight={15}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
                hourCycle: 'h23',
              }}
              scrollTime={getCalendarStartTime()}
              dateIncrement={{
                days: dateIncrement,
              }}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
}

export default BookingCalendar;
