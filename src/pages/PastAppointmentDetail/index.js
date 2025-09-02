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

const PastAppointmentDetail = props => {
  const { id } = useParams();
  const { dispatch, voteStore, location } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const confirm = Modal.confirm;

  const { voteUser, event } = voteStore;
  const profile = profileFromStorage();

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

      {profile?.id === event?.user_id ? (
        <>
          <div className="content">
            <SwipeableList style={{ overflow: 'unset' }} fullSwipe={true}>
              <SwipableItem item={event} onDelete={handleDelete}>
                <div className="swipableItem">
                  <div className="swipableItemInner">
                    <div className="swipableItemInnerDiv"></div>
                    <div className="past-event-time">
                      {/* format date time by japanese */}
                      <span>
                        {moment(
                          event?.calendars && event?.calendars[0]?.start_time,
                        ).format('MMMM Do (dd) HH:mm')}
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
                  <div className="flexSpaceBetween">
                    <div className="flex-0-5">イベント名</div>
                    <div className="">:</div>
                    <div className="flex1">{event && event?.name}</div>
                  </div>
                  <div className="flexSpaceBetween">
                    <div className="flex-0-5">参加者</div>
                    <div className="">:</div>
                    <div className="flex1">
                      {voteUser?.map(item => item.name).join(', ')}
                    </div>
                  </div>
                  <div className="flexSpaceBetween">
                    <div className="flex-0-5">
                      {formatMessage({ id: 'i18n_memo' })}
                    </div>
                    <div className="">:</div>
                    <div className="flex1">
                      {event && event?.calendars[0]?.calendar_create_comment}
                    </div>
                  </div>
                </div>
              </SwipableItem>
            </SwipeableList>
          </div>
          {event && event?.user_id === profile?.id && (
            <div className="buttons">
              <div
                onClick={() => {
                  history.push(`/calendar/${event?.id}`);
                }}
                className="button bgDarkBlue shadowPrimary"
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
                className="button bgPrimaryBlue shadowPrimary"
              >
                <div style={{ marginLeft: 10 }}>この日程を流用して新規作成</div>
              </div>
              <div
                onClick={() => handleClickDeleteEvent()}
                className="button bgLightRed shadowPrimary"
              >
                <div style={{ marginLeft: 10 }}>削除 </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="content">
          <div onClick={() => handleDetailEvent()} className="swipableItem">
            <div className="swipableItemInner">
              <div className="swipableItemInnerDiv"></div>
              <div className="past-event-time">
                {/* format date time by japanese */}
                <span>
                  {moment(
                    event?.calendars && event?.calendars[0]?.start_time,
                  ).format('MMMM Do (dd) HH:mm')}
                </span>
                <span>～</span>
                <span>
                  {moment(event?.calendars && event?.calendars[0]?.start_time)
                    .add(getStep(event), 'minutes')
                    .format('HH:mm')}
                </span>
              </div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex1">イベント名</div>
              <div className="flex1">: {event && event?.name}</div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex1">参加者</div>
              <div className="flex1">
                : {voteUser?.map(item => item.name).join(', ')}
              </div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex1">{formatMessage({ id: 'i18n_memo' })}</div>
              <div className="flex1">
                : {event && event?.calendar_create_comment}
              </div>
            </div>
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
