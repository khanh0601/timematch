import React from 'react';
import styles from '../advanced_styles.less';
import { Button, Input, Tooltip } from 'antd';
import { useIntl, history } from 'umi';

import helperImage from '@/assets/images/imgQuestion.png';
import bubbleArrowImage from '@/assets/images/i-bubble-arrow.svg';

function MessageSetting(props) {
  const intl = useIntl();
  const { formatMessage } = intl;

  const {
    setCalendarCreateComment,
    setCalendarConfirmComment,
    updateMessageSetting,
    calendarCreateComment,
    calendarConfirmComment,
    onCancelTemp,
  } = props;

  return (
    <div>
      <p className={styles.intruction}>
        {formatMessage({ id: 'i18n_message_setting_intruction' })}
      </p>

      <div className={styles.textareaField}>
        <div className={styles.titleField}>
          <div className={styles.titleFieldIcon}></div>
          <p className={styles.titleFieldIconOther}>
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
          value={calendarCreateComment}
          onChange={event => setCalendarCreateComment(event.target.value)}
        ></Input.TextArea>
      </div>

      <div className={styles.textareaField}>
        <div className={styles.titleField}>
          <div className={styles.titleFieldIcon}></div>
          <p className={styles.titleFieldIconOther}>
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
          value={calendarConfirmComment}
          onChange={event => setCalendarConfirmComment(event.target.value)}
        ></Input.TextArea>
      </div>
      <div className={styles.buttonZone}>
        <Button className={styles.cancelBtn} onClick={() => onCancelTemp()}>
          {formatMessage({ id: 'i18n_cancel' })}
        </Button>
        <Button
          className={styles.saveBtn}
          onClick={() => updateMessageSetting()}
        >
          {formatMessage({ id: 'i18n_set' })}
        </Button>
      </div>
    </div>
  );
}

export default MessageSetting;
