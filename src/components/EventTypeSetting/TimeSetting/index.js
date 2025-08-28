import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';
import TimePicker from './components/TimePicker';
import { isOverlap } from '@/commons/function';
import {
  setPriorityStartTime,
  setPriorityEndTime,
  setPriorityError,
  setState,
} from './actions';
import { saveAdvencedSetting } from '@/pages/CalendarCreation/actions';

import styles from '../advanced_styles.less';

function TimeSetting(props) {
  const { formatMessage } = useIntl();

  const {
    onClose,
    // state
    scheduleSetting,
    messageSetting,
    timeSetting,
    calendarStore,
    // actions
    onSetPriorityStartTime,
    onSetPriorityEndTime,
    onSetPriorityError,
    onSave,
    onResetState,
  } = props;

  const onSaveSetting = () => {
    let isValid = true;
    timeSetting.map((item, index) => {
      const start = moment(item.priority_start_time, 'HH:mm');
      const end = moment(item.priority_end_time, 'HH:mm');
      if (start || end) {
        const overlap = timeSetting.some(
          (s, i) =>
            index != i &&
            isOverlap(
              start,
              end,
              moment(s.priority_start_time, 'HH:mm'),
              moment(s.priority_end_time, 'HH:mm'),
            ),
        );

        if (!start || !end || start.isSameOrAfter(end) || overlap) {
          onSetPriorityError(index, true);
          isValid = false;
        } else {
          onSetPriorityError(index, false);
        }
      }
    });

    if (isValid) {
      onSave(scheduleSetting, messageSetting, timeSetting);
      onClose();
    }
  };

  return (
    <div>
      {timeSetting.map((item, index) => {
        return (
          <div className={styles.selectField} key={index}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>
                {formatMessage({ id: 'i18n_detail_time' })} {item.status}
              </p>
            </div>
            <div className={styles.selections}>
              <TimePicker
                placeholder="例: 9:00"
                value={item.priority_start_time}
                onChange={value => onSetPriorityStartTime(index, value)}
              />
              <span className={styles.devideIcon}>〜</span>
              <TimePicker
                placeholder="例: 18:00"
                value={item.priority_end_time}
                onChange={value => onSetPriorityEndTime(index, value)}
              />
            </div>
            {item.hasError && (
              <div className="errorMessage">
                {formatMessage({ id: 'i18n_error_message_priority_time' })}
              </div>
            )}
          </div>
        );
      })}
      <div className={styles.buttonZone}>
        <Button className={styles.cancelBtn} onClick={onClose}>
          {formatMessage({ id: 'i18n_cancel' })}
        </Button>
        <Button className={styles.cancelBtn} onClick={onResetState}>
          {formatMessage({ id: 'i18n_clear' })}
        </Button>
        <Button className={styles.saveBtn} onClick={onSaveSetting}>
          {formatMessage({ id: 'i18n_set' })}
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = ({
  SCHEDULE_SETTING,
  MESSAGE_SETTING,
  TIME_SETTING,
  CALENDAR_CREATION,
}) => ({
  scheduleSetting: SCHEDULE_SETTING,
  messageSetting: MESSAGE_SETTING,
  timeSetting: TIME_SETTING,
  calendarStore: CALENDAR_CREATION,
});

function mapDispatchToProps(dispatch) {
  return {
    onSetPriorityStartTime: (index, value) =>
      dispatch(setPriorityStartTime(index, value)),
    onSetPriorityEndTime: (index, value) =>
      dispatch(setPriorityEndTime(index, value)),
    onSetPriorityError: (index, value) =>
      dispatch(setPriorityError(index, value)),
    onResetState: () =>
      dispatch({
        type: 'TIME_SETTING/reset',
      }),
    onSave: (...props) => dispatch(saveAdvencedSetting(...props)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimeSetting);
