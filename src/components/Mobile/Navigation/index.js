import { connect } from 'dva';
import styles from './styles.less';
import { Button, Select, Modal } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'umi';
import moment from 'moment';
import iconMenu from '@/assets/images/i-menu.png';
import iconDay from '@/assets/images/i-day.png';
import icon3day from '@/assets/images/i-3day.png';
import iconWeek from '@/assets/images/i-week.png';

const Navigation = ({ showMenu = true, ...props }) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    viewEventCalendar,
    onChangeViewEventCalendar,
    onTodayEvent,
    onSelectMonth,
    onSelectYear,
    showSidebar,
    isSelectMonth,
    isSelectYear,
    changeMonth,
    changeYear,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());

  useEffect(() => {
    setSelectedMonth(Number(moment().month() + 1));
  }, [isSelectMonth]);

  useEffect(() => {
    setSelectedYear(Number(moment().year()));
  }, [isSelectYear]);

  useEffect(() => {
    if (changeMonth) {
      setSelectedMonth(Number(changeMonth));
    }
  }, [changeMonth]);

  useEffect(() => {
    if (changeYear) {
      setSelectedYear(Number(changeYear));
    }
  }, [changeYear]);

  const renderYearNavigation = () => {
    const currentYear = moment().year();
    return Array.from(
      { length: 11 },
      (_, index) => currentYear - 5 + index,
    ).map(year => ({
      value: year,
      label: `${year} ${formatMessage({ id: 'i18n_year' })}`,
    }));
  };

  const renderMonthNavigation = () => {
    return Array.from({ length: 12 }, (_, index) => index + 1).map(month => ({
      value: month,
      label: `${month} ${formatMessage({ id: 'i18n_month' })}`,
    }));
  };

  const handleChangeViewEventCalendar = (val, isModal) => {
    if (isModal) {
      setIsModalVisible(isModal);
      return;
    }
    onChangeViewEventCalendar('view', val);
    setIsModalVisible(isModal);
  };

  const handlePrevCalendar = value => {
    onChangeViewEventCalendar('prev', value);
  };

  const handleNextCalendar = value => {
    onChangeViewEventCalendar('next', value);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleChangeIcon = () => {
    if (viewEventCalendar === 1) {
      return iconDay;
    } else if (viewEventCalendar === 3) {
      return icon3day;
    } else {
      return iconWeek;
    }
  };

  const handleChangeMonth = value => {
    const monthValue = Number(value);
    onSelectMonth(monthValue, selectedYear);
    setSelectedMonth(monthValue);
  };

  const handleChangeYear = value => {
    const yearValue = Number(value);
    onSelectYear(yearValue, selectedMonth);
    setSelectedYear(yearValue);
  };

  const handleShowSidebar = () => {
    showSidebar();
  };

  return (
    <>
      <div className={styles.navigation}>
        <div className={styles.navItemLeft}>
          <Button className={styles.navMenu} onClick={handleShowSidebar}>
            <img src={iconMenu} alt="Menu" />
          </Button>
          <Select
            value={selectedYear}
            onChange={handleChangeYear}
            dropdownMatchSelectWidth={false}
            options={renderYearNavigation()}
          />
          <Select
            value={selectedMonth}
            onChange={handleChangeMonth}
            options={renderMonthNavigation()}
          />
        </div>
        <div className={styles.navItemRight}>
          <div className={styles.navDayAction}>
            <Button
              onClick={() => handlePrevCalendar(viewEventCalendar)}
              className={styles.btnDayActionItem}
            >
              <div className={styles.prevBtnMobile} />
            </Button>
            <Button
              onClick={onTodayEvent}
              className={`${styles.btnDayActionName} ${styles.borderPrimaryBlue} ${styles.textPrimaryBlue}`}
            >
              {formatMessage({ id: 'i18n_today' })}
            </Button>
            <Button
              onClick={() => handleNextCalendar(viewEventCalendar)}
              className={styles.btnDayActionItem}
            >
              <div className={styles.nextBtnMobile} />
            </Button>
          </div>
          <Button
            onClick={() => handleChangeViewEventCalendar(null, true)}
            className={styles.calendarViewBtn}
          >
            <img
              src={handleChangeIcon()}
              alt="Calendar View"
              className={styles.calendarViewIcon}
            />
          </Button>
        </div>
      </div>
      <Modal open={isModalVisible} footer={null} onCancel={handleCloseModal}>
        <div className={styles.modalContent}>
          <Button
            className={styles.modalItem}
            onClick={() => handleChangeViewEventCalendar(1, false)}
          >
            <img
              src={iconDay}
              alt="Day View"
              className={styles.calendarViewIcon}
            />
            {formatMessage({ id: 'i18n_day_number' })}
            {formatMessage({ id: 'i18n_calendar_monday' })}
          </Button>
          <hr />
          <Button
            className={styles.modalItem}
            onClick={() => handleChangeViewEventCalendar(3, false)}
          >
            <img
              src={icon3day}
              alt="3 Day View"
              className={styles.calendarViewIcon}
            />
            {formatMessage({ id: 'i18n_3day_number' })}
            {formatMessage({ id: 'i18n_calendar_monday' })}
          </Button>
          <hr />
          <Button
            className={styles.modalItem}
            onClick={() => handleChangeViewEventCalendar(7, false)}
          >
            <img
              src={iconWeek}
              alt="Week View"
              className={styles.calendarViewIcon}
            />
            {formatMessage({ id: 'i18n_week_number' })}
            {formatMessage({ id: 'i18n_calendar_monday' })}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default connect(({ EVENT, MASTER }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
}))(Navigation);
