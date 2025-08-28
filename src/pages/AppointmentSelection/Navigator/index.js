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
  const { viewEventCalendar, onChangeViewEventCalendar } = props;
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const renderMonthNavigation = () => {
    let optionHTML = [];
    for (let i = 1; i <= 12; i++) {
      optionHTML.push(
        <Option value={i} key={i}>
          {i} {formatMessage({ id: 'i18n_month' })}
        </Option>,
      );
    }
    return optionHTML;
  };

  const handleChangeViewEventCalendar = (val, isModal) => {
    if (isModal) {
      setIsModalVisible(isModal);
      return;
    }
    onChangeViewEventCalendar(val);
    setIsModalVisible(isModal);
  };

  const handlePrevCalendar = value => {
    onChangeViewEventCalendar(viewEventCalendar - value);
  };

  const handleNextCalendar = value => {
    onChangeViewEventCalendar(viewEventCalendar + value);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className={styles.navigation}>
        <div className={styles.navItemRight}>
          <div className={styles.navDayAction}>
            <Button
              onClick={() => {
                handlePrevCalendar(1);
              }}
              className={styles.btnDayActionItem}
            >
              <div className={styles.prevBtnMobile} />
            </Button>
            <button className={styles.btnDayActionName}>
              {formatMessage({ id: 'i18n_today' })}
            </button>
            <Button
              onClick={() => {
                handleNextCalendar(1);
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
              src={icon3day}
              alt={'icon'}
              className={styles.calendarViewIcon}
            />
          </Button>
        </div>
      </div>
      <Modal visible={isModalVisible} footer={null} onCancel={handleCloseModal}>
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
