import React from 'react';
import { connect } from 'dva';
import { Button, Input, Tooltip } from 'antd';
import { useIntl } from 'umi';
import helperImage from '@/assets/images/imgQuestion.png';

import { setCalendarCreateComment, setCalendarConfirmComment } from './actions';
import { saveAdvencedSetting } from '@/pages/CalendarCreation/actions';

import styles from '../advanced_styles.less';

function MessageSetting(props) {
  const { formatMessage } = useIntl();
  const {
    // props
    onClose,
    // actions
    onSetCalendarCreateComment,
    onSetCalendarConfirmComment,
    onSave,
    // state
    scheduleSetting,
    messageSetting,
    timeSetting,
  } = props;

  const { calendar_create_comment, calendar_confirm_comment } = messageSetting;

  const onSaveSetting = () => {
    onSave(scheduleSetting, messageSetting, timeSetting);
    onClose();
  };

  return (
    <div>
      <p className={styles.intruction}>
        {formatMessage({ id: 'i18n_message_setting_intruction' })}
      </p>

      <div className={styles.textareaField}>
        <div className={styles.titleField}>
          <div className={styles.titleFieldIcon}></div>
          <p className={styles.fs16}>
            {formatMessage({
              id: 'i18n_message_announced_when_start_adjust',
            })}
          </p>
          <Tooltip
            title={formatMessage({
              id: 'i18n_message_announced_when_start_adjust_tooltip',
            })}
            overlayClassName={styles.tooltipAdvanced}
          >
            <div className={styles.helper}>
              <img src={helperImage} className="helper" />
            </div>
          </Tooltip>
        </div>
        <Input.TextArea
          placeholder={formatMessage({
            id: 'i18n_message_announced_when_start_adjust_placeholder',
          })}
          value={calendar_create_comment}
          onChange={onSetCalendarCreateComment}
        ></Input.TextArea>
      </div>

      <div className={styles.textareaField}>
        <div className={styles.titleField}>
          <div className={styles.titleFieldIcon}></div>
          <p className={styles.fs16}>
            {formatMessage({
              id: 'i18n_message_announced_when_stop_adjust',
            })}
          </p>
          <Tooltip
            title={formatMessage({
              id: 'i18n_message_announced_when_stop_adjust_tooltip',
            })}
            overlayClassName={styles.tooltipAdvanced}
          >
            <div className={styles.helper}>
              <img src={helperImage} className="helper" />
            </div>
          </Tooltip>
        </div>
        <Input.TextArea
          placeholder={formatMessage({
            id: 'i18n_message_announced_when_stop_adjust_placeholder',
          })}
          value={calendar_confirm_comment}
          onChange={onSetCalendarConfirmComment}
        ></Input.TextArea>
      </div>
      <div className={styles.buttonZone}>
        <Button className={styles.cancelBtn} onClick={onClose}>
          {formatMessage({ id: 'i18n_cancel' })}
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
}) => ({
  scheduleSetting: SCHEDULE_SETTING,
  messageSetting: MESSAGE_SETTING,
  timeSetting: TIME_SETTING,
});

function mapDispatchToProps(dispatch) {
  return {
    onSetCalendarCreateComment: event =>
      dispatch(setCalendarCreateComment(event.target.value)),
    onSetCalendarConfirmComment: event =>
      dispatch(setCalendarConfirmComment(event.target.value)),
    onSave: (...props) => dispatch(saveAdvencedSetting(...props)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageSetting);
