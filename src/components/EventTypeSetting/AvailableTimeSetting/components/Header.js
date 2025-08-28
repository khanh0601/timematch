import { getDayInWeek, getDayInWeekWithShortName } from '@/commons/function';
import { Switch } from 'antd';
import moment from 'moment';
import React from 'react';
import { useIntl } from 'umi';
import styles from '../../basic_styles.less';
import useWindowDimensions from '@/commons/useWindowDimensions';

export default function Header({
  value,
  calendarHeaders,
  onSwitchChange,
  isAuto,
}) {
  const { formatMessage } = useIntl();
  const date = moment(value.date);
  const { width } = useWindowDimensions();

  let status = !!calendarHeaders.find(
    header => header.weekDay === date.isoWeekday() && header.status,
  );

  const currentDate = () => {
    return width < 768 ? date.month() + 1 + '/' + date.date() : date.date();
  };

  return (
    <div className={styles.headerTableCalendar}>
      <p className={styles.titleMonth}>
        {date.month() + 1}
        {formatMessage({ id: 'i18n_month' })}
      </p>
      {/*<p className={styles.date}>{date.date()}</p>*/}
      <p className={styles.date}>{currentDate()}</p>
      <p className={styles.dateSm}>{currentDate()}</p>

      <p className={styles.titleDay}>{getDayInWeek(date.day())}</p>

      <p className={styles.titleDaySm}>
        {getDayInWeekWithShortName(date.day())}
      </p>
      {/*<div*/}
      {/*  className={`${styles.switchMobile} ${*/}
      {/*    status ? styles.activeSwitchSM : ''*/}
      {/*  }`}*/}
      {/*  onClick={() => onSwitchChange(date, isAuto)}*/}
      {/*>*/}
      {/*  <div className={styles.checkedTime} />*/}
      {/*  <div className={styles.dayWeek}>*/}
      {/*    {!status && (*/}
      {/*      <>*/}
      {/*        <p>終日</p>*/}
      {/*        <p>オフ</p>*/}
      {/*      </>*/}
      {/*    )}*/}

      {/*    {status && <p>オン</p>}*/}
      {/*  </div>*/}
      {/*</div>*/}

      <Switch
        checkedChildren={formatMessage({ id: 'i18n_day_on' })}
        unCheckedChildren={formatMessage({ id: 'i18n_day_off' })}
        checked={status}
        onChange={() => onSwitchChange(date, isAuto)}
      />
    </div>
  );
}
