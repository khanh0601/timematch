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
      <AdjustmentList
        height={calculateSwipeableListHeight(100)}
        renderItem={(item, index) => (
          <SwipableItem
            blockSwipe={props.blockSwipe}
            index={index}
            item={item}
            onDelete={handleDelete}
          >
            <div className="swipableItem">
              <div onClick={() => handleEventDetail(item)}>
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
                {item && item.user_id !== profile?.id && (
                  <div className="flexSpaceBetween">
                    <div className="flex-0-5">
                      {formatMessage({ id: 'i18n_label_event_created' })}
                    </div>
                    <div>:</div>
                    <div className="flex1">
                      {item && item.isVoted
                        ? formatMessage({ id: 'i18n_label_user_voted' })
                        : formatMessage({ id: 'i18n_label_user_not_voted' })}
                    </div>
                  </div>
                )}
                <div className="flexSpaceBetween">
                  <div className="flex-0-5">回答人数</div>
                  <div>:</div>
                  <div className="flex1">
                    {item && item.vote?.voters
                      ? Object.keys(item.vote.voters).length
                      : 0}
                  </div>
                </div>
              </div>
              {item && item.user_id === profile?.id && (
                <div className="flexSpaceBetween">
                  <button
                    onClick={() => handleCopyURLToClipboard(item, index)}
                    className="textLightGray bgPrimaryBlue borderPrimaryBlue rounded shadowPrimary mt-2 px-2 py-1"
                  >
                    {isURLCopy && isURLCopy.status && isURLCopy.index === index
                      ? formatMessage({ id: 'i18n_copied' })
                      : formatMessage({ id: 'i18n_copy_url_btn' })}
                  </button>
                  <button
                    onClick={() => handleCopyTemplateToClipboard(item, index)}
                    className="textLightGray bgPrimaryBlue borderPrimaryBlue rounded shadowPrimary mt-2 px-2 py-1"
                  >
                    {isTemplateCopy &&
                    isTemplateCopy.status &&
                    isTemplateCopy.index === index
                      ? formatMessage({ id: 'i18n_copied' })
                      : formatMessage({ id: 'i18n_share_fixed_text_title' })}
                  </button>
                  <button
                    onClick={() =>
                      history.push(
                        `${ROUTER.inviteParticipant}?event_code=${item?.event_code}`,
                      )
                    }
                    className="textLightGray bgPrimaryBlue borderPrimaryBlue rounded shadowPrimary mt-2 px-2 py-1"
                  >
                    {formatMessage({ id: 'i18n_share_via_email' })}
                  </button>
                </div>
              )}
              {isPc && item?.user_id !== profile?.id && (
                <div style={{ height: 16 }}></div>
              )}
            </div>
          </SwipableItem>
        )}
        data={adjustingEvents?.data}
      />
    </Spin>
  );
};

export default connect(({ CALENDAR, TAB, EVENT }) => ({
  calendarStore: CALENDAR,
  tabStore: TAB,
  eventStore: EVENT,
}))(UpComingEvent);
