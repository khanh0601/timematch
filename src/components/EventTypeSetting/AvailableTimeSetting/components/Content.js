import wasteBacket from '@/assets/images/i-waste-backet.svg';
import React from 'react';
import { useIntl } from 'umi';
import styles from '../../basic_styles.less';
import { connect } from 'dva';

function Content({ info, selected, onSelect, deleteEvent, basicSettingStore }) {
  const { formatMessage } = useIntl();

  const isSelected = event => selected && event.srcId === selected.srcId;
  const event = info.event._def.extendedProps;

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
      onClick={() => onSelect(event)}
    >
      <div className={styles.resizeIconTop}>
        <div></div>
        <div></div>
      </div>
      {isSelected(event) && (
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
        {/* <p className={`${styles.time} ${styles.notShowOnMobile}`}>
          {info.timeText.replace('-', '~')}
        </p>
         */}

        <p className={`${styles.time}`}>{info.timeText.replace('-', '~')}</p>

        {/* <div className={`${styles.time} ${styles.showOnMobile}`}>
          <p>{info.timeText.slice(0, info.timeText.indexOf('-'))}</p>
          <span className={styles.rotateOnMobile}>~</span>
          <span>~</span>
          <p>{info.timeText.slice(info.timeText.indexOf('-') + 1)}</p>
        </div> */}

        {info.event.extendedProps.name && (
          <p className={styles.eventName}>{info.event.extendedProps.name}</p>
        )}
      </div>
    </div>
  );
}

export default connect(({ BASIC_SETTING }) => ({
  basicSettingStore: BASIC_SETTING,
}))(Content);
