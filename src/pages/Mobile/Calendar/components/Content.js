import wasteBacket from '@/assets/images/i-waste-backet.svg';
import React from 'react';
import { useIntl } from 'umi';
import styles from '../../basic_styles.less';
import { connect } from 'dva';

function Content({
  info,
  selected,
  onSelect,
  deleteEvent,
  showDeleteEvent,
  disabled,
  basicSettingStore,
  memoEventMobile,
}) {
  const { formatMessage } = useIntl();

  const isSelected = event => selected && event.srcId === selected.srcId;
  const event = info.event._def.extendedProps;
  const isSelectedMobile =
    memoEventMobile && memoEventMobile.srcId === event.srcId;

  const handleOnSelect = event => {
    if (disabled) {
      return;
    }
    onSelect(event);
  };

  return (
    <div
      className={`
        ${styles.eventContent}
        ${isSelected(event) ? styles.currentEvent : ''}
        ${event.recentAdded ? styles.recentAdded : ''}
        ${event.isBooked ? styles.isBooked : ''}
      `}
      style={
        info.backgroundColor
          ? {
              backgroundColor: info.backgroundColor,
              border: `border: 1px solid ${info.backgroundColor}`,
            }
          : {}
      }
      onClick={() => handleOnSelect(event)}
    >
      <div className={styles.resizeIconTop}>
        <div></div>
        <div></div>
      </div>

      {showDeleteEvent && (isSelected(event) || isSelectedMobile) && (
        <div
          className={styles.deleteEventBtn}
          onClick={() =>
            deleteEvent(event, basicSettingStore.is_manual_setting)
          }
        >
          <img src={wasteBacket} />
          {formatMessage({ id: 'i18n_delete_event' })}
        </div>
      )}

      <div className={styles.timeText}>
        <p className={`${styles.time}`}>
          {info.event._def.extendedProps.timeText}
        </p>

        {info.event._def.title && (
          <p className={styles.eventName}>{info.event._def.title}</p>
        )}
      </div>
    </div>
  );
}

export default connect(({ BASIC_SETTING }) => ({
  basicSettingStore: BASIC_SETTING,
}))(Content);
