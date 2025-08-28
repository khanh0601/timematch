import { getDayInWeek, getDayInWeekWithShortName } from '@/commons/function';
import { Switch } from 'antd';
import moment from 'moment';
import React from 'react';
import { useIntl } from 'umi';
import styles from '../../basic_styles.less';

export default function Header({ value }) {
  const { formatMessage } = useIntl();
  const date = moment(value.date);
  const currentDay = moment();
  const compareDateAndCurrentDate =
    date.date() === currentDay.date() &&
    date.month() === currentDay.month() &&
    date.year() === currentDay.year();

  return (
    <div className={styles.headerTableCalendar}>
      <p className={styles.titleDaySm}>
        {getDayInWeekWithShortName(date.day())}
      </p>

      <p className={styles.titleMonth}>
        {date.month() + 1}
        {formatMessage({ id: 'i18n_month' })}
      </p>

      <p
        className={`${styles.dateSm} ${
          compareDateAndCurrentDate ? styles.currentDay : ''
        }`}
      >
        {date.date()}
      </p>

      <p className={styles.titleDay}>{getDayInWeek(date.day())}</p>
    </div>
  );
}
