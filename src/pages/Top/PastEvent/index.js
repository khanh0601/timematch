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
      <div className="upcomming_wrap">
        {listEvents && listEvents.length > 0 ? (
          <>
            <div className="upcomming_head upcomming_grid">
              {isPc ? <div className="upcomming_head_item">No</div> : null}
              <div className="upcomming_head_item">作成日</div>
              <div className="upcomming_head_item">イベント名</div>
              {isPc ? <div className="upcomming_head_item">主崔者</div> : null}
              {isPc ? (
                <div className="upcomming_head_item">回答人数</div>
              ) : null}
              <div className="upcomming_head_item"></div>
            </div>
            <AdjustmentList
              // height={calculateSwipeableListHeight(150)}
              renderItem={(item, index) => (
                <SwipableItem
                  blockSwipe={props.blockSwipe}
                  index={index}
                  item={item}
                  onDelete={handleDelete}
                >
                  <div
                    onClick={() => handleEventDetail(item)}
                    className="swipableItem upcomming_grid swipableItemPast"
                    data-current-time={moment(item?.vote?.created_at).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )}
                  >
                    {isPc ? (
                      <div>{index < 9 ? `0${index + 1}` : index + 1}</div>
                    ) : null}

                    <div>
                      <span>
                        {moment(item?.vote?.created_at).format('YYYY-MM-DD')}
                      </span>
                    </div>
                    <div className=" event-name">{item && item?.name}</div>
                    {isPc ? (
                      <div>
                        {item && item.user_id === profile?.id
                          ? formatMessage({
                              id: 'i18n_label_event_created_by_me',
                            })
                          : `${item?.user?.name} ${formatMessage({
                              id: 'i18n_label_event_created_by_other',
                            })}`}
                      </div>
                    ) : null}
                    {isPc ? (
                      <div>
                        <div>
                          {item && item.vote?.voters
                            ? Object.keys(item.vote.voters).length
                            : 0}
                        </div>
                      </div>
                    ) : null}
                    <div
                      className="viewmore"
                      onClick={() => handleEventDetail(item)}
                    >
                      {isPc ? '詳細を見る' : '詳細'}
                    </div>
                  </div>
                </SwipableItem>
              )}
              data={listEvents}
            />
          </>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">
              まだスケジュールが作成されていません。
              <br />
              「+予定を作成」ボタンから、新しいスケジュールを作成してみましょう。
            </p>
          </div>
        )}
      </div>
    </Spin>
  );
};

export default connect(({ CALENDAR, TAB }) => ({
  calendarStore: CALENDAR,
  tabStore: TAB,
}))(PastEvent);
