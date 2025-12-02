import './styles.less';
import PlusIcon from '../Top/icon/PlusIcon';
import { connect } from 'dva';
import { history, withRouter } from 'umi';
import { useParams, useIntl } from 'umi';
import { useEffect } from 'react';
import moment from 'moment';
import { getStep } from '@/commons/function.js';
import { SwipeableList } from 'react-swipeable-list';
import SwipableItem from '@/components/SwipableItem';
import { profileFromStorage } from '@/commons/function';
import { createTimeAsync, tz } from '@/commons/function';
import { message, Modal } from 'antd';
import useIsPc from '@/hooks/useIsPc';
import iconUser from '@/assets/images/user2.svg';
import iconCalendar from '@/assets/images/calendar-ic.svg';
import iconCalendarDisable from '@/assets/images/calendar-disable.svg';
import iconReturn from '@/assets/images/return.png';
import useIsMobile from '@/hooks/useIsMobile';
const PastAppointmentDetail = props => {
  const isMobile = useIsMobile();
  const { id } = useParams();
  const { dispatch, voteStore, location } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const confirm = Modal.confirm;

  const { voteUser, event } = voteStore;
  const profile = profileFromStorage();
  console.log(profile);
  const isPc = useIsPc();

  const eventId = props.eventId || location.query.id;

  useEffect(() => {
    const { startTime, endTime } = createTimeAsync();
    const payload = {
      vote: eventId,
      type: 1, // screen A
      start: startTime,
      end: endTime,
      timeZone: tz(),
    };
    dispatch({ type: 'VOTE/getVoteUserSummary', payload });
  }, []);

  const handleDelete = id => {
    if (id) {
      history.go(-1);
    }
  };

  const handleClickDeleteEvent = () => {
    const payload = {
      eventTypeId: event.id,
    };

    confirm({
      title: formatMessage({ id: 'i18_delete_event_title' }),
      okText: formatMessage({ id: 'i18n_confirm_delete' }),
      okType: 'danger',
      cancelText: formatMessage({ id: 'i18n_cancel_delete' }),
      onOk() {
        dispatch({
          type: 'EVENT/deleteEventType',
          payload,
          callback: () => {
            if (isPc) {
              setTimeout(() => {
                props.onClose?.();
                message.success('データを削除しました。');
                props.onRefresh?.(payload);
              }, 1000);
            }
          },
        });

        if (!isPc) {
          history.push('/?tab=2', { event_id: event?.id });
        }
      },
      onCancel() {},
    });
  };

  const handleDetailEvent = () => {
    if (event?.user_id !== profile?.id) return;
    history.push(`/past-appointment/${id}/edit`);
  };

  return (
    <div className="container">
      {isPc ? (
        <div className="header">
          <div className=""></div>
          <div className="header-title">詳細</div>
          <div
            onClick={() => {
              if (props.onClose) {
                props.onClose();
                return;
              }
              history.go(-1);
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
      ) : null}
      <div className="content">
        <SwipeableList style={{ overflow: 'unset' }} fullSwipe={true}>
          <SwipableItem item={event} onDelete={handleDelete}>
            <div className="swipableItem">
              <div className="swipableItemInner">
                <div className="past-event-time">
                  {isMobile && (
                    <div
                      className="header-back"
                      onClick={() =>
                        props.onClose ? props.onClose() : history.go(-1)
                      }
                    >
                      <img src={iconReturn} alt="return" />
                    </div>
                  )}
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
                      {moment(
                        event?.calendars && event?.calendars[0]?.start_time,
                      ).format('YYYY/MM/DD')}
                      {moment(
                        event?.calendars && event?.calendars[0]?.start_time,
                      ).format('(dd)')}
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
                        event?.calendars && event?.calendars[0]?.create_at,
                      ).format('YYYY/MM/DD')}
                      {moment(
                        event?.calendars && event?.calendars[0]?.create_at,
                      ).format('(dd)')}{' '}
                      {moment(
                        event?.calendars && event?.calendars[0]?.create_at,
                      ).format('HH:mm')}
                    </span>
                    <span>～</span>
                    <span>
                      {moment(
                        event?.calendars && event?.calendars[0]?.create_at,
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
          </SwipableItem>
        </SwipeableList>
      </div>
      {event && event?.user_id === profile?.id && (
        <div className="btnSubmitItemWrap">
          <div
            onClick={() => {
              history.push(`/calendar/${event?.id}`);
            }}
            className="btnSubmitItem btnSubmitItemBlue"
          >
            <div style={{ marginLeft: 10 }}>編集</div>
          </div>
          <div
            onClick={() => {
              history.push(
                `/${isPc ? 'pc/' : ''}create-calendar?idEvent=${
                  event?.id
                }&clone=1&relationship_type=${event?.relationship_type}`,
              );
            }}
            className="btnSubmitItem btnSubmitItemOutline"
          >
            <div style={{ marginLeft: 10 }}>この日程を流用して新規作成</div>
          </div>
          <div
            onClick={() => handleClickDeleteEvent()}
            className="btnSubmitItem btnSubmitItemRed"
          >
            <div style={{ marginLeft: 10 }}>削除 </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default connect(({ CALENDAR, VOTE, EVENT }) => ({
  calendarStore: CALENDAR,
  voteStore: VOTE,
  eventStore: EVENT,
}))(withRouter(PastAppointmentDetail));
