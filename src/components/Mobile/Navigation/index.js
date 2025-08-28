import { connect } from 'dva';
import styles from './styles.less';
import { Button, Select, Modal } from 'antd';
import React from 'react';
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
  } = props;
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const renderMonthNavigation = () => {
    let optionHTML = [];
    for (let i = 1; i <= 12; i++) {
      optionHTML.push(
        <Select.Option value={i} key={i}>
          {i} {formatMessage({ id: 'i18n_month' })}
        </Select.Option>,
      );
    }
    return optionHTML;
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

  const handleRedirectPage = path => () => {
    window.location.href = path;
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
    onSelectMonth(value);
  };

  return (
    <>
      <div className={styles.navigation}>
        <div className={styles.navItemLeft}>
          <Button
            className={styles.navMenu}
            onClick={handleRedirectPage('/menu')}
          >
            <img src={iconMenu} />
          </Button>
          <Select
            defaultValue={moment().month() + 1}
            onChange={handleChangeMonth}
          >
            {renderMonthNavigation()}
          </Select>
        </div>
        <div className={styles.navItemRight}>
          <div className={styles.navDayAction}>
            <Button
              onClick={() => {
                handlePrevCalendar(viewEventCalendar);
              }}
              className={styles.btnDayActionItem}
            >
              <div className={styles.prevBtnMobile} />
            </Button>
            <Button
              onClick={() => {
                onTodayEvent();
              }}
              className={styles.btnDayActionName}
            >
              {formatMessage({ id: 'i18n_today' })}
            </Button>
            <Button
              onClick={() => {
                handleNextCalendar(viewEventCalendar);
              }}
              className={styles.btnDayActionItem}
            >
              <div className={styles.nextBtnMobile} />
            </Button>
          </div>
          <Button
            onClick={e => handleChangeViewEventCalendar(null, true)}
            className={styles.calendarViewBtn}
          >
            <img
              src={handleChangeIcon()}
              alt={'icon'}
              className={styles.calendarViewIcon}
            />
          </Button>
        </div>
      </div>
      <Modal open={isModalVisible} footer={null} onCancel={handleCloseModal}>
        <div className={styles.modalContent}>
          <Button
            className={`${styles.modalItem}`}
            onClick={e => handleChangeViewEventCalendar(1, false)}
          >
            <img
              src={iconDay}
              alt={'icon'}
              className={styles.calendarViewIcon}
            />
            {formatMessage({ id: 'i18n_day_number' })}
            {formatMessage({ id: 'i18n_calendar_monday' })}
          </Button>
          <hr />
          <Button
            className={`${styles.modalItem}`}
            onClick={e => handleChangeViewEventCalendar(3, false)}
          >
            <img
              src={icon3day}
              alt={'icon'}
              className={styles.calendarViewIcon}
            />
            {formatMessage({ id: 'i18n_3day_number' })}
            {formatMessage({ id: 'i18n_calendar_monday' })}
          </Button>
          <hr />
          <Button
            className={`${styles.modalItem}`}
            onClick={e => handleChangeViewEventCalendar(7, false)}
          >
            <img
              src={iconWeek}
              alt={'icon'}
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
