import React, { useEffect, useState } from 'react';
import AdjustmentList from '@/pages/Top/AdjustmentList';
import SwipableItem from '@/components/SwipableItem';
import { connect } from 'dva';
import { message, Modal, Spin } from 'antd';
import { history, useIntl } from 'umi';
import { profileFromStorage } from '@/commons/function';
import { ROUTER } from '@/constant';
import moment from 'moment';
import useIsPc from '@/hooks/useIsPc';
import EventBus, { EventBusNames } from '@/util/eventBus';

const UpComingEvent = props => {
  const { dispatch, tabStore, eventStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const { adjustingEvents, tabLoading } = tabStore;
  const { listTextAskCalendar } = eventStore;
  const {
    text_ask_calendar_bottom,
    text_ask_calendar_top,
  } = listTextAskCalendar;
  const profile = profileFromStorage();
  const [isTemplateCopy, setIsTemplateCopy] = useState({
    status: false,
    index: 0,
  });
  const [isURLCopy, setIsURLCopy] = useState({ status: false, index: 0 });
  const isPc = useIsPc();

  const payload = {
    user_id_of_member: profile?.id,
    relationship_type: 3,
    is_finished: 0,
  };

  const confirm = Modal.confirm;

  const getList = () => {
    dispatch({
      type: 'TAB/getOnePaginateAdjustingEventsMember',
      payload,
    });
  };

  // useEffect(() => {
  //   EventBus.addEventListener(EventBusNames.DELETE_EVENT, e => {
  //     const payload = e.detail;
  //     console.log('payload: ', payload);
  //     console.log('adjustingEvents: ', adjustingEvents);
  //     const newAdjustingEvents = adjustingEvents?.data?.filter(
  //       event => event.id !== payload.eventTypeId,
  //     );
  //     console.log('newAdjustingEvents: ', newAdjustingEvents);
  //     dispatch({
  //       type: 'TAB/setAdjustingEvents',
  //       payload: {
  //         data: newAdjustingEvents,
  //       },
  //     });
  //   });
  // }, []);

  useEffect(() => {
    // Get template email from setting the user
    dispatch({ type: 'EVENT/getNotifyAskCalendar' });
    if (window.location.search === '') getList();
    if (history.location.state?.event_id) {
      handleDelete(history.location.state?.event_id);
    }
  }, []);

  const handleDelete = id => {
    // remove id from adjustingEvents list and update the state
    const newAdjustingEvents = adjustingEvents?.data?.filter(
      event => event.id !== id,
    );
    dispatch({
      type: 'TAB/setAdjustingEvents',
      payload: {
        data: newAdjustingEvents,
      },
    });

    if (isPc) {
      message.success('データを削除しました。');

      history.replace({
        ...history.location,
        state: {
          ...history.location.state,
          event_id: undefined,
        },
      });
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
        } else {
          props.onClose?.();
        }
      },
      onCancel() {},
    });
  };

  const handleEventDetail = item => {
    console.log('item: ', item);
    const fullUrl = item?.vote?.full_url?.split('=')[
      item?.vote?.full_url?.split('=')?.length - 1
    ];

    if (props.onClickDetail && item?.user_id === profile?.id) {
      const eventName =
        item?.user_id !== profile?.id
          ? item.vote.full_url.split('=')[
              item.vote.full_url.split('=').length - 1
            ]
          : fullUrl;

      props.onClickDetail({
        eventName,
        eventId: item.vote.slug,
      });
      return;
    }

    item?.user_id !== profile?.id
      ? history.push(
          `/appointment-selection?id=${item.vote.slug}&name=${
            item.vote.full_url.split('=')[
              item.vote.full_url.split('=').length - 1
            ]
          }`,
        )
      : history.push(
          `/appointment/${item?.id}?id=${
            item.vote.slug
          }&name=${fullUrl}&chooseSchedule=true&role=${false}`,
        );
  };

  const renderMailTemplate = item => {
    const templateMail = `
${text_ask_calendar_top}
--------------------------
■候補日時
${item?.event_datetimes
  .map(
    time =>
      `${moment(time.start_time).format('YYYY年MM月DD日(ddd) HH:mm')}~${moment(
        time.end_time,
      ).format('HH:mm')}`,
  )
  .join('\n')}
■ イベント名： ${item?.name}
■ご予約方法
下記URLからご予約いただくか、ご都合の良い日時をご連絡ください。
${Object.keys(item.vote).length > 0 ? item.vote.full_url : ''}

※最新もしくはその他の日時も上記URLからご確認いただくことができ、ご予約も可能です。
--------------------------
${text_ask_calendar_bottom}`;
    navigator.clipboard.writeText(templateMail);
  };

  const handleCopyTemplateToClipboard = async (item, index) => {
    await renderMailTemplate(item);
    setIsTemplateCopy({ status: true, index });
  };

  const handleCopyURLToClipboard = (item, index) => {
    navigator.clipboard.writeText(
      Object.keys(item).length > 0 && Object.keys(item.vote).length > 0
        ? item.vote.full_url
        : '',
    );
    setIsURLCopy({ status: true, index });
  };

  const calculateSwipeableListHeight = h => {
    const headerHeight = h;
    const footerHeight = 50;
    const windowHeight = window.innerHeight;

    return windowHeight - headerHeight - footerHeight;
  };

  return (
    <Spin spinning={tabLoading}>
      <div className="upcomming_wrap">
        {adjustingEvents?.data.length > 0 ? (
          <div>
            <div className="upcomming_head upcomming_grid">
              {isPc && <div className="upcomming_head_item">No</div>}
              <div className="upcomming_head_item">作成日</div>
              <div className="upcomming_head_item">イベント名</div>
              {isPc && <div className="upcomming_head_item">主崔者</div>}
              {isPc && <div className="upcomming_head_item">回答人数</div>}
              <div className="upcomming_head_item"></div>
            </div>
            <AdjustmentList
              renderItem={(item, index) => (
                <SwipableItem
                  blockSwipe={props.blockSwipe}
                  index={index}
                  item={item}
                  onDelete={handleDelete}
                >
                  <div
                    className="swipableItem upcomming_grid"
                    data-current-time={moment(item?.vote?.created_at).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )}
                  >
                    {isPc && (
                      <div className="">
                        {index < 9 ? `0${index + 1}` : index + 1}
                      </div>
                    )}
                    <div className="">
                      {moment(item?.vote?.created_at).format('YYYY-MM-DD')}
                    </div>
                    <div>
                      <div className=" event-name">{item && item?.name}</div>
                    </div>
                    {isPc && (
                      <div>
                        <div>
                          {item && item.user_id === profile?.id
                            ? formatMessage({
                                id: 'i18n_label_event_created_by_me',
                              })
                            : `${item?.user?.name} ${formatMessage({
                                id: 'i18n_label_event_created_by_other',
                              })}`}
                        </div>
                      </div>
                    )}
                    {isPc && (
                      <div>
                        <div>
                          {item && item.vote?.voters
                            ? Object.keys(item.vote.voters).length
                            : 0}
                        </div>
                      </div>
                    )}
                    <div
                      className="viewmore"
                      onClick={() => handleEventDetail(item)}
                    >
                      {isPc ? '詳細を見る' : '詳細'}
                    </div>
                    {isPc && item?.user_id !== profile?.id && (
                      <div style={{ height: 16 }}></div>
                    )}
                  </div>
                </SwipableItem>
              )}
              data={adjustingEvents?.data}
            />
          </div>
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

export default connect(({ CALENDAR, TAB, EVENT }) => ({
  calendarStore: CALENDAR,
  tabStore: TAB,
  eventStore: EVENT,
}))(UpComingEvent);
