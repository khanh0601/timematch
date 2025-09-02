import wasteBacket from '@/assets/images/i-waste-backet.svg';
import React from 'react';
import { useIntl, history } from 'umi';
import styles from '../../basic_styles.less';
import { connect } from 'dva';
import { profileFromStorage } from '@/commons/function';

function Content({
  info,
  selected,
  onSelect,
  deleteEvent,
  basicSettingStore,
  isSelected,
}) {
  const { formatMessage } = useIntl();
  const profile = profileFromStorage();

  const onSelected = event =>
    selected && event.srcId === selected.srcId && !event.isSync && isSelected;
  const onDetail = event =>
    !isSelected && event && event.srcId && !event.isSync;
  const event = info.event._def.extendedProps;

  const start_time = new Date(event.start_time);
  const end_time = new Date(event.end_time);
  const diff = (end_time - start_time) / 60000;
  const isLessThan30MinutesDiff = diff < 30;

  return (
    <div
      className={`
        ${onDetail(event) ? styles.eventContent : styles.syncData}
        ${onSelected(event) ? styles.currentEvent : ''}
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
      onClick={() => {
        onDetail(event)
          ? event?.isEventClose
            ? history.push(
                `/past-appointment/${info.event.id}?id=${event?.slugURL}`,
              )
            : event?.eventByUser === profile?.id
            ? history.push(
                `/appointment/${info.event.id}?id=${event?.slugURL}&name=${event?.uuidVote}`,
              )
            : history.push(`/appointment-selection?id=${event?.slugURL}`)
          : onSelect(event);
      }}
    >
      <div className={styles.resizeIconTop}>
        <div></div>
        <div></div>
      </div>
      {onSelected(event) && isSelected && !onDetail(event) && !event.isBooked && (
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
        <p className={`${styles.time} ${styles.m0}`}>
          {/*{info.event._def.extendedProps.timeText ?? info.timeText}*/}
          {isLessThan30MinutesDiff
            ? info.event._def.title !== 'undefined'
              ? info.event._def.title
              : info.event._def.extendedProps?.name
            : ''}
        </p>

        {!isLessThan30MinutesDiff && info.event._def.title && (
          <p className={`${styles.eventName} ${styles.m0}`}>
            {info.event._def.title !== 'undefined'
              ? info.event._def.title
              : info.event._def.extendedProps?.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default connect(({ BASIC_SETTING }) => ({
  basicSettingStore: BASIC_SETTING,
}))(Content);
