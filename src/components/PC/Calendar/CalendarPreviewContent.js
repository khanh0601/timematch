import wasteBacket from '@/assets/images/i-waste-backet.svg';
import React, { useMemo, useState } from 'react';
import { useIntl, history } from 'umi';
import styles from './styles/calendarPreview.less';
import { Modal } from 'antd';
import PlusIcon from '../../../pages/Top/icon/PlusIcon';
import moment from 'moment';
import { connect } from 'dva';
import { profileFromStorage, getStep } from '@/commons/function';
import iconUser from '@/assets/images/user2.svg';
import iconCalendar from '@/assets/images/calendar-ic.svg';
import iconCalendarDisable from '@/assets/images/calendar-disable.svg';

function Content({
  info,
  selected,
  onSelect,
  deleteEvent,
  basicSettingStore,
  voters,
  onClose,
  voteStore,
}) {
  const [showDetail, setShowDetail] = useState(false);
  const [voter, setVoter] = useState();
  const { formatMessage } = useIntl();
  const profile = profileFromStorage();
  const { voteUser } = voteStore || {};

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
        if (!event.isEventClose || event.recentAdded || showDetail) {
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
          visible={showDetail}
          onCancel={() => {
            setShowDetail(false);
            setVoter();
          }}
        >
          <div className="header" onClick={e => e.stopPropagation()}>
            <div
              onClick={e => {
                e.stopPropagation();
                setShowDetail(false);
                setVoter();
                if (onClose) {
                  onClose();
                }
              }}
              className="close-btn"
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
          <div className="content" onClick={e => e.stopPropagation()}>
            <div className="swipableItem">
              <div className="swipableItemInner">
                <div className="past-event-time">
                  <span>{event && event?.name}</span>
                </div>
              </div>
              <div className="pastDetailInfoWrap">
                <div className="pastDetailInfo">
                  <div className="pastDetailInfoIc">
                    <img src={iconCalendarDisable} alt="icon Calendar" />
                  </div>
                  <div className="">作成日 : </div>
                  <div className="pastDetailInfoItem">
                    <span>
                      {moment(voteUser[0]?.created_at).format('YYYY/MM/DD')}
                      {moment(voteUser[0]?.created_at).format('(dd)')}
                    </span>
                  </div>
                </div>
                <div className="pastDetailInfo">
                  <div className="pastDetailInfoIc">
                    <img src={iconUser} alt="icon User" />
                  </div>
                  <div className="">主催者：</div>
                  <div className="pastDetailInfoItem">
                    <span>{profile.name}</span>
                  </div>
                </div>
                <div className="pastDetailInfo">
                  <div className="pastDetailInfoIc">
                    <img src={iconCalendar} alt="icon Calendar" />
                  </div>
                  <div className="">開催日： </div>
                  <div className="pastDetailInfoItem">
                    <span>
                      {moment(
                        event?.calendars && event?.calendars[0]?.start_time,
                      ).format('YYYY/MM/DD')}
                      {moment(
                        event?.calendars && event?.calendars[0]?.start_time,
                      ).format('(dd)')}{' '}
                      {moment(
                        event?.calendars && event?.calendars[0]?.start_time,
                      ).format('HH:mm')}
                    </span>
                    <span>～</span>
                    <span>
                      {moment(
                        event?.calendars && event?.calendars[0]?.start_time,
                      )
                        .add(getStep(event), 'minutes')
                        .format('HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="pastDetailInfo">
                  <div className="pastDetailInfoIc">
                    <img src={iconUser} alt="icon Calendar" />
                  </div>
                  <div className="">参加者： </div>
                  <div className="pastDetailInfoItem pastDetailInfoInvite">
                    {voteUser?.map((item, index) => (
                      <span key={index}>{item.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default connect(({ BASIC_SETTING, VOTE }) => ({
  basicSettingStore: BASIC_SETTING,
  voteStore: VOTE,
}))(Content);
