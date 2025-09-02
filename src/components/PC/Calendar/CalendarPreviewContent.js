import wasteBacket from '@/assets/images/i-waste-backet.svg';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'umi';
import styles from './styles/calendarPreview.less';
import { Modal } from 'antd';
import PlusIcon from '../../../pages/Top/icon/PlusIcon';
import moment from 'moment';
import { connect } from 'dva';

function Content({
  info,
  selected,
  onSelect,
  deleteEvent,
  basicSettingStore,
  voters,
}) {
  const [showDetail, setShowDetail] = useState(false);
  const [voter, setVoter] = useState();
  const { formatMessage } = useIntl();

  const isSelected = event =>
    selected &&
    (event.fromEdit
      ? event.randomId == selected.randomId
      : event.srcId === selected.srcId);
  const event = info.event._def.extendedProps;

  const isRecentAdded = event.recentAdded || event.is_auto_generated;
  const eventName =
    info.event.extendedProps.name ||
    info.event.extendedProps.holiday_name ||
    '候補';

  const handleShowModal = async () => {
    try {
      const def = info.event._def;
      const vote = voters.find(x => Number(def?.publicId) == x.id);
      setVoter(vote);
    } catch (error) {}
  };

  const btnDelAlignBottom = useMemo(() => {
    try {
      const [startTime] = info.timeText?.split(' - ');
      const [h, m] = startTime.split(':');

      return +h == 0 && +m <= 30;
    } catch (error) {
      return false;
    }
  }, [info.timeText]);

  const diff = useMemo(() => {
    if (!event) return 0;
    const startTime = moment(event.start_time);
    const endTime = moment(event.end_time);
    return endTime.diff(startTime, 'minutes');
  }, [event]);

  const expiredTime = useMemo(() => {
    if (!event) return false;
    return moment().isAfter(moment(event?.end_time));
  }, [event]);

  return (
    <div
      className={`
        ${isSelected(event) ? styles.currentEvent : ''}
        ${isRecentAdded ? styles.recentAdded : ''}
        ${event.isBooked ? styles.isBooked : ''}
        ${event.isEventClose ? styles.isEventClose : ''}
        ${expiredTime ? styles.expiredTime : ''}
      `}
      style={
        info.backgroundColor
          ? {
              backgroundColor: info.backgroundColor,
              border: `border: 1px solid ${info.backgroundColor}`,
            }
          : {
              cursor: event.isEventClose ? 'pointer' : 'default',
            }
      }
      onMouseOver={isRecentAdded ? () => onSelect(event) : undefined}
      onMouseLeave={isRecentAdded ? () => onSelect(undefined) : undefined}
      onClick={() => {
        if (!event.isEventClose || event.recentAdded) {
          return;
        }
        setShowDetail(true);
        handleShowModal();
      }}
    >
      <div className={styles.resizeIconTop}>
        <div></div>
        <div></div>
      </div>
      {isSelected(event) && isRecentAdded && (
        <div
          className={`${styles.deleteEventBtn} ${
            btnDelAlignBottom ? styles.btnDelAlignBottom : ''
          }`}
          onClick={() => {
            deleteEvent(event, basicSettingStore.is_manual_setting);
          }}
        >
          <img src={wasteBacket} />
          {formatMessage({ id: 'i18n_delete_event' })}
        </div>
      )}

      <div
        className={`${styles.timeText}
        ${diff == 15 ? styles.timeTextShort : ''}
        ${diff == 15 && eventName.length > 10 ? styles.timeTextLong : ''}
        ${diff == 30 ? styles.timeText30 : ''}
        ${diff == 45 ? styles.timeText45 : ''}
        ${diff == 60 ? styles.timeText60 : ''}
        ${diff == 90 ? styles.timeText90 : ''}
        ${diff == 120 ? styles.timeText120 : ''}
        `}
      >
        <p className={styles.eventName} style={{ marginBottom: 0 }}>
          {eventName}
        </p>
        {diff <= 15 && ', '}

        <p className={`${styles.time}`} style={{ marginBottom: 0 }}>
          {info.timeText.replace('-', '~')}
        </p>
      </div>

      {showDetail && (
        <Modal
          forceRender={true}
          destroyOnClose={false}
          closable={false}
          maskClosable={false}
          wrapClassName="detail-calendar-modal"
          visible
        >
          <div className="content">
            <div className="swipableItemInner">
              <div className="swipableItemInnerDiv"></div>
              <div className="past-event-time">
                {/* format date time by japanese */}
                <span>
                  {moment(
                    event?.calendars && event?.calendars[0]?.start_time,
                  ).format('MMMM Do (dd)')}
                </span>
                <span style={{ marginLeft: 10 }}>
                  {info.timeText.replace('-', '~')}
                </span>
              </div>
              <div
                onClick={e => {
                  e.stopPropagation();
                  setShowDetail(prev => !prev);
                  setVoter();
                }}
                className="close-btn bgDarkBlue"
              >
                <div
                  style={{
                    rotate: '45deg',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <PlusIcon />
                </div>
              </div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex-0-5">イベント名</div>
              <div className="">:</div>
              <div className="flex1">{event && event?.name}</div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex-0-5">参加者</div>
              <div className="">:</div>
              <div className="flex1">
                {voter?.voters?.map(x => x.name)?.join(', ') || ''}
              </div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex-0-5">
                {formatMessage({ id: 'i18n_memo' })}
              </div>
              <div className="">:</div>
              <div className="flex1">{voter?.comment || ''}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default connect(({ BASIC_SETTING }) => ({
  basicSettingStore: BASIC_SETTING,
}))(Content);
