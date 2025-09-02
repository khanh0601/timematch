import { getDayInWeek, getDayInWeekWithShortName } from '@/commons/function';
import { Switch } from 'antd';
import moment from 'moment';
import React from 'react';
import { useIntl } from 'umi';
import styles from '../../basic_styles.less';
import useWindowDimensions from '@/commons/useWindowDimensions';

export default function Header({ value, calendarHeaders, displayEvents }) {
  const { formatMessage } = useIntl();
  const date = moment(value.date);
  const { width } = useWindowDimensions();
  const holiday = displayEvents.find(
    event =>
      moment(event.start).format('YYYY-MM-DD') === date.format('YYYY-MM-DD') &&
      event.holidayName,
  );

  const currentDate = () => {
    return date.month() + 1 + '/' + date.date();
  };

  const renderHoliday = () => {
    if (!holiday) {
      return null;
    }

    return <div className={styles.holidayName}>{holiday?.holidayName}</div>;
  };

  const currentDay = moment();
  const compareDateAndCurrentDate =
    date.date() === currentDay.date() &&
    date.month() === currentDay.month() &&
    date.year() === currentDay.year();

  return (
    <div className={styles.headerTableCalendar}>
      <div>{currentDate()}</div>

      <div className={`${compareDateAndCurrentDate ? styles.currentDay : ''}`}>
        {getDayInWeekWithShortName(date.day())}
      </div>

      {renderHoliday()}
    </div>
  );
}
