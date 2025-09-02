import React, { useEffect, useMemo } from 'react';
import AdjustmentList from '@/pages/Top/AdjustmentList';
import SwipableItem from '@/components/SwipableItem';
import { connect } from 'dva';
import { message, Modal, Spin } from 'antd';
import moment from 'moment';
import { getStep } from '@/commons/function.js';
import { history, useIntl } from 'umi';
import '../styles.less';
import { profileFromStorage } from '@/commons/function';
import useIsPc from '@/hooks/useIsPc';

const PastEvent = props => {
  const { dispatch, tabStore, onDataEvent } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const { adjustedEvents, tabLoading } = tabStore;
  const profile = profileFromStorage();

  const isPc = useIsPc();

  const confirm = Modal.confirm;

  const payload = {
    user_id_of_member: profile?.id,
    relationship_type: 3,
    is_finished: 1,
  };

  const getList = () => {
    dispatch({
      type: 'TAB/getOnePaginateAdjustedEventsMember',
      payload,
    });
  };

  useEffect(() => {
    if (window.location.search === '?tab=2') getList();
    if (history.location.state?.event_id) {
      handleDelete(history.location.state?.event_id);
    }
  }, []);

  useEffect(() => {
    if (adjustedEvents?.data?.length > 0) {
      onDataEvent(true);
    }
  }, [adjustedEvents]);

  const handleDelete = id => {
    // remove id from adjustingEvents list and update the state
    const newAdjustedEvents = adjustedEvents?.data.filter(
      event => event.id !== id,
    );
    dispatch({
      type: 'TAB/setAdjustedEvents',
      payload: {
        data: newAdjustedEvents,
      },
    });

    if (isPc) {
      message.success('データを削除しました。');
    }
  };

  const handleDeletePc = id => e => {
    e.stopPropagation();

    confirm({
      title: formatMessage({ id: 'i18_delete_event_title' }),
      okText: formatMessage({ id: 'i18n_confirm_delete' }),
      okType: 'danger',
      cancelText: formatMessage({ id: 'i18n_cancel_delete' }),
      onOk() {
        dispatch({
          type: 'EVENT/deleteEventType',
          payload: {
            eventTypeId: id,
          },
          callback: () => {
            handleDelete(id);
          },
        });
        if (window.location.pathname !== '/') {
          history.go(-1);
        }
      },
      onCancel() {},
    });
  };

  const handleEventDetail = item => {
    const fullUrl = item?.vote?.full_url?.split('=')[
      item?.vote?.full_url?.split('=')?.length - 1
    ];

    if (props.onClickDetail) {
      props.onClickDetail({
        eventName: fullUrl,
        eventId: item.vote.slug,
        chooseSchedule: 'true',
        role: 'false',
      });
      return;
    }

    history.push(
      `/past-appointment/${item?.id}?id=${
        item.vote.slug
      }&name=${fullUrl}&chooseSchedule=true&role=${false}`,
    );
  };

  const calculateSwipeableListHeight = h => {
    const headerHeight = h;
    const footerHeight = 50;
    const windowHeight = window.innerHeight;

    return windowHeight - headerHeight - footerHeight;
  };

  // console.log(adjustedEvents?.data);

  const listEvents = useMemo(() => {
    const data = adjustedEvents?.data || [];
    return [...data].sort((a, b) => {
      const timeA = new Date(
        a?.calendars?.[0]?.start_time?.replace(' ', 'T') || 0,
      );
      const timeB = new Date(
        b?.calendars?.[0]?.start_time?.replace(' ', 'T') || 0,
      );
      return timeB - timeA;
    });
  }, [adjustedEvents?.data]);
  // console.log('listEvents: ', listEvents);

  return (
    <Spin spinning={tabLoading}>
      <AdjustmentList
        height={calculateSwipeableListHeight(150)}
        renderItem={(item, index) => (
          <SwipableItem
            blockSwipe={props.blockSwipe}
            index={index}
            item={item}
            onDelete={handleDelete}
          >
            <div
              onClick={() => handleEventDetail(item)}
              className="swipableItem swipableItemPast"
              data-current-time={moment(item?.calendars[0]?.start_time).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            >
              <div className="swipableItemInner">
                <div className="swipableItemInnerDiv"></div>
                <div className="past-event-time">
                  {/* format date time by japanese */}
                  <span>
                    {moment(item?.calendars[0]?.start_time).format(
                      'MMMM Do (dd) HH:mm',
                    )}
                  </span>
                  <span>～</span>
                  <span>
                    {moment(item?.calendars[0]?.start_time)
                      .add(getStep(item), 'minutes')
                      .format('HH:mm')}
                  </span>

                  {isPc && (
                    <img
                      onClick={handleDeletePc(item.id)}
                      width="24"
                      src={require('@/assets/images/pc/trash.png')}
                      alt={'del'}
                      className="ic-trash"
                    />
                  )}
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex-0-5">イベント名</div>
                <div>:</div>
                <div
                  style={{
                    wordBreak: 'break-word',
                  }}
                  className="flex1 event-name"
                >
                  {item && item?.name}
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex-0-5">
                  {formatMessage({ id: 'i18n_vote_owner' })}
                </div>
                <div>:</div>
                <div className="flex1">
                  {item && item.user_id === profile?.id
                    ? formatMessage({ id: 'i18n_label_event_created_by_me' })
                    : `${item?.user?.name} ${formatMessage({
                        id: 'i18n_label_event_created_by_other',
                      })}`}
                </div>
              </div>
              {/*<div className="flexSpaceBetween">*/}
              {/*  <div className="flex-0-5">*/}
              {/*    {formatMessage({ id: 'i18n_memo' })}*/}
              {/*  </div>*/}
              {/*  <div>:</div>*/}
              {/*  <div className="flex1">*/}
              {/*    {item && item?.calendars[0]?.calendar_create_comment}*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </SwipableItem>
        )}
        data={listEvents}
      />
    </Spin>
  );
};

export default connect(({ CALENDAR, TAB }) => ({
  calendarStore: CALENDAR,
  tabStore: TAB,
}))(PastEvent);
