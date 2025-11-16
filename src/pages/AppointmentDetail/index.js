import BubbleChatIcon from './icon/BubbleChatIcon';
import './styles.less';
import { connect } from 'dva';
import { useState, useLayoutEffect, useEffect } from 'react';
import { withRouter } from 'umi';
import { HOUR_FORMAT, ROUTER } from '@/constant';
import moment from 'moment';
import { personalExpiredModal } from '@/commons/function';
import { TYPE_VOTE_RELATIONSHIP } from '@/constant';
import iconReturn from '@/assets/images/return.png';
import {
  Button,
  Modal,
  message,
  Table,
  Tooltip as AntTooltip,
  Spin,
} from 'antd';
import { history, useIntl } from 'umi';
import { CloseOutlined } from '@ant-design/icons';
import {
  profileFromStorage,
  createTimeAsync,
  tz,
  getJPMonthAndDay,
} from '@/commons/function';
import { useCallback } from 'react';
import useIsPc from '@/hooks/useIsPc';
import useIsMobile from '@/hooks/useIsMobile';
import Tooltip from '@/components/PC/Tooltip';

const AppointmentDetail = props => {
  const { dispatch, voteStore, location, eventStore } = props;
  const confirm = Modal.confirm;
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [comment, setComment] = useState('');
  const isMobile = useIsMobile();
  const profile = profileFromStorage();
  const formatMessage = useIntl().formatMessage;
  const {
    informationVote,
    voteUser,
    eventDateTimeUser,
    sendEmailLoading,
    voteLoading,
  } = voteStore;
  const [isLandScape, setIsLandScape] = useState(false);
  const [isShowModal, setIsShowModal] = useState({
    deleteTeam: false,
    deleteEventVote: false,
    cloneEventVoted: false,
  });
  const [idEventDateTime, setIdEventDateTime] = useState('');

  const eventId = props.eventId || location.query.id;
  const isShowButtons =
    informationVote && informationVote?.vote?.slug === eventId;
  const eventName = props.eventName || location.query.name;
  const isPc = useIsPc();

  useLayoutEffect(() => {
    setIsLandScape(
      !isPc && (window.orientation === 90 || window.orientation === -90),
    );
  }, []);

  useEffect(() => {
    window.addEventListener(
      'orientationchange',
      function() {
        setIsLandScape(
          !isPc && (window.orientation === 90 || window.orientation === -90),
        );
      },
      false,
    );
  }, []);

  const handleSubmitOK = async (force = false) => {
    const payload = {
      vote: eventId,
      user: profile.code,
      event_datetime: idEventDateTime,
      time_zone: tz(),
      force,
    };
    const res = await dispatch({ type: 'VOTE/postUserVote', payload });
    if (res) {
      history.push(isPc ? '/pc/calendar' : '/calendar');
    }
  };

  const getData = async () => {
    const payloadShow = {
      id: eventId,
    };
    if (eventName) {
      payloadShow.name = eventName;
    }
    await dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });
  };

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
    getData();
  }, []);

  const IsAll = () => {
    return (
      (location.query.member_all || location.query.team_all) && listPaginateTeam
    );
  };

  const IsIndividual = () => {
    return (
      !location.query.member_all && !location.query.team_all && paginateEvents
    );
  };

  const scrollToSave = useCallback(() => {
    var my_element = document.getElementById('save-btn');
    my_element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }, []);

  const editEvent = () => {
    let path = isPc ? '/pc/create-calendar' : '/create-calendar';
    history.push(
      `${path}?idEvent=${informationVote?.id}&edit=true&relationship_type=${TYPE_VOTE_RELATIONSHIP}&member_id=${informationVote?.user_id}`,
    );
  };

  const cloneEvent = item => {
    if (checkUserExpired(item?.has_member_expired)) {
      return;
    }
    let path = isPc ? '/pc/create-calendar' : '/create-calendar';
    history.push(
      `${path}?idEvent=${informationVote?.id}&clone=1&relationship_type=${TYPE_VOTE_RELATIONSHIP}&member_id=${informationVote?.user_id}`,
    );
  };

  const checkUserExpired = member_expired => {
    const { team_all, team_id } = location.query;
    let prevent;
    if (team_all || team_id) {
      if (isExpired() || member_expired) {
        personalExpiredModal();
        prevent = true;
      }
    }
    return prevent;
  };

  const showModal = () => {
    const eventId = informationVote?.id;
    const payload = {
      eventTypeId: eventId,
    };

    confirm({
      title: formatMessage({ id: 'i18_delete_event_title' }),
      okText: formatMessage({ id: 'i18n_confirm_delete' }),
      okType: 'danger',
      cancelText: formatMessage({ id: 'i18n_cancel_delete' }),
      onOk() {
        if (props.onClose) {
          dispatch({
            type: 'EVENT/deleteEventType',
            payload: {
              eventTypeId: eventId,
            },
            callback: () => {
              setTimeout(() => {
                props.onClose();
                message.success('データを削除しました。');
                props.onRefresh?.(payload);
              }, 1000);
            },
          });
        } else {
          dispatch({ type: 'EVENT/deleteEventType', payload });
          history.push('/', { event_id: eventId });
        }
      },
      onCancel() {},
    });
  };

  const info = (message, user) => {
    Modal.info({
      title: `${user}様から送信されたメッセージ`,
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() {},
      maskClosable: true,
    });
  };

  async function handleOk() {
    setIsShowModal({
      deleteTeam: false,
      deleteEventVote: false,
      cloneEventVoted: false,
    });
    await dispatch({ type: 'TAB/setLoading', payload: true });
    if (informationVote?.vote?.teamSlug) {
      await dispatch({
        type: 'TAB/deletePaginateTeam',
        payload: { team_id: teamID },
      });
      const payload = {
        page: pageIndex,
      };
      if (location.query.team_id) {
        history.push({ pathname: '/', search: '?team_all=true' });
        await dispatch({ type: 'TEAM/getTeam' });
      } else {
        await dispatch({ type: 'TAB/getPaginateTeam', payload });
        await dispatch({ type: 'TEAM/getTeam' });
      }

      await dispatch({ type: 'TAB/setLoading', payload: false });
      return;
    }
    const payload = {
      eventTypeId: informationVote?.id,
    };
    await dispatch({ type: 'EVENT/deleteEventType', payload });

    await dispatch({ type: 'TAB/setLoading', payload: false });

    if (props.onClose) {
      props.onClose();
      props.onRefresh?.(payload);
    } else {
      history.go(-1);
    }
  }

  const handlePastEvent = start_time => {
    const now = moment();
    return moment(start_time).isBefore(now);
  };

  const bgTypeChoice = item => {
    return item.choices.length > 0 &&
      item.choices.every(choice => choice?.option === 1)
      ? '#b2cbf7'
      : item.choices.length > 0 &&
        item.choices.every(choice => choice.option === 2 || choice.option === 3)
      ? '#ebebeb'
      : '#ffffff';
  };

  const bgTypeChoiceClass = item => {
    if (
      item.choices.length > 0 &&
      item.choices.every(choice => choice?.option === 1)
    ) {
      return 'bgLightBlue';
    } else if (
      item.choices.length > 0 &&
      item.choices.every(choice => choice.option === 2 || choice.option === 3)
    ) {
      return 'bgLightGray';
    }
    return 'bgWhite';
  };

  const getOffset = el => {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
    };
  };

  const handleMouseEnter = (comment, event) => {
    if (!isPc) return;
    const offset = getOffset(event.currentTarget);
    setTooltipPos({
      x: offset.left + event.currentTarget.offsetWidth / 2,
      y: offset.top - 8, // trừ để hiển thị tooltip phía trên
    });
    setComment(comment);
  };

  const handleMouseLeave = () => {
    setComment('');
  };
  const { listTextAskCalendar } = eventStore;
  const {
    text_ask_calendar_bottom,
    text_ask_calendar_top,
  } = listTextAskCalendar;
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
  const [isTemplateCopy, setIsTemplateCopy] = useState({
    status: false,
    index: 0,
  });
  const [isURLCopy, setIsURLCopy] = useState({ status: false, index: 0 });
  const handleCopyTemplateToClipboard = async (item, index) => {
    await renderMailTemplate(item);
    setIsTemplateCopy({ status: true, index });
  };

  const handleCopyURLToClipboard = (item, index) => {
    const url =
      Object.keys(item).length > 0 && Object.keys(item.vote).length > 0
        ? item.vote.full_url
        : '';

    navigator.clipboard.writeText(url);
    setIsURLCopy({ status: true, index });
  };

  const columns = [
    {
      title: '日程確定選択',
      dataIndex: 'dateTime',
      key: 'dateTime',
      fixed: 'left',
      width: 110,
      render: (_, record) => (
        <>
          <span className={handlePastEvent(record.start_time) ? 'is_past' : ''}>
            {moment(record.start_time).format('YYYY/MM/DD')}
            {moment(record.start_time).format('(dd)')}
            <br />
            {moment(record.start_time).format(HOUR_FORMAT)}~
            {moment(record.end_time).format(HOUR_FORMAT)}
          </span>
        </>
      ),
    },
    {
      title: 'OK',
      dataIndex: 'ok',
      key: 'ok',
      fixed: 'left',
      width: 40,
      render: (_, record) =>
        record.choices.filter(choice => choice.option === 1).length,
    },
    {
      title: 'NG',
      dataIndex: 'ng',
      key: 'ng',
      fixed: 'left',
      width: 40,
      render: (_, record) =>
        record.choices.filter(
          choice => choice.option === 2 || choice.option === 3,
        ).length,
    },
    ...voteUser.map(voter => ({
      title: () => (
        <AntTooltip title={voter.name}>
          <div className="px-2 truncate">{voter.name}</div>
        </AntTooltip>
      ),
      dataIndex: voter.id,
      key: voter.id,
      width: 60,
      render: (_, record) => {
        // check choice oke will add class is_oke
        // check choice ng will add class is_ng
        const choice = record.choices.find(c => c.voter_id === voter.id);
        if (choice) {
          if (choice.option === 1) {
            return <div className="choice_oke">OK</div>;
          }
          if (choice.option === 2 || choice.option === 3) {
            return <div className="choice_ng">NG</div>;
          }
        }
        return '';
      },
    })),
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: 70,
      render: (_, record) => {
        if (moment().isAfter(moment(record.start_time))) {
          return 'NG';
        }
        return record.choices.every(choice => choice?.option === 2) ? (
          <Button
            className={`my-2 px-1 py-0 h-full rounded btnConfirm `}
            disabled={true}
          >
            確定{' '}
          </Button>
        ) : (
          <Button
            onClick={() => {
              setIdEventDateTime(record.id);
              scrollToSave();
            }}
            className={`px-1 btnConfirm py-0 h-full bgWhite textPrimaryBlue rounded shadowSecondary borderPrimaryBlue ${
              record.id === idEventDateTime
                ? 'bgPrimaryBlue textLightGray borderPrimaryLight'
                : ''
            }`}
            disabled={handlePastEvent(record.start_time)}
          >
            確定{' '}
          </Button>
        );
      },
    },
  ];

  const columnLandScape = [
    {
      title: ' ',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 100,
      render: text => (
        <div className="px-2 py-2 truncate" style={{ width: 100 }}>
          {text}
        </div>
      ),
    },
    ...eventDateTimeUser.map((event, index) => ({
      title: () => (
        <div className={'textLightGray px-2 py-2'}>
          {getJPMonthAndDay(event.start_time)}(
          {moment(event.start_time).format('dd')})<br />
          {moment(event.start_time).format(HOUR_FORMAT)} ~{' '}
          {moment(event.end_time).format(HOUR_FORMAT)}
        </div>
      ),
      dataIndex: `event${index}`,
      key: `event${index}`,
      render: (text, record) => {
        if (record.key === 'buttons') {
          return event.choices.every(choice => choice?.option === 2) ? (
            <Button
              className={`my-2 px-1 py-0 h-full rounded shadowSecondary`}
              disabled={true}
            >
              確定{' '}
            </Button>
          ) : (
            <div
              className={'px-2 py-2'}
              style={{ background: bgTypeChoice(event) }}
            >
              <Button
                onClick={() => {
                  setIdEventDateTime(event.id);
                  scrollToSave();
                }}
                className={`px-1 py-0 h-full bgWhite textPrimaryBlue rounded shadowSecondary borderPrimaryBlue ${
                  event.id === idEventDateTime
                    ? 'bgPrimaryBlue textLightGray borderPrimaryLight'
                    : ''
                }`}
                disabled={handlePastEvent(event.start_time)}
              >
                確定{' '}
              </Button>
            </div>
          );
        }
        if (record.name === 'OK' || record.name === 'NG') {
          return (
            <div
              className={'px-2 py-2'}
              style={{ background: bgTypeChoice(event), textAlign: 'center' }}
            >
              {text}
            </div>
          );
        }
        const choice = event.choices.find(c => c.voter_id === record.key);
        return (
          <div
            className={'px-2 py-2'}
            style={{ background: bgTypeChoice(event), textAlign: 'center' }}
          >
            {choice ? (choice.option === 1 ? '○' : '×') : ''}
          </div>
        );
      },
    })),
    {
      title: 'コメント',
      key: 'comment',
      render: (_, record) =>
        record.comment && (
          <BubbleChatIcon onClick={() => info(record.comment, record.name)} />
        ),
    },
  ];

  const dataLandScape = [
    {
      key: 'OK',
      name: 'OK',
      ...eventDateTimeUser.reduce(
        (acc, event, index) => ({
          ...acc,
          [`event${index}`]: event.choices.filter(choice => choice.option === 1)
            .length,
        }),
        {},
      ),
    },
    {
      key: 'NG',
      name: 'NG',
      ...eventDateTimeUser.reduce(
        (acc, event, index) => ({
          ...acc,
          [`event${index}`]: event.choices.filter(
            choice => choice.option === 2 || choice.option === 3,
          ).length,
        }),
        {},
      ),
    },
    ...voteUser.map(voter => ({
      key: voter.id,
      name: voter.name,
      comment: voter.comment,
      ...eventDateTimeUser.reduce(
        (acc, event, index) => ({
          ...acc,
          [`event${index}`]: event.choices.find(c => c.voter_id === voter.id)
            ?.option,
        }),
        {},
      ),
    })),
    {
      key: 'buttons',
      name: '',
      ...eventDateTimeUser.reduce(
        (acc, event, index) => ({
          ...acc,
          [`event${index}`]: 'button',
        }),
        {},
      ),
    },
  ];

  return (
    <div className="appointment-detail">
      <div className="header">
        {isMobile && (
          <div
            className="header-back"
            onClick={() => (props.onClose ? props.onClose() : history.go(-1))}
          >
            <img src={iconReturn} alt="return" />
          </div>
        )}
        <div className="header-title">
          <span className="header-name">{informationVote?.name}</span>
          {console.log('vote', informationVote)}
        </div>
        {!isMobile && (
          <div
            className={`header-close `}
            style={{
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onClick={() => (props.onClose ? props.onClose() : history.go(-1))}
          >
            <CloseOutlined style={{ color: '#0F63AA' }} />
          </div>
        )}
      </div>
      <div className="apd-content-wrapper">
        <div style={{ padding: 10 }}>
          {informationVote?.calendar_create_comment ?? ''}
        </div>
        <div className="content">
          {isLandScape ? (
            <Table
              className={'table-landscape'}
              columns={columnLandScape}
              dataSource={dataLandScape}
              pagination={false}
              scroll={{ x: 'max-content' }}
              loading={voteLoading}
              size="small"
              bordered
            />
          ) : (
            <Table
              className={'table-portrait'}
              columns={columns}
              dataSource={eventDateTimeUser}
              pagination={false}
              scroll={{ x: 'max-content', y: 400 }}
              loading={voteLoading}
              rowClassName={record => bgTypeChoiceClass(record)}
              // summary={() => (
              //   <Table.Summary fixed>
              //     <Table.Summary.Row>
              //       <Table.Summary.Cell index={0} colSpan={3}>
              //         コメント
              //       </Table.Summary.Cell>
              //       {voteUser.map((item, index) => (
              //         <Table.Summary.Cell index={index + 3} key={item.id}>
              //           {item.comment && (
              //             <BubbleChatIcon
              //               onMouseEnter={e =>
              //                 handleMouseEnter(item.comment, e)
              //               }
              //               onMouseLeave={handleMouseLeave}
              //               onClick={() => info(item.comment, item.name)}
              //             />
              //           )}
              //         </Table.Summary.Cell>
              //       ))}
              //       <Table.Summary.Cell index={voteUser.length + 3} />
              //     </Table.Summary.Row>
              //   </Table.Summary>
              // )}
            />
          )}
          {!isShowButtons && isPc && (
            <Spin
              spinning
              size="large"
              style={{ position: 'absolute', left: '49%' }}
            ></Spin>
          )}
          {isShowButtons && (
            <div className="appointment-detail-footer">
              <div className="btnControl">
                <div
                  className="btnControlText"
                  onClick={() => handleCopyURLToClipboard(informationVote, 0)}
                >
                  {isURLCopy && isURLCopy.status && isURLCopy.index === 0
                    ? formatMessage({ id: 'i18n_copied' })
                    : formatMessage({ id: 'i18n_copy_url_btn' })}
                </div>
                <div
                  className="btnControlText"
                  onClick={() =>
                    handleCopyTemplateToClipboard(informationVote, 0)
                  }
                >
                  {isTemplateCopy &&
                  isTemplateCopy.status &&
                  isTemplateCopy.index === 0
                    ? formatMessage({ id: 'i18n_copied' })
                    : formatMessage({ id: 'i18n_share_fixed_text_title' })}
                </div>
                <div
                  className="btnControlText"
                  onClick={() =>
                    history.push(
                      `${ROUTER.inviteParticipant}?event_code=${informationVote?.event_code}`,
                    )
                  }
                >
                  メール招待
                </div>
              </div>
              <div className="btnSubmitItemWrap">
                <Button
                  loading={sendEmailLoading}
                  id="save-btn"
                  onClick={() => {
                    if (idEventDateTime === '') {
                      message.warning({
                        key: 'warning',
                        content: '日程を選択してください。',
                      });
                    } else {
                      handleSubmitOK();
                    }
                  }}
                  size="large"
                  // disabled={idEventDateTime === ''}
                  className="btnSubmitItem btnSubmitItemBlue"
                >
                  <div style={{ marginLeft: 10 }}>決定 </div>
                </Button>
                <Button
                  onClick={() => {
                    editEvent(informationVote);
                  }}
                  className="btnSubmitItem btnSubmitItemOutline"
                  size="large"
                >
                  <div style={{ marginLeft: 10 }}>再調整</div>
                </Button>
                <Button
                  onClick={() => {
                    showModal();
                  }}
                  className="btnSubmitItem btnSubmitItemRed"
                  size="large"
                >
                  <div style={{ marginLeft: 10 }}>削除 </div>
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="content-gap"></div>
      </div>
      <Modal open={isShowModal.deleteEventVote} closable={false} footer={null}>
        <div className="modalDelete">
          <div className="modalTitle">
            {formatMessage({ id: 'i18n_title_delete_event_type' })}
          </div>
          <div className="btnGroup">
            <Button
              onClick={() => {
                setIsShowModal({
                  deleteTeam: false,
                  deleteEventVote: false,
                  cloneEventVoted: false,
                });
              }}
              className="btn btnWhite"
            >
              {formatMessage({ id: 'i18n_cancel_delete' })}
            </Button>
            <Button onClick={() => handleOk()} className="btn btnGreen">
              {formatMessage({ id: 'i18n_confirm_delete_event' })}
            </Button>
          </div>
        </div>
      </Modal>

      {!!comment && (
        <Tooltip
          x={tooltipPos.x}
          y={tooltipPos.y}
          visible={!!comment}
          placement="top"
          maxWidth={450}
          textColor="#fff"
        >
          {comment}
        </Tooltip>
      )}
    </div>
  );
};

export default connect(({ EVENT, MASTER, VOTE }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  voteStore: VOTE,
}))(withRouter(AppointmentDetail));
