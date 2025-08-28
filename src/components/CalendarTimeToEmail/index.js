import React, { useState } from 'react';
import styles from './styles.less';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import dayjs from 'dayjs';
import { DOW_NAME, FORMAT_DATE_TEXT_1 } from '@/constant';
import { connect } from 'dva';
import moment from 'moment';
import { YYYYMMDD } from '../../constant';

const Calendar = props => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    setSelectedDate,
    selectedDate,
    eventStore,
    dayObj,
    setDayObj,
    formatDate,
    weekDays,
  } = props;
  const { currentEvent, firstSetupFreeTime, eventCustomizeDates } = eventStore;

  const [errorMsg, setErrorMsg] = useState(undefined);

  const handlePrev = () => {
    setDayObj(dayObj.subtract(2, 'weeks'));
  };

  const handleNext = () => {
    setDayObj(dayObj.add(2, 'weeks'));
  };

  const updateSelectedDate = day => {
    const updated = { ...selectedDate };
    const formatDay = formatDate(day);
    if (updated[formatDay]) {
      delete updated[formatDay];
    } else if (Object.keys(selectedDate).length === 3) {
      setErrorMsg(formatMessage({ id: 'i18n_max_day_select' }));
      setTimeout(() => {
        setErrorMsg(undefined);
      }, 3000);
    } else {
      updated[formatDay] = weekDays[formatDay];
    }
    setSelectedDate(updated);
  };

  const checkAvailableCurrent = () => {
    const dateFormat = formatDate();
    let arrayBlockTimes = weekDays[dateFormat] || [];
    const availableBefore = currentEvent.reception_start_time
      ? currentEvent.reception_start_time / 60
      : 0;

    arrayBlockTimes =
      arrayBlockTimes &&
      arrayBlockTimes.filter(
        item =>
          dayjs(item.start_time).hour() +
            dayjs(item.start_time).minute() / 60 -
            availableBefore >
          dayjs().hour() + dayjs().minute() / 60,
      );

    return arrayBlockTimes.length;
  };

  const checkCurrentDateOnOff = date => {
    if (!eventCustomizeDates.length) {
      return 2;
    }
    const dateFind = eventCustomizeDates.find(item => item.date === date);

    if (!dateFind) {
      return 2;
    }

    const { status } = dateFind;

    return status;
  };

  const checkDay = date => {
    const classes = ['day-cell'];
    const dateRender = formatDate(date);
    const current = formatDate();
    const listKeyValueSelect = Object.keys(selectedDate);
    const listDayActive = firstSetupFreeTime.reduce((preValue, nextItem) => {
      const { status, day_of_week } = nextItem;
      if (status) {
        return preValue.concat(day_of_week);
      }
      return preValue;
    }, []);
    const isoDateWeeks = moment(dateRender, YYYYMMDD).isoWeekday();

    if (
      listDayActive.includes(isoDateWeeks) ||
      checkCurrentDateOnOff(dateRender) === 1
    ) {
      classes.push('day-cell-available');
    }

    if (
      dayjs(dateRender).isBefore(formatDate()) ||
      !checkCurrentDateOnOff(dateRender)
    ) {
      classes.push('day-cell-disabled');
    }

    if (dateRender === current) {
      classes.push('day-cell-current');
    }

    if (listKeyValueSelect.includes(dateRender)) {
      classes.push('day-cell-active');
    }

    return classes.join(' ');
  };

  const renderMonthDays = () => {
    const result = [];

    for (let i = 0; i < 14; i++) {
      const day = dayObj.add(i, 'day');

      result.push(
        <div
          className={checkDay(day)}
          onClick={() => updateSelectedDate(day)}
          key={i}
        >
          {dayObj.add(i, 'day').date()}
        </div>,
      );
    }

    return result;
  };

  return (
    <div className={styles.CalendarContainer}>
      <div className={styles.header}>
        <CaretLeftOutlined onClick={handlePrev} />
        <div className="datetime">{dayObj.format(FORMAT_DATE_TEXT_1)}</div>
        <CaretRightOutlined onClick={handleNext} />
      </div>
      <div className={styles.calendarLabel}>
        {DOW_NAME.map((day, index) => (
          <div className="week-cell" key={index}>
            {day.name_jp}
          </div>
        ))}
      </div>
      <div className={styles.lineCalendar} />
      <div className={styles.dayContainer}>{renderMonthDays()}</div>
      {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
    </div>
  );
};

export default connect(({ EVENT }) => ({ eventStore: EVENT }))(Calendar);
