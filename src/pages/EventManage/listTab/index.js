import logoCalendar from '@/assets/images/calendar.png';
import logoCheckSuccess from '@/assets/images/check-success.png';
import pinion2 from '@/assets/images/i-pinion-2.svg';
import logoImage from '@/assets/images/logo-black.svg';
import logoUserGroup from '@/assets/images/user-group.png';
import userBoldIcon from '@/assets/images/user.png';
import { copyFormatted, copyText, notify } from '@/commons/function';
import {
  getJPMonthAndDay,
  meetingMethod,
  groupBy,
} from '@/commons/function.js';
import Footer from '@/components/Footer';
import TimeToEmailModal from '@/components/TimeToEmailModal';
import { DOW_NAME, TYPE_EVENT_RELATIONSHIP, YYYYMMDD } from '@/constant';
import voteRequest from '@/services/voteRequest';
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Menu,
  message,
  Modal,
  Pagination,
  Row,
  Spin,
  Switch,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import moment from 'moment';
import { default as React, useEffect, useState } from 'react';
import { history, useIntl, withRouter } from 'umi';
import { TYPE_VOTE_RELATIONSHIP } from '../../../constant';
import styles from './styles.less';

import DropdownMenu from '@/components/DropdownMenu';
import useWindowDimensions from '@/commons/useWindowDimensions';
import {
  isExpired,
  personalExpiredModal,
  renderCssPageSize,
  renderPageSize,
  sortDate,
} from '../../../commons/function';

function ListTab(props) {
  const { location, dispatch, eventStore, tabStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const { totalPersonalEventType, currentEvent } = eventStore;
  const {
    tabLoading,
    listPaginateTeam,
    listPaginateEvents,
    paginateEvents,
  } = tabStore;
  const { width } = useWindowDimensions();
  const [profile, setProfile] = useState({});
  const [modalState, setStateModal] = useState(false);
  const [idEvent, setId] = useState(0);
  const [memberId, setMemberId] = useState(0);
  const [indexTeam, setIndexTeam] = useState(-1);
  const pageSize = 4;
  const [pageIndex, setPageIndex] = useState(1);
  const [listPageIndexEvent, setListPageIndexEvent] = useState([]);
  const [pageIndexEvent, setPageIndexEvent] = useState(1);
  const [timeToEmailModal, setTimeToEmailModal] = useState(false);
  const [teamSlug, setTeamSlug] = useState(null);
  const [isShowModal, setIsShowModal] = useState({
    deleteTeam: false,
    deleteEventVote: false,
    cloneEventVoted: false,
  });
  const [teamID, setTeamID] = useState(null);
  const [checkRole, setCheckRole] = useState(false);
  const [listCheckRole, setListCheckRole] = useState([]);
  const [idEventTeam, setIdEventTeam] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);

  // Websocket vote realtime lavarel Echo
  const [listEventVote, setListEventVote] = useState([]);
  const [listEventVoteOne, setListEventVoteOne] = useState([]);

  const [isAdminContract, setIsAdminContract] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (listPaginateEvents && listPaginateEvents[0]) {
      const temListEventVote = [];
      listPaginateEvents.map(listEvent => {
        listEvent.data.length &&
          listEvent.data.map(event => {
            event.vote &&
              temListEventVote.push({
                eventId: event.id,
                confirmedVoters: event.vote.voters.filter(item => item.is_voted)
                  .length,
                totalVoters: event.vote.voters.length,
              });
            connectWebSocketByEventId(event.id);
          });
      });
      setListEventVote(temListEventVote);
    }
  }, [listPaginateEvents]);

  useEffect(() => {
    if (paginateEvents && IsIndividual()) {
      const temListEventVote = [];
      try {
        paginateEvents.data.length &&
          paginateEvents.data.map(event => {
            event.vote &&
              temListEventVote.push({
                eventId: event.id,
                confirmedVoters: event.vote.voters.filter(item => item.is_voted)
                  .length,
                totalVoters: event.vote.voters.length,
              });
            connectWebSocketByEventId(event.id);
          });
      } catch (error) {
        eventInfo(formatMessage({ id: 'i18n_you_have_been_delete_from_team' }));
        history.push('/?tab=1');
      }
      setListEventVoteOne(temListEventVote);
    }
  }, [paginateEvents]);

  useEffect(() => {
    const { query } = location;
    if (query.team_id) {
      dispatch({
        type: 'TAB/getOnePaginateEvents',
        payload: {
          team_id: Number(query.team_id),
          relationship_type: TYPE_VOTE_RELATIONSHIP,
        },
      });
    } else {
      const { query } = location;
      const payload = {
        user_id_of_member: Number(query.member_id) || profile?.id,
        page: 1,
        page_size: 2,
        relationship_type: TYPE_VOTE_RELATIONSHIP,
      };
      dispatch({
        type: 'TAB/getOnePaginateEventsMember',
        payload,
      });
    }
  }, [location.query.team_id, location.query.member_id]);

  useEffect(() => {
    if (location.query.member_id || location.query.member_all) {
      getListAccount();
    } else if (location.query.team_id || location.query.team_all) {
      getList();
    } else {
      getListAccount();
    }
  }, [
    pageIndex,
    location.query.member_id,
    location.query.member_all,
    location.query.team_all,
    // location.query.team_id,
  ]);

  useEffect(() => {
    if (!location.query.team_id || !location.query.member_id) {
      const temListPageIndexEvent = [];
      if (listPaginateTeam) {
        listPaginateTeam.data.map(item => {
          location.query.team_all
            ? temListPageIndexEvent.push({
                pageIndexEvent: 1,
                team_id: item.id,
              })
            : temListPageIndexEvent.push({
                pageIndexEvent: 1,
                user_id_of_member: item.id,
              });
        });
        setListPageIndexEvent(temListPageIndexEvent);
      }
    }
    if (listPaginateTeam) {
      if (listPaginateTeam.is_admin_contract) {
        setCheckRole(true);
        setIsAdminContract(true);
      } else {
        const temListCheckRole = [];
        listPaginateTeam.data.map(item => {
          if (!item.members) {
            temListCheckRole.push({
              team_id: item.id,
              is_admin: null,
            });
          } else {
            const temCheckRole = item.members.find(
              event => event.user_id === profile?.id,
            );
            if (temCheckRole) {
              temListCheckRole.push({
                team_id: item.id,
                is_admin: !!temCheckRole.is_admin,
              });
            }
          }
        });
        setListCheckRole(temListCheckRole);
      }
    }
  }, [listPaginateTeam]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageIndex]);

  const connectWebSocketByEventId = eventId => {
    if (!eventId) {
      return;
    }

    if (
      window.Echo.connector.channels['presence-voting_event_channel.' + eventId]
    ) {
      window.Echo.leave('presence-voting_event_channel.' + eventId);
    }

    // Listen:
    window.Echo.join('voting_event_channel.' + eventId).listen(
      '.update_vote',
      async e => {
        if (
          paginateEvents &&
          paginateEvents.data &&
          paginateEvents.data.length
        ) {
          const final = paginateEvents.data.map(item => {
            if (
              eventId === item.id &&
              e.total_voters !== item.vote.voters.length
            ) {
              item.vote.voters = [
                ...item.vote.voters,
                {
                  is_voted: 1,
                },
              ];
            }

            return item;
          });

          await dispatch({
            type: 'TAB/setOnePaginateEvents',
            payload: { ...paginateEvents, data: final },
          });
        }

        if (listPaginateEvents && listPaginateEvents.length) {
          const temp = listPaginateEvents.map(event => {
            if (event && event.data && event.data.length) {
              const final = event.data.map(item => {
                if (
                  eventId === item.id &&
                  e.total_voters !== item.vote.voters.length
                ) {
                  item.vote.voters = [
                    ...item.vote.voters,
                    {
                      is_voted: 1,
                    },
                  ];
                }

                return item;
              });

              event.data = final;
            }
            return event;
          });

          await dispatch({
            type: 'TAB/setListPaginateEvents',
            payload: [...temp],
          });
        }
      },
    );
  };

  const getList = async (pageIndexValue = null) => {
    const payload = {
      relationship_type: TYPE_VOTE_RELATIONSHIP,
      page_size: pageSize,
      page: pageIndexValue !== null ? pageIndexValue : pageIndex,
    };
    await dispatch({ type: 'TAB/getPaginateTeam', payload });
  };

  const getListAccount = async (pageIndexValue = null) => {
    const payload = {
      page: pageIndexValue !== null ? pageIndexValue : pageIndex,
      has_pagination: true,
    };
    await dispatch({ type: 'TAB/getPaginateMember', payload });
  };

  const getProfile = async () => {
    const localProfile = JSON.parse(localStorage.getItem('profile'));
    if (localProfile) {
      setProfile(localProfile);
    } else {
      const profile = await dispatch({
        type: 'MASTER/getProfile',
        payload: {},
      });
      setProfile(profile);
    }
  };
  function showModal(id, item) {
    if (checkUserExpired(item?.has_member_expired)) {
      return;
    }
    if (
      IsIndividual() &&
      !isAdminOrOwnerOfEvent(paginateEvents, currentEvent)
    ) {
      return notify();
    }

    if (
      IsAll() &&
      !isAdminOrOwnerOfEvent(listPaginateEvents[indexTeam], currentEvent)
    ) {
      return notify();
    }

    if (IsAll()) {
      listPaginateEvents[indexTeam].data.map(eventItem => {
        if (id === eventItem.id) {
          setStateModal(true);
          setIsShowModal({
            deleteTeam: false,
            deleteEventVote: true,
            cloneEventVoted: false,
          });
        }
      });
    } else {
      paginateEvents.data.map(eventItem => {
        if (id === eventItem.id) {
          setStateModal(true);
          setIsShowModal({
            deleteTeam: false,
            deleteEventVote: true,
            cloneEventVoted: false,
          });
        }
      });
    }
  }

  async function handleOk() {
    setStateModal(false);
    setIsShowModal({
      deleteTeam: false,
      deleteEventVote: false,
      cloneEventVoted: false,
    });
    await dispatch({ type: 'TAB/setLoading', payload: true });
    if (teamSlug) {
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
      setTeamID(null);

      await dispatch({ type: 'TAB/setLoading', payload: false });
      return;
    }
    const payload = {
      eventTypeId: idEvent,
    };
    const res = await dispatch({ type: 'EVENT/deleteEventType', payload });
    if (res.status === 200) {
      const { query } = location;
      if (query.team_id) {
        dispatch({
          type: 'TAB/getOnePaginateEvents',
          payload: { team_id: Number(query.team_id) },
        });
      } else if (
        query.member_id ||
        (!location.query.team_all && !location.query.member_all)
      ) {
        const { query } = location;
        const payload = {
          user_id_of_member: Number(query.member_id) || profile?.id,
          page: 1,
          page_size: 2,
          relationship_type: 3,
        };
        dispatch({
          type: 'TAB/getOnePaginateEventsMember',
          payload,
        });
      } else {
        if (totalPersonalEventType % pageSize === 1) {
          if (location.query.member_id || location.query.member_all) {
            getListAccount(pageIndex - 1);
          } else if (location.query.team_id || location.query.team_all) {
            getList(pageIndex - 1);
          } else {
            getListAccount(pageIndex - 1);
          }
        } else {
          if (location.query.member_id || location.query.member_all) {
            getListAccount();
          } else if (location.query.team_id || location.query.team_all) {
            getList();
          } else {
            getListAccount();
          }
        }
      }
    }
    await dispatch({ type: 'TAB/setLoading', payload: false });
  }

  function handleCancel() {
    setIsShowModal({
      deleteTeam: false,
      deleteEventVote: false,
      cloneEventVoted: false,
    });
    setStateModal(false);
    setTeamSlug(null);
    setTeamID(null);
    setIdEventTeam(null);
  }
  function cloneEvent(item) {
    if (checkUserExpired(item?.has_member_expired)) {
      return;
    }
    history.push(
      `/create-calendar?idEvent=${idEvent}&clone=1&relationship_type=${TYPE_VOTE_RELATIONSHIP}&member_id=${memberId}`,
    );
  }
  function editEvent(event, item) {
    if (checkUserExpired(item?.has_member_expired)) {
      return;
    }
    if (
      IsIndividual() &&
      !isAdminOrOwnerOfEvent(paginateEvents, currentEvent)
    ) {
      return notify();
    }

    if (
      IsAll() &&
      !isAdminOrOwnerOfEvent(listPaginateEvents[indexTeam], currentEvent)
    ) {
      return notify();
    }

    if (event && event.team_id) {
      history.push(`/calendar/${idEvent}`);
    } else {
      history.push(`/calendar/${idEvent}`);
    }
  }

  const handleCopyLatestBlockTime = async (vote, item) => {
    if (checkUserExpired(item?.has_member_expired)) {
      return;
    }
    const events = currentEvent ? currentEvent.event_datetimes : [];

    let result = events.filter(e => {
      e.dayStr = moment(e.start_time).format(YYYYMMDD);
      return moment(e.start_time).isAfter(moment(), 'minutes');
    });

    const link = await generateLinkVote(vote);

    if (link === 'failed') {
      notify(
        formatMessage({ id: 'i18n_message_error_get_calendar_by_provider' }),
      );
      return;
    }

    // generate 5 days , 2 block per day
    let breakResult = [];
    result = groupBy('dayStr')(result);
    let countDay = 0;
    let maxPerday = 2;
    let maxDay = 5;
    for (const [key, value] of Object.entries(result)) {
      if (countDay >= maxDay) {
        break;
      }

      if (value.length) {
        countDay++;

        breakResult = [...breakResult, ...value.slice(0, maxPerday)];
      }
    }

    let listTime = '';
    if (breakResult.length) {
      breakResult = sortDate(breakResult);
    }
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
      if (ua.indexOf('chrome') > -1) {
        for (let i = 0; i < breakResult.length; i++) {
          const item = breakResult[i];
          listTime += `<div>
              ${getJPMonthAndDay(item.start_time)} (${
            DOW_NAME[
              dayjs()
                .day(item.day_of_week)
                .day()
            ].name_jp
          }) ${dayjs(item.start_time).format('HH:mm')} ~ ${dayjs(
            item.end_time,
          ).format('HH:mm')}\r
            </div>`;
        }
        copyFormatted(
          `<div>
              <div>
                ${listTime}
              </div>
              <div>
                ※最新の日程は ${link} をご確認ください。
              </div>
            </div>`,
          // 'tool',
        );
      } else {
        for (let i = 0; i < breakResult.length; i++) {
          const item = breakResult[i];
          listTime += `${
            getJPMonthAndDay(item.start_time)
            // dayjs()
            // .day(item.day_of_week)
            // .format(FORMAT_DATE_TEXT_2)
          } (${
            DOW_NAME[
              dayjs()
                .day(item.day_of_week)
                .day()
            ].name_jp
          }) ${dayjs(item.start_time).format('HH:mm')} ~ ${dayjs(
            item.end_time,
          ).format('HH:mm')} \n`;
        }

        setTimeout(() => {
          copyText(listTime + `※最新の日程は ${link} をご確認ください。`);
        }, 0);
      }
    }
    if (ua.indexOf('firefox') != -1) {
      for (let i = 0; i < breakResult.length; i++) {
        const item = breakResult[i];
        listTime += `${
          getJPMonthAndDay(item.start_time)
          // dayjs()
          // .day(item.day_of_week)
          // .format(FORMAT_DATE_TEXT_2)
        } (${
          DOW_NAME[
            dayjs()
              .day(item.day_of_week)
              .day()
          ].name_jp
        }) ${dayjs(item.start_time).format('HH:mm')} ~ ${dayjs(
          item.end_time,
        ).format('HH:mm')} \n`;
      }

      setTimeout(() => {
        copyText(listTime + `※最新の日程は ${link} をご確認ください。`);
      }, 0);
    }

    message.success(formatMessage({ id: 'i18n_copy_latest_block_success' }));
  };

  const menu = (event, item) => (
    <Menu className={styles.eventTypeOption}>
      <Menu.Item key="0" className={styles.greyHover}>
        <div onClick={() => editEvent(event, item)}>
          {formatMessage({ id: 'i18n_edit' })}
        </div>
      </Menu.Item>
      <Menu.Item key="1" className={styles.greyHover}>
        <div onClick={() => cloneEvent(item)}>
          {formatMessage({ id: 'i18n_copy' })}
        </div>
      </Menu.Item>
      <Menu.Item key="2" className={styles.greyHover}>
        <div onClick={() => showModal(idEvent, item)}>
          {formatMessage({ id: 'i18n_delete' })}
        </div>
      </Menu.Item>
      {/* <Menu.Item key="3" onClick={handleClickTimeToEmail}>
            <div>{formatMessage({ id: 'i18n_copy_link_to_email' })}</div>
          </Menu.Item> */}
      <Menu.Item
        key="4"
        onClick={() => handleCopyLatestBlockTime(event.vote, item)}
        className={styles.greyHover}
      >
        <div>{formatMessage({ id: 'i18n_copy_schedule_date' })} </div>
      </Menu.Item>
    </Menu>
  );

  const menuTeam = (
    <Menu className={styles.eventTypeOption}>
      <Menu.Item key="0" className={styles.greyHover}>
        <div onClick={() => editTeam()}>
          {formatMessage({ id: 'i18n_edit_team' })}
        </div>
      </Menu.Item>
      <Menu.Item key="1" className={styles.greyHover}>
        <div onClick={() => removeTeam()}>
          {formatMessage({ id: 'i18n_remove_team' })}
        </div>
      </Menu.Item>
    </Menu>
  );

  const editTeam = () => {
    if (!currentTeam) {
      return;
    }

    if (!isAdminContract && !isAdminTeam(currentTeam)) {
      return notify();
    }

    history.push({
      pathname: `/create-team`,
      search: `?slug=${teamSlug}&tab=${history.location.query.tab}&team_id=${history.location.query.team_id}&team_all=${history.location.query.team_all}`,
    });
  };

  const removeTeam = () => {
    if (!currentTeam) {
      return;
    }

    if (!isAdminContract && !isAdminTeam(currentTeam)) {
      return notify();
    }

    setIsShowModal({
      deleteTeam: true,
      deleteEventVote: false,
      cloneEventVoted: false,
    });
    setStateModal(true);
  };

  const generateLinkVote = async vote => {
    const { full_url } = vote;
    return full_url;
  };

  const formatTime = item => {
    const { start_time, day_of_week, end_time } = item;
    return (
      getJPMonthAndDay(start_time) +
      ' (' +
      DOW_NAME[
        dayjs()
          .day(day_of_week)
          .day()
      ].name_jp +
      ') ' +
      dayjs(start_time).format('HH:mm') +
      '~' +
      dayjs(end_time).format('HH:mm')
    );
  };

  const copyLink = async (event, index, item) => {
    dispatch({ type: 'TAB/setLoading', payload: true });

    const { vote, id, name, block_name, location_name } = event;
    if (checkUserExpired(item?.has_member_expired)) {
      return;
    }

    let eventCurrent = null;
    if (
      location.query.member_id ||
      location.query.team_id ||
      (!location.query.team_all && !location.query.member_all)
    ) {
      eventCurrent = paginateEvents.data.find(item => item.id === id);
    } else {
      eventCurrent = listPaginateEvents[index].data.find(
        item => item.id === id,
      );
    }

    const link = await generateLinkVote(vote);

    const events = eventCurrent ? eventCurrent.event_datetimes : [];

    let result = events.filter(e => {
      e.dayStr = moment(e.start_time).format(YYYYMMDD);
      return moment(e.start_time).isAfter(moment(), 'minutes');
    });
    // generate 5 days , 2 block per day
    let breakResult = [];
    result = groupBy('dayStr')(result);
    let countDay = 0;
    let maxPerday = 2;
    let maxDay = 5;
    for (const [key, value] of Object.entries(result)) {
      if (countDay >= maxDay) {
        break;
      }

      if (value.length) {
        countDay++;

        breakResult = [...breakResult, ...value.slice(0, maxPerday)];
      }
    }

    let payloadBlockTime = {
      id,
      urlCopy: link,
      nameEvent: name,
      block_name,
      location_name,
    };
    payloadBlockTime.listBlockTime = breakResult.map(item => {
      item.timeFormat = formatTime(item);
      return item;
    });
    //
    // if (IsIndividual()) {
    // const final = paginateEvents.data.map(eventType => {
    //   if (eventType.id === id) {
    //     eventType.choosenOnceLink = true;
    //     eventType.disabledManyTimeLink = true;
    //   } else {
    //     eventType.disabledOnceLink = true;
    //     eventType.disabledManyTimeLink = true;
    //   }
    //   return eventType;
    // });

    // await dispatch({
    //   type: 'TAB/setOnePaginateEvents',
    //   payload: { ...paginateEvents, data: final },
    // });

    // await setTimeout(() => {
    //   const final = paginateEvents.data.map(eventType => {
    //     eventType.choosenOnceLink = false;
    //     eventType.choosenManyTimeLink = false;
    //     eventType.disabledOnceLink = false;
    //     eventType.disabledManyTimeLink = false;
    //     return eventType;
    //   });

    //   dispatch({
    //     type: 'TAB/setOnePaginateEvents',
    //     payload: { ...paginateEvents, data: final },
    //   });
    // }, 1000);
    // }

    // if (IsAll()) {
    //   const temp = listPaginateEvents[index].data.map(eventType => {
    //     if (eventType.id === id) {
    //       eventType.choosenOnceLink = true;
    //       eventType.disabledManyTimeLink = true;
    //     } else {
    //       eventType.disabledOnceLink = true;
    //       eventType.disabledManyTimeLink = true;
    //     }
    //     return eventType;
    //   });

    //   let temListPaginateEvents = [...listPaginateEvents];
    //   temListPaginateEvents[index].data = temp;
    //   await dispatch({
    //     type: 'TAB/setListPaginateEvents',
    //     payload: temListPaginateEvents,
    //   });

    //   await setTimeout(() => {
    //     const temp = listPaginateEvents[index].data.map(eventType => {
    //       eventType.choosenOnceLink = false;
    //       eventType.choosenManyTimeLink = false;
    //       eventType.disabledOnceLink = false;
    //       eventType.disabledManyTimeLink = false;
    //       return eventType;
    //     });

    //     let temListPaginateEvents = [...listPaginateEvents];
    //     temListPaginateEvents[index].data = temp;

    //     dispatch({
    //       type: 'TAB/setListPaginateEvents',
    //       payload: temListPaginateEvents,
    //     });
    //   }, 1000);
    // }

    dispatch({
      type: 'EVENT/setCalendarCopyUrl',
      payload: payloadBlockTime,
    });

    history.push('/calendar-creation-copy');
    dispatch({ type: 'TAB/setLoading', payload: false });
  };

  const copyLink1 = async (event, index, item) => {
    const { vote, id } = event;
    if (checkUserExpired(item?.has_member_expired)) {
      return;
    }
    const link = await generateLinkVote(vote);

    setTimeout(() => {
      copyText(link);
    }, 0);

    if (IsIndividual()) {
      const final = paginateEvents.data.map(eventType => {
        if (eventType.id === id) {
          eventType.choosenOnceLink = true;
          eventType.disabledManyTimeLink = true;
        } else {
          eventType.disabledOnceLink = true;
          eventType.disabledManyTimeLink = true;
        }
        return eventType;
      });

      await dispatch({
        type: 'TAB/setOnePaginateEvents',
        payload: { ...paginateEvents, data: final },
      });

      await setTimeout(() => {
        const final = paginateEvents.data.map(eventType => {
          eventType.choosenOnceLink = false;
          eventType.choosenManyTimeLink = false;
          eventType.disabledOnceLink = false;
          eventType.disabledManyTimeLink = false;
          return eventType;
        });

        dispatch({
          type: 'TAB/setOnePaginateEvents',
          payload: { ...paginateEvents, data: final },
        });
      }, 1000);
    }

    if (IsAll()) {
      const temp = listPaginateEvents[index].data.map(eventType => {
        if (eventType.id === id) {
          eventType.choosenOnceLink = true;
          eventType.disabledManyTimeLink = true;
        } else {
          eventType.disabledOnceLink = true;
          eventType.disabledManyTimeLink = true;
        }
        return eventType;
      });

      let temListPaginateEvents = [...listPaginateEvents];
      temListPaginateEvents[index].data = temp;
      await dispatch({
        type: 'TAB/setListPaginateEvents',
        payload: temListPaginateEvents,
      });

      await setTimeout(() => {
        const temp = listPaginateEvents[index].data.map(eventType => {
          eventType.choosenOnceLink = false;
          eventType.choosenManyTimeLink = false;
          eventType.disabledOnceLink = false;
          eventType.disabledManyTimeLink = false;
          return eventType;
        });

        let temListPaginateEvents = [...listPaginateEvents];
        temListPaginateEvents[index].data = temp;

        dispatch({
          type: 'TAB/setListPaginateEvents',
          payload: temListPaginateEvents,
        });
      }, 1000);
    }
  };

  const onSwitchChange = async (
    value,
    index,
    type,
    item,
    has_member_expired,
  ) => {
    if (checkUserExpired(has_member_expired)) {
      return;
    }
    const member_id = location.query.member_id;
    const team_id = location.query.team_id;
    const team_all = location.query.team_all;
    const member_all = location.query.member_all;

    if (!isAdminOrOwnerOfEvent(item, value)) {
      return notify();
    }

    dispatch({ type: 'TAB/setLoading', payload: true });
    const payload = {
      eventTypeId: value.id,
      status: !value.status,
      tab: 2,
      member_id,
      team_id,
      team_all,
      member_all,
      needReload: true,
      switchChange: true,
    };
    const res = await dispatch({ type: 'EVENT/updateEventType', payload });
    if (res) {
      if (type === 1) {
        const result = listPaginateEvents[index].data.map(item => {
          if (item.id === value.id) {
            item.status = !item.status;
          }
          return item;
        });

        const temListPaginateEvents = [...listPaginateEvents];
        temListPaginateEvents[index].data = result;
        dispatch({
          type: 'TAB/setListPaginateEvents',
          payload: [...temListPaginateEvents],
        });
      }
      if (type === 2) {
        const result = paginateEvents.data.map(item => {
          if (item.id === value.id) {
            item.status = !item.status;
          }
          return item;
        });
        dispatch({
          type: 'TAB/setOnePaginateEvents',
          payload: { ...paginateEvents, data: result },
        });
      }
    }

    dispatch({ type: 'TAB/setLoading', payload: false });
  };

  const createEventType = (item, click_event) => {
    const { has_member_expired, id } = item;
    const { team_all, team_id } = history.location.query;

    let teamId;
    if (team_id) {
      teamId = team_id;
    }
    if (team_all) {
      teamId = id;
    }

    if (checkUserExpired(has_member_expired)) {
      return;
    }

    if (!isTeam(item) && profile?.id !== id && !isAdminContract) {
      return notify();
    }

    const menu = [
      {
        type: TYPE_EVENT_RELATIONSHIP,
        isOneTime: 0,
      },
      {
        type: TYPE_EVENT_RELATIONSHIP,
        isOneTime: 1,
      },
      {
        type: TYPE_VOTE_RELATIONSHIP,
        isOneTime: 0,
      },
    ];
    if (team_all || team_id) {
      history.push(
        `/calendar-creation?&relationship_type=${
          menu[click_event['key']].type
        }&team_id=${teamId}&member_id=${memberId}&isOneTime=${
          menu[click_event['key']].isOneTime
        }`,
      );
    } else {
      history.push(
        `/calendar-creation?&relationship_type=${
          menu[click_event['key']].type
        }&member_id=${id}&isOneTime=${menu[click_event['key']].isOneTime}`,
      );
    }
  };

  const onPreview = async (vote, id, index, member_expired) => {
    if (checkUserExpired(member_expired)) {
      return;
    }
    const { slug } = vote;
    const code = await voteRequest.getCodeUser({ vote: slug });
    history.push(`/preview-vote?id=${slug}&code=${code.body.result[0]}`);
  };

  const handleClickOptionEvent = (id, index, memberId) => {
    setId(id);
    setMemberId(memberId);
    setIndexTeam(index);
    let event = null;
    if (
      location.query.member_id ||
      location.query.team_id ||
      (!location.query.team_all && !location.query.member_all)
    ) {
      event = paginateEvents.data.find(item => item.id === id);
      dispatch({ type: 'EVENT/updateCurrentEvent', payload: event });
    } else {
      event = listPaginateEvents[index].data.find(item => item.id === id);
      dispatch({ type: 'EVENT/updateCurrentEvent', payload: event });
    }
  };

  const handleVisibleChangeSetting = value => {
    if (!value) {
      dispatch({ type: 'EVENT/updateIsSelectEvent', payload: false });
    }
  };

  const handleListPageIndexEvent = (index, id) => {
    if (location.query.team_id || location.query.team_all) {
      let temListPageIndexEvent = [...listPageIndexEvent].map(item => {
        if (item.user_id_of_member === id || item.team_id === id) {
          item.pageIndexEvent = index;
        }
        return item;
      });
      setListPageIndexEvent(temListPageIndexEvent);
      dispatch({
        type: 'TAB/getListPagePaginateEvents',
        payload: temListPageIndexEvent,
      });
    } else {
      let temListPageIndexEvent = [...listPageIndexEvent].map(item => {
        if (item.user_id_of_member === id || item.team_id === id) {
          item.pageIndexEvent = index;
        }
        return item;
      });
      setListPageIndexEvent(temListPageIndexEvent);
      dispatch({
        type: 'TAB/getListPagePaginateEventsMember',
        payload: temListPageIndexEvent,
      });
    }
  };

  const handlePageIndexEvent = index => {
    setPageIndexEvent(index);
    if (location.query.team_id) {
      dispatch({
        type: 'TAB/getPagePaginateEvents',
        payload: { team_id: paginateEvents.team_id, pageIndexEvent: index },
      });
    } else {
      const payload = {
        user_id_of_member: paginateEvents.member_id || profile?.id,
        page: index,
        page_size: 2,
        relationship_type: TYPE_VOTE_RELATIONSHIP,
      };
      dispatch({
        type: 'TAB/getPagePaginateEventsMember',
        payload,
      });
    }
  };

  const menuAdd = item => (
    <Menu
      onClick={click_event => createEventType(item, click_event)}
      className={styles.menuCreateRoom}
    >
      <Menu.Item key="0" icon={<img src={logoCalendar} width={32} />}>
        <h4>日程調整ページを作成</h4>
        <p>何度も繰り返し日程調整できるURLを発行</p>
      </Menu.Item>
      <Menu.Item key="1" icon={<img src={logoCheckSuccess} width={32} />}>
        <h4>1回限りの日程調整 </h4>
        <p>1回限りの日程調整URLを発行</p>
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<img src={logoUserGroup} width={32} />}
        className={styles.menuAddItem}
      >
        <h4>投票ページを作成</h4>
        <p>複数社が、投票形式で日程調整できる機能</p>
      </Menu.Item>
    </Menu>
  );

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

  // check is team lead
  const canEditEvent = item => {
    if (!item) {
      return false;
    }

    return item.can_edit_or_delete_event || item.is_admin || isAdminContract;
  };

  const isAdminOrOwnerOfEvent = (item, event) => {
    if (isAdminContract || canEditEvent(item)) {
      return true;
    }

    if (!event) {
      return false;
    }
    if (event.user && event.user.id == profile?.id) {
      return true;
    }

    return false;
  };

  const isTeam = item => {
    return item && (item.team_slug || item.slug);
  };

  const isAdminTeam = item => {
    if (canEditEvent(item)) {
      return true;
    }

    if (item && item.members) {
      const exits = item.members.find(e => {
        return e.user_id == profile?.id;
      });

      if (!exits) {
        return false;
      }

      return exits.is_admin;
    }

    return false;
  };

  const [menuAddDropdownVisible, setMenuAddDropdownVisible] = useState(true);
  const [menuAddDropdownVisible2, setMenuAddDropdownVisible2] = useState(true);

  const editVoteItem = (event, eventTem, member_expired, count = 1) => {
    if (checkUserExpired(member_expired)) {
      return;
    }

    // add params check voted
    const { is_finished } = event.vote;

    if (isAdminOrOwnerOfEvent(eventTem, event) || event.disabledManyTimeLink) {
      if (event.team_id) {
        history.push(
          `/calendar-creation?idEvent=${event.id}&edit=true&relationship_type=${TYPE_VOTE_RELATIONSHIP}&team_id=${event.team_id}&member_id=${eventTem.user_id}&&is_finished=${is_finished}`,
        );
      } else {
        history.push(
          `/calendar-creation?idEvent=${event.id}&edit=true&relationship_type=${TYPE_VOTE_RELATIONSHIP}&&member_id=${eventTem.id}&&is_finished=${is_finished}`,
        );
      }
    }
  };

  const copyManyLinkVote = (event, paginateEvents) => {
    const { has_member_expired, id, is_admin, team_id } = paginateEvents;
    const { vote } = event;
    const teamIdLocal = location.query.team_id;

    // return
    if (checkUserExpired(has_member_expired)) {
      return;
    }

    if (!isTeam(paginateEvents) && profile?.id !== id && !isAdminContract) {
      return notify();
    }

    let role = false;
    if (
      !(
        profile?.id === id ||
        is_admin ||
        (listPaginateTeam && listPaginateTeam.is_admin_contract) ||
        checkRole ||
        (listCheckRole.find(check => check.team_id === team_id) &&
          listCheckRole.find(check => check.team_id === team_id).is_admin)
      )
    ) {
      role = true;
    }

    try {
      const fullUrl = vote.full_url.split('=')[
        vote.full_url.split('=').length - 1
      ];
      let url = `/invite-member?id=${vote.slug}&name=${fullUrl}&chooseSchedule=true&role=${role}`;
      if (teamIdLocal) {
        url += '&eventTeam=true';
      }
      history.push(url);
    } catch (error) {
      notify(
        formatMessage({
          id: 'i18n_you_have_been_delete_from_team',
        }),
      );
      history.push('/?tab=1');
    }
  };

  return (
    <div>
      <div className={styles.personalMeeting}>
        <Spin spinning={tabLoading}>
          {IsAll() &&
            listPaginateTeam.data.map((item, index) => (
              <div key={index} className={index % 2 ? styles.bgWhite : ''}>
                <div className={styles.listHeader}>
                  <Row>
                    <Col xs={12} sm={16} md={18} lg={19}>
                      <div className={styles.personalInfo}>
                        <div className={styles.avtImage}>
                          {item.avatar ? (
                            <Avatar size={60} src={item.avatar} />
                          ) : (
                            <Avatar
                              size={60}
                              src={logoImage}
                              className={styles.defaultAvatar}
                            />
                          )}
                        </div>
                        <div>
                          <p>{item.name}</p>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xs={12}
                      sm={8}
                      md={6}
                      lg={5}
                      className={styles.antdCol}
                    >
                      <div className={styles.rightActions}>
                        <div className={styles.creatNewBtnZone}>
                          <DropdownMenu
                            dropdownName={() => (
                              <Button
                                // onClick={() => createEventType(item.id)}
                                style={{ marginRight: '10px' }}
                              >
                                <span className={styles.plusIcon}>＋</span>{' '}
                                {formatMessage({
                                  id: 'i18n_create_button',
                                })}
                              </Button>
                            )}
                            overlay={() => menuAdd(item)}
                            style={{
                              paddingTop: '8px',
                              right: '0',
                            }}
                            visible={menuAddDropdownVisible}
                            setVisible={setMenuAddDropdownVisible}
                          />

                          {(history.location.query.team_all ||
                            history.location.query.team_id) && (
                            <Dropdown
                              overlay={menuTeam}
                              trigger={['click']}
                              onVisibleChange={handleVisibleChangeSetting}
                              onClick={() => {
                                setTeamSlug(item.slug);
                                setTeamID(Number(item.id));
                                setCurrentTeam(item);
                              }}
                            >
                              <img src={pinion2} />
                            </Dropdown>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className={styles.listEventTypes}>
                  <Row>
                    {listPaginateEvents &&
                      listPaginateEvents.map((eventTem, index) => {
                        return (
                          <>
                            {(item.id === eventTem.team_id ||
                              item.id === eventTem.id) && (
                              <>
                                {eventTem.data.map(event => {
                                  return (
                                    <>
                                      <Col
                                        lg={12}
                                        md={24}
                                        sm={24}
                                        xs={24}
                                        key={`event-type-${event.id}`}
                                      >
                                        <div className={styles.eventType}>
                                          <div
                                            className={styles.backgroundEdit}
                                            onClick={() =>
                                              editVoteItem(
                                                event,
                                                eventTem,
                                                item.has_member_expired,
                                              )
                                            }
                                          />
                                          <div
                                            className={styles.eventTypeHeader}
                                          >
                                            <div className={styles.stepTitle}>
                                              <div className={styles.titleIcon}>
                                                <div
                                                  className={
                                                    styles.bolderColIcon
                                                  }
                                                ></div>
                                                <div
                                                  className={
                                                    styles.normalColIcon
                                                  }
                                                ></div>
                                              </div>
                                              <Tooltip title={event.name}>
                                                <h2>{event.name}</h2>
                                              </Tooltip>
                                            </div>

                                            <Switch
                                              checkedChildren="ON"
                                              unCheckedChildren="OFF"
                                              checked={event.status}
                                              onChange={() =>
                                                onSwitchChange(
                                                  event,
                                                  index,
                                                  1,
                                                  eventTem,
                                                  item?.has_member_expired,
                                                )
                                              }
                                              loading={event.switchLoading}
                                            />
                                          </div>
                                          <div
                                            className={styles.eventTypeDetail}
                                          >
                                            {formatMessage({
                                              id: 'i18n_meeting_format',
                                            })}
                                            ：{event.real_category}
                                            <br />
                                            {formatMessage({
                                              id: 'i18n_meeting_location',
                                            })}
                                            ：
                                            <span
                                              className={styles.meetingMethod}
                                            >
                                              {meetingMethod(event)}
                                            </span>
                                            <br />
                                            {formatMessage({
                                              id:
                                                'i18n_required_time_list_event_type',
                                            })}
                                            ：
                                            {event.block_number +
                                              event.move_number * 2}
                                            {formatMessage({
                                              id: 'i18n_minute',
                                            })}
                                            <br />
                                            {!!event.block_number &&
                                            !!event.move_number ? (
                                              <span
                                                className={
                                                  styles.smaller_in_mobile
                                                }
                                              >
                                                (
                                                {formatMessage({
                                                  id: 'i18n_breakdown',
                                                })}
                                                ：
                                                {formatMessage({
                                                  id: 'i18n_event_time',
                                                })}
                                                {event.block_number}
                                                {formatMessage({
                                                  id: 'i18n_minute',
                                                })}
                                                {' + '}
                                                {formatMessage({
                                                  id: 'i18n_move_time_double',
                                                })}
                                                {event.move_number * 2}
                                                {formatMessage({
                                                  id: 'i18n_minute',
                                                })}
                                                )
                                              </span>
                                            ) : (
                                              <span
                                                className={
                                                  styles.smaller_in_mobile
                                                }
                                              ></span>
                                            )}
                                            <div
                                              className={styles.wrapperPreview}
                                            >
                                              <div
                                                className={styles.previewText}
                                              >
                                                <img
                                                  src={userBoldIcon}
                                                  className={
                                                    styles.userBoldIcon
                                                  }
                                                />
                                                {listEventVote[0] ? (
                                                  listEventVote.map(
                                                    eventVote => {
                                                      if (
                                                        eventVote.eventId ===
                                                        event.id
                                                      ) {
                                                        return (
                                                          <>
                                                            {
                                                              eventVote.totalVoters
                                                            }{' '}
                                                            {formatMessage({
                                                              id:
                                                                'i18n_tab_preview_text_in',
                                                            })}{' '}
                                                            {
                                                              eventVote.confirmedVoters
                                                            }{' '}
                                                            {formatMessage({
                                                              id:
                                                                'i18n_tab_preview_text_after',
                                                            })}
                                                          </>
                                                        );
                                                      }
                                                    },
                                                  )
                                                ) : (
                                                  <>
                                                    0{' '}
                                                    {formatMessage({
                                                      id:
                                                        'i18n_tab_preview_text_in',
                                                    })}{' '}
                                                    0{' '}
                                                    {formatMessage({
                                                      id:
                                                        'i18n_tab_preview_text_after',
                                                    })}
                                                  </>
                                                )}
                                              </div>
                                              <Button
                                                className={styles.previewButton}
                                                disabled={!event.status}
                                                onClick={() =>
                                                  onPreview(
                                                    event.vote,
                                                    event.id,
                                                    index,
                                                    item.has_member_expired,
                                                  )
                                                }
                                              >
                                                {formatMessage({
                                                  id: 'i18n_preview',
                                                })}
                                              </Button>
                                            </div>
                                          </div>
                                          <div
                                            className={styles.linkButtonZone}
                                          >
                                            <Button
                                              className={`${
                                                styles.linkButton
                                              } ${event.choosenOnceLink &&
                                                styles.savedLinkButton} ${
                                                event.disabledOnceLink ||
                                                !event.status
                                                  ? styles.disabledBtn
                                                  : ''
                                              } `}
                                              onClick={() => {
                                                if (
                                                  checkUserExpired(
                                                    item.has_member_expired,
                                                  )
                                                ) {
                                                  return;
                                                }
                                                if (
                                                  event.vote &&
                                                  event.vote.is_finished
                                                ) {
                                                  setIdEventTeam(event.id);
                                                  setTeamID(event.team_id);
                                                  setStateModal(true);
                                                  setIsShowModal({
                                                    deleteTeam: false,
                                                    deleteEventVote: false,
                                                    cloneEventVoted: true,
                                                  });
                                                } else {
                                                  copyLink1(event, index, item);
                                                }
                                              }}
                                              disabled={
                                                event.disabledOnceLink ||
                                                !event.status
                                              }
                                              loading={event.copyOnceLoading}
                                            >
                                              {event.choosenOnceLink
                                                ? formatMessage({
                                                    id: 'i18n_copied',
                                                  })
                                                : formatMessage({
                                                    id: 'i18n_tab_url_copy',
                                                  })}
                                            </Button>
                                            <Button
                                              className={`${
                                                styles.linkButton
                                              } ${
                                                event.disabledManyTimeLink ||
                                                !event.status
                                                  ? styles.disabledBtn
                                                  : ''
                                              }`}
                                              onClick={() => {
                                                if (
                                                  checkUserExpired(
                                                    item.has_member_expired,
                                                  )
                                                ) {
                                                  return;
                                                }
                                                if (
                                                  event.vote &&
                                                  event.vote.is_finished
                                                ) {
                                                  setIdEventTeam(event.id);
                                                  setTeamID(event.team_id);
                                                  setStateModal(true);
                                                  setIsShowModal({
                                                    deleteTeam: false,
                                                    deleteEventVote: false,
                                                    cloneEventVoted: true,
                                                  });
                                                } else {
                                                  if (
                                                    checkUserExpired(
                                                      item?.has_member_expired,
                                                    )
                                                  ) {
                                                    return;
                                                  }

                                                  if (
                                                    !isTeam(eventTem) &&
                                                    profile?.id !==
                                                      eventTem.id &&
                                                    !isAdminContract
                                                  ) {
                                                    return notify();
                                                  }

                                                  try {
                                                    const fullUrl = event.vote.full_url.split(
                                                      '=',
                                                    )[
                                                      event.vote.full_url.split(
                                                        '=',
                                                      ).length - 1
                                                    ];
                                                    history.push({
                                                      pathname:
                                                        '/invite-member',
                                                      search: `?id=${event.vote.slug}&name=${fullUrl}`,
                                                    });
                                                  } catch (error) {
                                                    notify(
                                                      formatMessage({
                                                        id:
                                                          'i18n_you_have_been_delete_from_team',
                                                      }),
                                                    );
                                                    history.push('/');
                                                  }
                                                }
                                              }}
                                              disabled={
                                                event.disabledManyTimeLink ||
                                                !event.status
                                              }
                                              loading={
                                                event.copyManyTimeLinkLoading
                                              }
                                            >
                                              {formatMessage({
                                                id: 'i18n_tab_send_menu',
                                              })}
                                            </Button>
                                            <Button
                                              className={`${
                                                styles.linkButton
                                              } ${
                                                event.disabledManyTimeLink ||
                                                !event.status
                                                  ? styles.disabledBtn
                                                  : ''
                                              }`}
                                              onClick={async () => {
                                                if (
                                                  checkUserExpired(
                                                    item?.has_member_expired,
                                                  )
                                                ) {
                                                  return;
                                                }

                                                if (
                                                  !isTeam(item) &&
                                                  profile?.id !== item.id &&
                                                  !isAdminContract
                                                ) {
                                                  return notify();
                                                }

                                                let role = false;
                                                if (
                                                  !(
                                                    profile?.id === item.id ||
                                                    item.is_admin ||
                                                    listPaginateTeam.is_admin_contract ||
                                                    checkRole ||
                                                    (listCheckRole.find(
                                                      check =>
                                                        check.team_id ===
                                                        item.id,
                                                    ) &&
                                                      listCheckRole.find(
                                                        check =>
                                                          check.team_id ===
                                                          item.id,
                                                      ).is_admin)
                                                  ) ||
                                                  event.disabledManyTimeLink ||
                                                  !event.status
                                                ) {
                                                  role = true;
                                                }
                                                try {
                                                  const fullUrl = event.vote.full_url.split(
                                                    '=',
                                                  )[
                                                    event.vote.full_url.split(
                                                      '=',
                                                    ).length - 1
                                                  ];
                                                  history.push({
                                                    pathname: '/invite-member',
                                                    search: `?id=${event.vote.slug}&name=${fullUrl}&chooseSchedule=true&role=${role}`,
                                                  });
                                                } catch (error) {
                                                  notify(
                                                    formatMessage({
                                                      id:
                                                        'i18n_you_have_been_delete_from_team',
                                                    }),
                                                  );
                                                  history.push('/');
                                                }
                                              }}
                                              disabled={
                                                event.disabledManyTimeLink ||
                                                !event.status ||
                                                (event.vote &&
                                                  event.vote.is_finished)
                                                  ? true
                                                  : false
                                              }
                                              loading={
                                                event.copyManyTimeLinkLoading
                                              }
                                            >
                                              {formatMessage({
                                                id: 'i18n_tab_votingConfirm',
                                              })}
                                            </Button>
                                            <Dropdown
                                              overlay={() => menu(event, item)}
                                              trigger={['click']}
                                              disabled={!event.status}
                                              onVisibleChange={
                                                handleVisibleChangeSetting
                                              }
                                              onClick={() =>
                                                handleClickOptionEvent(
                                                  event.id,
                                                  index,
                                                  event.user_id,
                                                )
                                              }
                                            >
                                              <img src={pinion2} />
                                            </Dropdown>
                                          </div>
                                        </div>
                                      </Col>
                                    </>
                                  );
                                })}
                              </>
                            )}
                          </>
                        );
                      })}
                  </Row>
                  {listPaginateEvents &&
                    listPaginateEvents[0] &&
                    listPaginateEvents.map(eventTem => {
                      return (
                        <>
                          {item.id === eventTem.team_id ||
                          item.id === eventTem.id ? (
                            eventTem.data[0] ? (
                              <div className={styles.paginationTeam}>
                                <Pagination
                                  defaultCurrent={
                                    listPageIndexEvent.find(
                                      item => item.team_id === eventTem.team_id,
                                    ) &&
                                    listPageIndexEvent.find(
                                      item => item.team_id === eventTem.team_id,
                                    ).pageIndexEvent
                                  }
                                  pageSize={renderPageSize(
                                    eventTem?.per_page,
                                    eventTem?.total,
                                  )}
                                  className={`${
                                    renderCssPageSize(
                                      eventTem?.per_page,
                                      eventTem?.total,
                                    )
                                      ? styles.paginateOnePage
                                      : ''
                                  }`}
                                  total={eventTem.total}
                                  onChange={(page, pageSize) => {
                                    if (eventTem.team_id) {
                                      handleListPageIndexEvent(
                                        page,
                                        eventTem.team_id,
                                      );
                                    } else {
                                      handleListPageIndexEvent(
                                        page,
                                        eventTem.id,
                                      );
                                    }
                                  }}
                                  responsive={true}
                                />
                              </div>
                            ) : (
                              <div className={styles.dataHollow}>
                                {formatMessage({ id: 'i18n_data_hollow1' })}
                                <br />
                                {formatMessage({ id: 'i18n_data_hollow2' })}
                              </div>
                            )
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })}
                </div>
              </div>
            ))}

          {(location.query.member_all || location.query.team_all) &&
            listPaginateTeam &&
            !listPaginateTeam.data[0] && (
              <div className={styles.dataHollow} style={{ marginTop: '50px' }}>
                {formatMessage({ id: 'i18n_data_hollow1' })}
                <br />
                {formatMessage({ id: 'i18n_data_hollow2' })}
              </div>
            )}
          {IsIndividual() && (
            <Spin spinning={tabLoading}>
              <div className={styles.listHeader}>
                <Row>
                  <Col xs={12} sm={16} md={18} lg={19}>
                    <div className={styles.personalInfo}>
                      <div className={styles.avtImage}>
                        {paginateEvents.avatar ? (
                          <Avatar size={60} src={paginateEvents.avatar} />
                        ) : (
                          <Avatar
                            size={60}
                            src={logoImage}
                            className={styles.defaultAvatar}
                          />
                        )}
                      </div>
                      <div>
                        <p>{paginateEvents.team_name || paginateEvents.name}</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={6} lg={5} className={styles.antdCol}>
                    <div className={styles.rightActions}>
                      <div className={styles.creatNewBtnZone}>
                        <DropdownMenu
                          dropdownName={() => (
                            <Button
                              // onClick={() =>
                              //   paginateEvents.team_id
                              //     ? createEventType(paginateEvents.team_id)
                              //     : createEventType(paginateEvents.id)
                              // }
                              style={{ marginRight: '10px' }}
                            >
                              <span className={styles.plusIcon}>＋</span>{' '}
                              {formatMessage({ id: 'i18n_create_button' })}
                            </Button>
                          )}
                          overlay={() => menuAdd(paginateEvents)}
                          style={{
                            paddingTop: '8px',
                            right:
                              width >= 410
                                ? '0'
                                : history.location.query.team_all ||
                                  history.location.query.team_id
                                ? '-28px'
                                : '0',
                          }}
                          visible={menuAddDropdownVisible2}
                          setVisible={setMenuAddDropdownVisible2}
                        />

                        {(history.location.query.team_all ||
                          history.location.query.team_id) && (
                          <Dropdown
                            overlay={menuTeam}
                            trigger={['click']}
                            onVisibleChange={handleVisibleChangeSetting}
                            onClick={() => {
                              setTeamSlug(paginateEvents.team_slug);
                              setTeamID(Number(paginateEvents.team_id));
                              setCurrentTeam(paginateEvents);
                            }}
                          >
                            <img src={pinion2} />
                          </Dropdown>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={styles.listEventTypes}>
                <Row>
                  {paginateEvents &&
                  paginateEvents.data &&
                  paginateEvents.data.length ? (
                    paginateEvents.data.map((event, index) => (
                      <Col
                        lg={12}
                        md={24}
                        sm={24}
                        xs={24}
                        key={`event-type-${event.id}`}
                      >
                        <div className={styles.eventType}>
                          <div
                            className={styles.backgroundEdit}
                            onClick={() =>
                              editVoteItem(
                                event,
                                paginateEvents,
                                paginateEvents.has_member_expired,
                              )
                            }
                          />
                          <div className={styles.eventTypeHeader}>
                            <div className={styles.stepTitle}>
                              <div className={styles.titleIcon}>
                                <div className={styles.bolderColIcon}></div>
                                <div className={styles.normalColIcon}></div>
                              </div>
                              <Tooltip title={event.name}>
                                <h2>{event.name}</h2>
                              </Tooltip>
                            </div>
                            <Switch
                              checkedChildren="ON"
                              unCheckedChildren="OFF"
                              checked={event.status}
                              onChange={() =>
                                onSwitchChange(
                                  event,
                                  index,
                                  2,
                                  paginateEvents,
                                  paginateEvents?.has_member_expired,
                                )
                              }
                              loading={event.switchLoading}
                            />
                          </div>
                          <div className={styles.eventTypeDetail}>
                            {formatMessage({
                              id: 'i18n_meeting_format',
                            })}
                            ：{event.real_category}
                            <br />
                            {formatMessage({
                              id: 'i18n_meeting_location',
                            })}
                            ：
                            <span className={styles.meetingMethod}>
                              {meetingMethod(event)}
                            </span>
                            <br />
                            {formatMessage({
                              id: 'i18n_required_time_list_event_type',
                            })}
                            ：{event.block_number + event.move_number * 2}
                            {formatMessage({ id: 'i18n_minute' })}
                            <br />
                            {!!event.block_number && !!event.move_number ? (
                              <span className={styles.smaller_in_mobile}>
                                (
                                {formatMessage({
                                  id: 'i18n_breakdown',
                                })}
                                ：
                                {formatMessage({
                                  id: 'i18n_event_time',
                                })}
                                {event.block_number}
                                {formatMessage({
                                  id: 'i18n_minute',
                                })}
                                {' + '}
                                {formatMessage({
                                  id: 'i18n_move_time_double',
                                })}
                                {event.move_number * 2}
                                {formatMessage({
                                  id: 'i18n_minute',
                                })}
                                )
                              </span>
                            ) : (
                              <span className={styles.smaller_in_mobile}></span>
                            )}
                            <div className={styles.wrapperPreview}>
                              <div className={styles.previewText}>
                                <img
                                  src={userBoldIcon}
                                  className={styles.userBoldIcon}
                                />
                                {listEventVoteOne[0] ? (
                                  listEventVoteOne.map(eventVote => {
                                    if (eventVote.eventId === event.id) {
                                      return (
                                        <>
                                          {eventVote.totalVoters}{' '}
                                          {formatMessage({
                                            id: 'i18n_tab_preview_text_in',
                                          })}{' '}
                                          {eventVote.confirmedVoters}{' '}
                                          {formatMessage({
                                            id: 'i18n_tab_preview_text_after',
                                          })}
                                        </>
                                      );
                                    }
                                  })
                                ) : (
                                  <>
                                    0{' '}
                                    {formatMessage({
                                      id: 'i18n_tab_preview_text_in',
                                    })}{' '}
                                    0{' '}
                                    {formatMessage({
                                      id: 'i18n_tab_preview_text_after',
                                    })}
                                  </>
                                )}
                              </div>
                              <Button
                                className={styles.previewButton}
                                disabled={!event.status}
                                onClick={() =>
                                  onPreview(
                                    event.vote,
                                    event.id,
                                    index,
                                    paginateEvents?.has_member_expired,
                                  )
                                }
                              >
                                {formatMessage({
                                  id: 'i18n_preview',
                                })}
                              </Button>
                            </div>
                          </div>
                          <div className={styles.linkButtonZone}>
                            <Button
                              className={`${
                                styles.linkButton
                              } ${event.choosenOnceLink &&
                                styles.savedLinkButton} ${
                                event.disabledOnceLink || !event.status
                                  ? styles.disabledBtn
                                  : ''
                              } `}
                              onClick={() => {
                                if (
                                  checkUserExpired(
                                    paginateEvents?.has_member_expired,
                                  )
                                ) {
                                  return;
                                }

                                if (event.vote && event.vote.is_finished) {
                                  setIdEventTeam(event.id);
                                  setTeamID(paginateEvents.team_id);
                                  setStateModal(true);
                                  setIsShowModal({
                                    deleteTeam: false,
                                    deleteEventVote: false,
                                    cloneEventVoted: true,
                                  });
                                } else {
                                  copyLink1(event, null, paginateEvents);
                                }
                              }}
                              disabled={event.disabledOnceLink || !event.status}
                              loading={event.copyOnceLoading}
                            >
                              {event.choosenOnceLink
                                ? formatMessage({
                                    id: 'i18n_copied',
                                  })
                                : formatMessage({
                                    id: 'i18n_tab_url_copy',
                                  })}
                            </Button>
                            <Button
                              className={`${styles.linkButton} ${
                                event.disabledManyTimeLink || !event.status
                                  ? styles.disabledBtn
                                  : ''
                              }`}
                              onClick={() => {
                                if (
                                  checkUserExpired(
                                    paginateEvents?.has_member_expired,
                                  )
                                ) {
                                  return;
                                }

                                if (event.vote && event.vote.is_finished) {
                                  setIdEventTeam(event.id);
                                  setTeamID(paginateEvents.team_id);
                                  setStateModal(true);
                                  setIsShowModal({
                                    deleteTeam: false,
                                    deleteEventVote: false,
                                    cloneEventVoted: true,
                                  });
                                } else {
                                  if (
                                    checkUserExpired(
                                      paginateEvents?.has_member_expired,
                                    )
                                  ) {
                                    return;
                                  }

                                  if (
                                    !isTeam(paginateEvents) &&
                                    profile?.id !== paginateEvents.id &&
                                    !isAdminContract
                                  ) {
                                    return notify();
                                  }

                                  try {
                                    const fullUrl = event.vote.full_url.split(
                                      '=',
                                    )[
                                      event.vote.full_url.split('=').length - 1
                                    ];
                                    history.push({
                                      pathname: '/invite-member',
                                      search: `?id=${event.vote.slug}&name=${fullUrl}`,
                                    });
                                  } catch (error) {
                                    notify(
                                      formatMessage({
                                        id:
                                          'i18n_you_have_been_delete_from_team',
                                      }),
                                    );
                                    history.push('/');
                                  }
                                }
                              }}
                              disabled={
                                event.disabledManyTimeLink || !event.status
                              }
                              loading={event.copyManyTimeLinkLoading}
                            >
                              {formatMessage({
                                id: 'i18n_tab_send_menu',
                              })}
                            </Button>
                            <Button
                              className={`${styles.linkButton} ${
                                event.disabledManyTimeLink || !event.status
                                  ? styles.disabledBtn
                                  : ''
                              }`}
                              onClick={() =>
                                copyManyLinkVote(event, paginateEvents)
                              }
                              disabled={
                                event.disabledManyTimeLink ||
                                !event.status ||
                                (event.vote && event.vote.is_finished)
                              }
                              loading={event.copyManyTimeLinkLoading}
                            >
                              {formatMessage({
                                id: 'i18n_tab_votingConfirm',
                              })}
                            </Button>
                            <Dropdown
                              overlay={() => menu(event, paginateEvents)}
                              trigger={['click']}
                              disabled={!event.status}
                              onVisibleChange={handleVisibleChangeSetting}
                              onClick={() =>
                                handleClickOptionEvent(
                                  event.id,
                                  index,
                                  event.user_id,
                                )
                              }
                            >
                              <img src={pinion2} />
                            </Dropdown>
                          </div>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <div className={styles.dataHollow}>
                      {formatMessage({ id: 'i18n_data_hollow1' })}
                      <br />
                      {formatMessage({ id: 'i18n_data_hollow2' })}
                    </div>
                  )}
                </Row>
                {paginateEvents && (
                  <div className={styles.paginationTeam}>
                    <Pagination
                      defaultCurrent={pageIndexEvent}
                      pageSize={renderPageSize(
                        paginateEvents?.per_page,
                        paginateEvents?.total,
                      )}
                      className={`${
                        renderCssPageSize(
                          paginateEvents?.per_page,
                          paginateEvents?.total,
                        )
                          ? styles.paginateOnePage
                          : ''
                      }`}
                      total={paginateEvents.total}
                      onChange={(page, pageSize) => handlePageIndexEvent(page)}
                      responsive={true}
                    />
                  </div>
                )}
              </div>
            </Spin>
          )}
          {(location.query.member_all || location.query.team_all) &&
            listPaginateTeam &&
            !location.query.team_id && (
              <div className={styles.paginationTeam}>
                <Pagination
                  defaultCurrent={pageIndex}
                  pageSize={renderPageSize(
                    listPaginateTeam?.per_page,
                    listPaginateTeam?.total,
                  )}
                  className={`${
                    renderCssPageSize(
                      listPaginateTeam?.per_page,
                      listPaginateTeam?.total,
                    )
                      ? styles.paginateOnePage
                      : ''
                  }`}
                  total={listPaginateTeam.total}
                  onChange={(page, pageSize) => setPageIndex(page)}
                  responsive={true}
                />
              </div>
            )}

          <Modal visible={modalState} closable={false} footer={null}>
            {(isShowModal.deleteEventVote || isShowModal.deleteTeam) && (
              <div className={styles.modalDelete}>
                <div className={styles.modalTitle}>
                  {formatMessage({ id: 'i18n_title_delete_event_type' })}
                </div>
                <div className={styles.btnGroup}>
                  <Button
                    onClick={() => handleCancel()}
                    className="btn btnWhite"
                  >
                    {formatMessage({ id: 'i18n_cancel_delete' })}
                  </Button>
                  <Button onClick={() => handleOk()} className="btn btnGreen">
                    {formatMessage({ id: 'i18n_confirm_delete_event' })}
                  </Button>
                </div>
              </div>
            )}
            {isShowModal.cloneEventVoted && (
              <div className={styles.modalDelete}>
                <div className={styles.modalDescription}>
                  {formatMessage({ id: 'i18n_schedule_finished_notification' })}
                </div>
                <div className={styles.btnGroup}>
                  <Button
                    onClick={() => handleCancel()}
                    className="btn btnWhite"
                  >
                    {formatMessage({ id: 'i18n_cancel_delete' })}
                  </Button>
                  <Button
                    onClick={() =>
                      history.push({
                        pathname: '/calendar-creation',
                        search: `?idEvent=${idEventTeam}&clone=1&relationship_type=${TYPE_VOTE_RELATIONSHIP}&member_id=${memberId}`,
                      })
                    }
                    className="btn btnGreen"
                  >
                    {formatMessage({ id: 'i18n_confirm_delete_event' })}
                  </Button>
                </div>
              </div>
            )}
          </Modal>
          <TimeToEmailModal
            profile={profile}
            visible={timeToEmailModal}
            closeModal={() => setTimeToEmailModal(false)}
          />
        </Spin>
      </div>
      <Footer />
    </div>
  );
}

export default connect(({ EVENT, TAB, TEAM }) => ({
  eventStore: EVENT,
  tabStore: TAB,
  teamStore: TEAM,
}))(withRouter(ListTab));
