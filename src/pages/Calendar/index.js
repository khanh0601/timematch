import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styles from './styles.less';
import SelectDate from './SelectDate';
import {
  dayInWeek,
  YYYYMMDD,
  FORMAT_YYYY,
  FORMAT_MM,
  FORMAT_DD,
} from '@/constant';
import { useIntl } from 'umi';
import date from '@/commons/calendar';

function Calendar(props) {
  let {
    freeTime,
    canChangeDate,
    changeMonth,
    curDate,
    className,
    sideBar = false,
  } = props;
  let dateNow = moment(new Date(), YYYYMMDD);
  let disMonth = Number(date.getMonth(dateNow));
  let disYear = Number(date.getYear(dateNow));
  const intl = useIntl();
  const { formatMessage } = intl;
  const [dateOfMonth, setDateOfMonth] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(disMonth);
  const [currentYear, setCurrentYear] = useState(disYear);
  const [datePresent, setDatePresent] = useState(null);
  const currentDate = moment(new Date()).date();

  useEffect(() => {
    const date = +curDate.split('-')[2];
    let indexFind = dateOfMonth.findIndex(x => +x.date === date);
    if (indexFind !== -1) {
      if (
        moment().month() + 1 === Number(currentMonth) &&
        moment().year() === Number(currentYear)
      ) {
        dateOfMonth[indexFind].status = true;
        setDateOfMonth(dateOfMonth);
      } else {
        setDateOfMonth(dateOfMonth);
      }
    }
  }, [curDate, freeTime, dateOfMonth]);

  const setCurrentSelectedDate = () => {
    const selectedDate = parseInt(moment(curDate).format(FORMAT_DD));
    setDatePresent(selectedDate);
    dateOfMonth.map(item => {
      if (item.date === selectedDate) {
        item.status = true;
      }
    });
  };

  // useEffect(() => {
  //   setCurrentSelectedDate();
  // }, [curDate]);

  useEffect(() => {
    let AllDate = date.getDayByMonth(currentYear, currentMonth);
    getAllDate(AllDate);
  }, [currentMonth, currentYear]);

  const getAllDate = AllDate => {
    let addDayTemp = dayInWeek.find(item => item.value === AllDate[0].dow);
    let addDateArray = [];
    for (let index = 0; index < addDayTemp.numberAdd; index++) {
      addDateArray.push({ date: null, dow: null });
    }
    let result = [...addDateArray, ...AllDate];
    if (result.length !== 28) {
      if (result.length > 35) {
        let length = 42 - result.length;
        for (let index = 0; index < length; index++) {
          result.push({ date: null, dow: null });
        }
      } else {
        let length = 35 - result.length;
        for (let index = 0; index < length; index++) {
          result.push({ date: null, dow: null });
        }
      }
    }
    setDateOfMonth(result);
  };

  const setAllDate = (monthSelect, yearSelect) => {
    setCurrentMonth(monthSelect);
    setCurrentYear(yearSelect);
  };

  const checkDate = (date, status, month, year) => {
    let datec = moment(new Date()).format(FORMAT_DD);
    let monthc = moment(new Date()).format(FORMAT_MM);
    let yearc = moment(new Date()).format(FORMAT_YYYY);
    // if (year <= yearc && month <= monthc && date < datec && !status) {
    //   message.error(formatMessage({id: 'i18n_error_edit_in_pass'}))
    //   return false
    // }
    let indexFindPresent = dateOfMonth.findIndex(x => x.date === datePresent);
    if (indexFindPresent !== -1) {
      dateOfMonth[indexFindPresent].status = false;
      setDateOfMonth(dateOfMonth);
    }

    let indexFind = dateOfMonth.findIndex(x => x.date === date);
    if (indexFind !== -1) {
      if (canChangeDate) {
        dateOfMonth[indexFind].status = true;
        setDateOfMonth(dateOfMonth);
      }
      props.setDateChoose(
        moment(`${currentYear}/${currentMonth}/${date}`),
        `${year}/${month}/${Number(date) > 9 ? date : `0${date}`}`,
      );
    }
    if (!canChangeDate) return;
    setDatePresent(date);
  };

  const showTimesheet = () => {
    const data = freeTime.filter(
      f => +moment(f.date).format(FORMAT_MM) === +currentMonth,
    );
    if (data && data.length) {
      data.forEach(f => {
        const indexFind = dateOfMonth.findIndex(
          x => x.date === +moment(f.date).format(FORMAT_DD),
        );
        if (indexFind !== -1) {
          dateOfMonth[indexFind].status = true;
        }
      });
    }

    return (
      <div className={`${styles.dayUserValue} ${!className || 'child'}`}>
        {dateOfMonth.map((value, index) => {
          return (
            <div
              onClick={() => {
                if (
                  moment(`${value.year}/${value.month}/${value.date}`).format(
                    YYYYMMDD,
                  ) >= moment(new Date()).format(YYYYMMDD)
                ) {
                  checkDate(value.date, value.status, value.month, value.year);
                }
              }}
              key={index}
              className={`${
                value.date === null
                  ? styles.notDateMonth
                  : currentDate === value.date
                  ? datePresent === value.date
                    ? styles.activeChosse
                    : styles.currentDate
                  : value.status
                  ? datePresent === value.date
                    ? styles.activeChosse
                    : styles.activeDiv
                  : styles.dateMonth
              }`}
            >
              <span
                className={
                  !checkVisibility(value.date, value.month, value.year)
                    ? styles.setOpacity
                    : styles.unSetOpacity
                }
              >
                {value.date}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const checkVisibility = (dayC, monthC, yearC) => {
    const args = moment([yearC, monthC - 1, dayC]).format('YYYY-MM-DD');
    const current = moment(new Date()).format('YYYY-MM-DD');
    return args >= current;
  };

  const setDefault = () => {
    setDateOfMonth([]);
  };

  return (
    <>
      <SelectDate
        month={currentMonth}
        year={currentYear}
        setAllDate={(monthSelect, yearSelect) =>
          setAllDate(monthSelect, yearSelect)
        }
        changeMonth={value => changeMonth(value)}
        setDefaultDate={setDefault}
        sideBar={sideBar}
      />
      <div className={`${styles.tableDate} ${className}`}>
        <div className={styles.dayUser}>
          {dayInWeek.map((value, index) => (
            <div key={index}>{value.value}</div>
          ))}
        </div>
        {showTimesheet()}
      </div>
    </>
  );
}

export default Calendar;
