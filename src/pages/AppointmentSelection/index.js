import BubbleChatIcon from '@/pages/AppointmentDetail/icon/BubbleChatIcon';
import './styles.less';
import { connect } from 'dva';
import { useEffect, useMemo, useRef } from 'react';
import { withRouter } from 'umi';
import { HOUR_FORMAT } from '@/constant';
import {
  profileFromStorage,
  createTimeAsync,
  tz,
  getJPMonthAndDay,
  getCookie,
} from '@/commons/function';
import { Button, Input, Modal, Spin, Table, Tooltip } from 'antd';
import { useState, useLayoutEffect } from 'react';
import { history } from 'umi';
import moment from 'moment';
import AvailableTimeModal from './AvailableTimeModal';
import { useIntl } from 'umi';
import styles from '../AppointmentSelectionForm/styles.less';
import {
  CloseOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import FooterMobile from '@/components/Mobile/Footer';
import PCHeader from '@/components/PC/Header';
import useIsPc from '@/hooks/useIsPc';
import CalendarPreview from '../../components/PC/Calendar/CalendarPreview';
import BaseTooltip from '@/components/PC/Tooltip';

const AppointmentSelection = props => {
  const [openAvailableTimeModal, setOpenAvailableTimeModal] = useState(false);
  const { dispatch, voteStore, location } = props;
  const profile = profileFromStorage();
  const [isLandScape, setIsLandScape] = useState(false);
  const {
    eventDateTimeGuest,
    voteGuest,
    informationVote,
    voteLoading,
    informationUserVote,
  } = voteStore;
  const [toggleOkEvent, setToggleOkEvent] = useState(null);
  const [comment, setComment] = useState('');
  const intl = useIntl();
  const { formatMessage } = intl;
  const [events, setEvents] = useState({});
  const [isOkAll, setIsOkAll] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [commentTooltip, setCommentTooltip] = useState('');

  const isPc = useIsPc();
  const calendarRef = useRef(null);

  const eventId = props.eventId || location.query.id;
  const eventName = props.eventName || location.query.name;

  const eventVotes = useMemo(() => {
    if (!profile) return [];
    return events?.event_vote || [];
  }, [events]);

  const votedEvents = useMemo(() => {
    if (events?.is_voted) {
      const eventVotes = events?.event_vote || [];
      const eventDateTimes = events.event_datetimes || [];

      const voteEvents = eventDateTimes.filter(x => eventVotes.includes(x.id));

      return voteEvents;
    }
    return toggleOkEvent?.filter(event => event.isOk);
  }, [toggleOkEvent, events]);

  const votingEvents = useMemo(() => {
    if (!events?.event_datetimes) return [];
    const votingEvent = [];

    events.event_datetimes.forEach(item => {
      const existEvent = votedEvents?.find(
        event =>
          (event.id === item.id) & (event.start_time === item.start_time) &&
          event.end_time === item.end_time,
      );
      if (!existEvent || events.is_voted) {
        votingEvent.push({
          id: item.id,
          srcId: events.id,
          name: events.name,
          start_time: item.start_time,
          end_time: item.end_time,
          start: item.start_time,
          end: item.end_time,
          backgroundColor: '#FFFFFF',
          borderColor: '#3368C7',
          textColor: '#3368C7',
        });
      }
    });

    return votingEvent;
  }, [events]);

  const onCloseAvailableTimeModal = () => {
    setOpenAvailableTimeModal(false);
  };

  const onChangeComment = e => {
    setComment(e.target.value);
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
    setCommentTooltip(comment);
  };

  const handleMouseLeave = () => {
    setCommentTooltip('');
  };

  const getData = async () => {
    const profile = profileFromStorage();
    const payload = {
      vote: eventId,
      user_code: profile ? profile.code : '',
      type: 2, // screen B
    };
    const payloadShow = {
      id: eventId,
    };
    if (eventName) {
      payloadShow.name = eventName;
    } else if (location.query.invitee) {
      payloadShow.invitee = location.query.invitee;
    } else if (location.query.code) {
      payloadShow.code = location.query.code;
    }
    if (profile?.id && getCookie('token')) {
      await dispatch({ type: 'VOTE/getUserVoteShow', payload: payloadShow });
    } else {
      await dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });
    }
    const { startTime, endTime } = createTimeAsync();
    await dispatch({
      type: 'VOTE/getVoteGuestSummary',
      payload: {
        ...payload,
        start: startTime,
        end: endTime,
        timeZone: tz(),
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const events = eventDateTimeGuest.map(item => {
      return {
        ...item,
        id: item.id,
        isOk: false,
      };
    });
    setToggleOkEvent(events);
  }, [eventDateTimeGuest]);

  // useEffect(() => {
  //   if (profile?.code) {
  //     const payloadShow = {
  //       id: `お打合せ9`,
  //     };
  //     payloadShow.name = 'd3294fdb-65e7-4189-9891-5e3a90f8b1bf';
  //     dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });
  //   }
  // }, []);

  useLayoutEffect(() => {
    setIsLandScape(window.orientation === 90 || window.orientation === -90);
  }, []);

  useEffect(() => {
    window.addEventListener(
      'orientationchange',
      function() {
        setIsLandScape(window.orientation === 90 || window.orientation === -90);
      },
      false,
    );
  }, []);

  useEffect(() => {
    if (informationUserVote && profile?.id && getCookie('token')) {
      return setEvents(informationUserVote);
    }
    setEvents(informationVote);
  }, [informationVote, informationUserVote]);

  const handlePastTime = time => {
    return moment().isAfter(time);
  };

  const handleCheckAll = () => {
    if (profile?.id && events?.is_voted) return;
    const updatedEvents = toggleOkEvent?.map(event => {
      if (handlePastTime(event?.start_time)) {
        return {
          ...event,
          isOk: false,
        };
      }
      return event;
    });

    const validEvents = updatedEvents.filter(
      event => !handlePastTime(event.start_time),
    );

    const allEventsOk = validEvents.every(event => event.isOk);
    const noEventsOk = validEvents.every(event => !event.isOk);

    const updateEventsStatus = (status, isOkAll) => {
      validEvents.forEach(event => {
        event.isOk = status;
      });
      setIsOkAll(isOkAll);
    };

    if (isOkAll && noEventsOk) {
      updateEventsStatus(true, isOkAll);
    } else if (isOkAll && allEventsOk) {
      updateEventsStatus(false, false);
    } else if (!isOkAll && noEventsOk) {
      updateEventsStatus(true, true);
    } else {
      updateEventsStatus(false, false);
    }

    setToggleOkEvent([...updatedEvents]);
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
    const isExpired = handlePastTime(item.start_time);
    const isOke =
      toggleOkEvent &&
      toggleOkEvent.find(toggle => item.id === toggle.id)?.isOk;

    if (isExpired) {
      return 'bgLightGray';
    }
    if (
      isOke ||
      (item.choices.length > 0 &&
        item.choices.every(choice => choice?.option === 1))
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

  const handleSingleEventToggle = eventId => {
    const newToggleOkEvent = toggleOkEvent.map(toggle => {
      if (toggle.id === eventId) {
        return { ...toggle, isOk: !toggle.isOk };
      }
      return toggle;
    });
    setToggleOkEvent(newToggleOkEvent);
  };

  const handleCheckEventClick = async () => {
    if (profile?.id && getCookie('token')) {
      const info = {
        name: profile?.name,
        confirm_email: profile?.name ?? null,
        company: profile?.company ?? null,
        role: profile?.company_role ?? null,
        comment: comment ?? null,
        guests: [],
      };

      const payload = {
        id: eventId,
        name: eventName || null,
        code: location.query.code || null,
        invitee: location.query.invitee || null,
        time_zone: tz(),
        choices: toggleOkEvent.map(item => ({
          event_datetime_id: item.id,
          option: item.isOk === true ? 1 : 2,
        })),
        information: { comment: comment },
      };
      const res = await dispatch({
        type: 'VOTE/postVoteUserConfirm',
        payload,
      });
      history.push(
        `/appointment-selection-completed?id=${eventId}&name=${eventName}`,
        {
          information: info,
          choices: toggleOkEvent.map(item => ({
            event_datetime_id: item.id,
            option: item.isOk === true ? 1 : 2,
            comment: location.state?.comment,
          })),
        },
      );
    } else {
      history.push(
        `/appointment-selection-form?id=${eventId}&name=${eventName}`,
        {
          choices: toggleOkEvent,
          comment: comment,
        },
      );
    }
  };

  const columns = [
    {
      title: '日程',
      dataIndex: 'dateTime',
      key: 'dateTime',
      fixed: 'left',
      width: 110,
      render: (_, record) => (
        <>
          {getJPMonthAndDay(record.start_time)}
          {moment(record.start_time).format('(dd)')}
          <br />
          {moment(record.start_time).format(HOUR_FORMAT)}~
          {moment(record.end_time).format(HOUR_FORMAT)}
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
    ...voteGuest.map(voter => ({
      title: () => (
        <Tooltip title={voter.name}>
          <div className="px-2 truncate">{voter.name}</div>
        </Tooltip>
      ),
      dataIndex: voter.id,
      key: voter.id,
      width: 100,
      render: (_, record) => {
        const choice = record.choices.find(c => c.voter_id === voter.id);
        return choice ? (choice.option === 1 ? '○' : '×') : '';
      },
    })),
    {
      title: () => (
        <Button
          style={{
            background: events?.is_voted ? '' : isOkAll ? '#3368c7' : '#a2a2a2',
            border: '1px solid #fff',
          }}
          className={`my-2 px-1 py-0 ${
            events?.is_voted ? '' : 'textLightGray'
          } rounded shadowSecondary`}
          onClick={handleCheckAll}
          disabled={events?.is_voted}
        >
          {isOkAll ? 'OK' : 'NG'}
        </Button>
      ),
      key: 'action',
      fixed: 'right',
      width: 70,
      render: (_, record) => {
        const isExpired = handlePastTime(record.start_time);

        if (isExpired) return null;

        const isOke =
          eventVotes?.includes(record.id) ||
          (toggleOkEvent &&
            toggleOkEvent.find(toggle => record.id === toggle.id)?.isOk);

        return (
          <Button
            onClick={() => {
              if (events?.is_voted) return;
              const newToggleOkEvent = toggleOkEvent.map(toggle =>
                toggle.id === record.id
                  ? { ...toggle, isOk: !toggle.isOk }
                  : toggle,
              );
              setToggleOkEvent(newToggleOkEvent);
            }}
            style={{
              background: events?.is_voted ? '' : isOke ? '#3368c7' : '#a2a2a2',
              border: '1px solid #fff',
            }}
            className={`px-1 py-0 h-full ${
              events?.is_voted ? '' : 'textLightGray'
            } rounded shadowSecondary ${!isOke ? 'is_ng' : ''}`}
            disabled={isExpired || events?.is_voted}
          >
            {isOke ? 'OK' : 'NG'}
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
    ...eventDateTimeGuest.map((event, index) => ({
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
          const toggleEvent = toggleOkEvent.find(
            toggle => toggle.id === event.id,
          );
          return (
            <div
              className={'px-2 py-2'}
              style={{ background: bgTypeChoice(event) }}
            >
              <Button
                onClick={() => handleSingleEventToggle(event.id)}
                style={{
                  background: events?.is_voted
                    ? ''
                    : toggleEvent?.isOk
                    ? '#3368c7'
                    : '#a2a2a2',
                  border: '1px solid #fff',
                }}
                className={`px-1 py-0 h-full ${
                  events?.is_voted ? '' : 'textLightGray'
                } rounded shadowSecondary`}
                disabled={handlePastTime(event.start_time) || events?.is_voted}
              >
                {toggleEvent?.isOk ? 'OK' : 'NG'}
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
      ...eventDateTimeGuest.reduce(
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
      ...eventDateTimeGuest.reduce(
        (acc, event, index) => ({
          ...acc,
          [`event${index}`]: event.choices.filter(
            choice => choice.option === 2 || choice.option === 3,
          ).length,
        }),
        {},
      ),
    },
    ...voteGuest.map(voter => ({
      key: voter.id,
      name: voter.name,
      comment: voter.comment,
      ...eventDateTimeGuest.reduce(
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
      name: (
        <Button
          onClick={() => handleCheckAll()}
          style={{
            background: events?.is_voted ? '' : isOkAll ? '#3368c7' : '#a2a2a2',
            border: '1px solid #fff',
          }}
          className={`px-1 py-0 h-full ${
            events?.is_voted ? '' : 'textLightGray'
          } rounded shadowSecondary`}
          disabled={events?.is_voted}
        >
          {isOkAll ? 'OK' : 'NG'}
        </Button>
      ),
      ...eventDateTimeGuest.reduce(
        (acc, event, index) => ({
          ...acc,
          [`event${index}`]: 'button',
        }),
        {},
      ),
    },
  ];

  const handleToggleExpand = () => {
    setExpanded(prev => !prev);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.updateSize();
    }
  };

  const Arrow = expanded ? RightCircleOutlined : LeftCircleOutlined;

  return (
    <div className="appointment-selection-container">
      {isPc && <PCHeader />}
      <div
        className={`appointment-selection-wrapper ${
          profile?.id ? 'logged-in' : ''
        } ${expanded ? 'expanded' : ''}`}
      >
        <div className="appointment-selection">
          {isPc && profile?.id ? (
            <div className="header-pc">
              <h2>日程調整</h2>
              <div className="header-event">
                <span>イベント名</span>
                <div>{events?.name}</div>
              </div>
            </div>
          ) : (
            <div className="header">
              <div className="header-left">
                <div className="header-line"></div>
                <div className="header-title">{events?.name}</div>
              </div>
              {profile?.id && (
                <div
                  className={`header-close bgDarkBlue shadowPrimary`}
                  style={{
                    width: 30,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                  }}
                  onClick={() =>
                    props.onClose ? props.onClose() : history.go(-1)
                  }
                >
                  <CloseOutlined style={{ color: '#FFF' }} />
                </div>
              )}
            </div>
          )}
          <div className="aps-content-wrapper">
            {!!events?.calendar_create_comment && (
              <div style={{ padding: 10 }}>
                {events?.calendar_create_comment ?? ''}
              </div>
            )}
            <Spin spinning={voteLoading}>
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
                    dataSource={eventDateTimeGuest}
                    pagination={false}
                    scroll={{ x: 'max-content', y: 400 }}
                    loading={voteLoading}
                    rowClassName={record => bgTypeChoiceClass(record)}
                    summary={() => (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={3}>
                            コメント
                          </Table.Summary.Cell>
                          {voteGuest.map((item, index) => (
                            <Table.Summary.Cell index={index + 3} key={item.id}>
                              {item.comment && (
                                <BubbleChatIcon
                                  onMouseEnter={e =>
                                    handleMouseEnter(item.comment, e)
                                  }
                                  onMouseLeave={handleMouseLeave}
                                  onClick={() => info(item.comment, item.name)}
                                />
                              )}
                            </Table.Summary.Cell>
                          ))}
                          <Table.Summary.Cell index={voteGuest.length + 3} />
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                )}
              </div>
            </Spin>
            <div
              style={{
                marginLeft: 10,
                marginTop: 10,
                fontSize: 20,
                fontWeight: '600',
              }}
            >
              依頼者へのメッセージ
            </div>
            <div style={{ margin: 10 }}>
              <Input
                onChange={onChangeComment}
                size="large"
                disabled={profile?.id && events?.is_voted}
              />
            </div>
            <div
              style={{ marginTop: 50, marginBottom: 50 }}
              className="buttons"
            >
              {profile?.id && events?.is_voted && (
                <Button
                  onClick={() => {
                    history.push('/');
                  }}
                  className="button bgMediumGray shadowPrimary btnBackPrev"
                >
                  {formatMessage({ id: 'i18n_back' })}
                </Button>
              )}
              {!events?.is_voted && (
                <Button
                  loading={voteLoading}
                  onClick={() => handleCheckEventClick()}
                  className="button blue shadowPrimary"
                  disabled={profile?.id && events?.is_voted}
                >
                  <div style={{ marginLeft: 10 }}>決定</div>
                </Button>
              )}
            </div>
            {!profile?.id && (
              <div
                style={{
                  padding: 20,
                  border: '1px solid #3a3a3a',
                  margin: 10,
                  borderRadius: 8,
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  新規会員登録・ログインいただくと、
                  <br />
                  あなたの予定が入っている箇所が表示され便利です。
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 20,
                    marginTop: 20,
                  }}
                >
                  <div
                    style={{
                      width: '50%',
                      textAlign: 'center',
                      padding: 3,
                    }}
                    onClick={() => history.push('/register')}
                    className={`pointer ${styles.bgPrimaryBlue} ${styles.textLightGray} ${styles.rounded} ${styles.shadowPrimary}`}
                  >
                    新規会員登録(無料)
                  </div>
                  <div
                    style={{
                      width: '50%',
                      textAlign: 'center',
                      padding: 3,
                    }}
                    onClick={() => history.push('/login')}
                    className={`pointer ${styles.bgDarkBlue} ${styles.textLightGray} ${styles.rounded} ${styles.shadowPrimary}`}
                  >
                    ログイン
                  </div>
                </div>
              </div>
            )}
            <AvailableTimeModal
              open={openAvailableTimeModal}
              onClose={onCloseAvailableTimeModal}
            />
          </div>
        </div>
        {isPc && profile?.id && (
          <div className="appointment-calendar">
            <Arrow onClick={handleToggleExpand} className="ic-arrow" />
            <CalendarPreview
              calendarRef={calendarRef}
              dateIncrement={expanded ? 7 : 3}
              viewOnly
              fromVote
              eventDateTimeGuest={eventDateTimeGuest}
              votedEvents={votedEvents}
              votingEvents={votingEvents}
            />
          </div>
        )}
      </div>
      {isPc && profile?.id && <FooterMobile />}

      {!!commentTooltip && (
        <BaseTooltip
          x={tooltipPos.x}
          y={tooltipPos.y}
          visible={!!commentTooltip}
          placement="top"
          maxWidth={450}
          textColor="#fff"
        >
          {commentTooltip}
        </BaseTooltip>
      )}
    </div>
  );
};

export default connect(({ EVENT, MASTER, VOTE }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  voteStore: VOTE,
}))(withRouter(AppointmentSelection));
