import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import { Spin } from 'antd';
import moment from 'moment';
import { YYYYMMDD, FORMAT_YYYY, FORMAT_MM } from '@/constant';
import { useIntl } from 'umi';
import date from '@/commons/calendar';

function SelectDate(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [dateClick, setDateClick] = useState(new Date());
  const { changeMonth, setDefaultDate, sideBar } = props;
  const [loading, setLoading] = useState(false);

  let dateNow = moment(new Date(), YYYYMMDD);
  useEffect(() => {
    let monthNow = Number(date.getMonth(dateNow));
    let yearNow = Number(date.getYear(dateNow));
    let dayNow = Number(date.getDate(dateNow));

    let day = `${yearNow}/${monthNow}/${dayNow}`;
    setDateClick(new Date(day));
    setMonth(monthNow);
    setYear(yearNow);
  }, []);

  useEffect(() => {
    if (props.month) {
      setMonth(props.month);
      setYear(props.year);
      let dayNow = Number(date.getDate(dateNow));
      let day = `${props.year}/${props.month}/${dayNow}`;
      setDateClick(new Date(day));
    }
  }, [props.month, props.year]);

  const prevMonth = async () => {
    let prevMonth = date.getPrevMonth(dateClick);
    let dateSelect = moment(prevMonth, YYYYMMDD);
    let monthSelect = date.getMonth(dateSelect);
    let yearSelect = date.getYear(dateSelect);
    setDefaultDate();
    setMonth(monthSelect);
    setYear(yearSelect);
    setDateClick(prevMonth);
    props.setAllDate(monthSelect, yearSelect);
    NGProgress();
    await changeMonth({ month: monthSelect, year: yearSelect });
    NGProgress(false);
  };

  const nextMonth = async () => {
    let nextMonth = date.getNextMonth(dateClick);
    let dateSelect = moment(nextMonth, YYYYMMDD);
    let monthSelect = date.getMonth(dateSelect);
    let yearSelect = date.getYear(dateSelect);
    setDefaultDate();
    setMonth(monthSelect);
    setYear(yearSelect);
    setDateClick(nextMonth);
    props.setAllDate(monthSelect, yearSelect);
    NGProgress();
    await changeMonth({ month: monthSelect, year: yearSelect });
    NGProgress(false);
  };

  const NGProgress = (isLoading = true) => {
    setLoading(isLoading);
  };

  const checkVisibility = (monthC, yearC) => {
    return (
      (monthC > parseInt(moment(new Date()).format(FORMAT_MM)) &&
        parseInt(yearC) === parseInt(moment(new Date()).format(FORMAT_YYYY))) ||
      parseInt(yearC) > parseInt(moment(new Date()).format(FORMAT_YYYY))
    );
  };

  return (
    <div className={styles.selectDate} id="selectDate">
      <div onClick={() => prevMonth()} className={styles.navButtons}>
        <div className={styles.leftArrow}></div>
      </div>
      <span className={styles.currentMonthYear}>
        {year}
        {formatMessage({ id: 'i18n_year' })} {month}
        {formatMessage({ id: 'i18n_month' })}
      </span>
      <div onClick={() => nextMonth()} className={styles.navButtons}>
        <div className={styles.rightArrow}></div>
      </div>
      {!loading || (
        <div className="NG-progress">
          <Spin />
        </div>
      )}
    </div>
  );
}

export default SelectDate;
