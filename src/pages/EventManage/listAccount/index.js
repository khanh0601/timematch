import logoCalendar from '@/assets/images/calendar.png';
import logoCheckSuccess from '@/assets/images/check-success.png';
import pinion2 from '@/assets/images/i-pinion-2.svg';
import logoImage from '@/assets/images/logo-black.svg';
import logoUserGroup from '@/assets/images/user-group.png';
import { copyFormatted, copyText } from '@/commons/function';
import {
  getJPMonthAndDay,
  meetingMethod,
  filterReceptionTime,
  canStartAt,
  groupBy,
  splitRange,
  isOverlap,
  checkEventBooked,
  notify,
  createTimeAsync,
} from '@/commons/function.js';
import Footer from '@/components/Footer';
import EmbedModal from '@/components/modals/EmbedModal';
import TimeToEmailModal from '@/components/TimeToEmailModal';
import config from '@/config';
import moment from 'moment';

import {
  DOW_NAME,
  EVENT_RELATIONSHIP_TYPE,
  FULL_DATE_TIME,
  TYPE_EVENT_RELATIONSHIP,
  TYPE_VOTE_RELATIONSHIP,
  FORMAT_DATE,
  YYYYMMDD,
  YYYYMMDDTHHmm,
} from '@/constant';
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
import React, { useEffect, useState } from 'react';
import { history, useIntl, withRouter } from 'umi';
import styles from './styles.less';
import DropdownMenu from '@/components/DropdownMenu';
import useWindowDimensions from '@/commons/useWindowDimensions';
import {
  generateCodeCopy,
  isExpired,
  personalExpiredModal,
  renderCssPageSize,
  renderPageSize,
} from '../../../commons/function';

function ListAccount(props) {
  const { location, dispatch, eventStore, accountTeamStore, teamStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    totalPersonalEventType,
    listFreeDay,
    currentEvent,
    firstSetupFreeTime,
    eventCustomizeDates,
    guestEventClients,
    isLoading,
  } = eventStore;
  const {
    tabLoading,
    listPaginateTeam,
    listPaginateEvents,
    paginateEvents,
  } = accountTeamStore;
  const { listTeam } = teamStore;
  const { width } = useWindowDimensions();

  const [profile, setProfile] = useState({});
  const [modalState, setStateModal] = useState(false);
  const [idEvent, setId] = useState(0);
  const [memberId, setMemberId] = useState(0);
  const [indexTeam, setIndexTeam] = useState(-1);
  const [linkUrl, setLinkUrl] = useState('');
  const pageSize = 4;
  const [pageIndex, setPageIndex] = useState(1);
  const [listPageIndexEvent, setListPageIndexEvent] = useState([]);
  const [pageIndexEvent, setPageIndexEvent] = useState(1);
  const [timeToEmailModal, setTimeToEmailModal] = useState(false);
  const [teamSlug, setTeamSlug] = useState(null);
  const [teamID, setTeamID] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);

  // embed modal
  const [isEmbedModalVisible, setIsEmbedModalVisible] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [listCheckRole, setListCheckRole] = useState([]);
  const [isAdminContract, setIsAdminContract] = useState(false);
  const [isUrlMulti, setUrlMulti] = useState(false);

  useEffect(() => {
    getProfile();
    getEventTemplate();
  }, []);

  const getEventTemplate = () => {
    dispatch({ type: 'EVENT/getEventTemplate', payload: {} });
  };

  useEffect(() => {
    const { query } = location;
    const payload = {
      user_id_of_member: Number(query.member_id) || profile?.id,
      page: 1,
      page_size: 2,
      relationship_type: 1,
      team_id: Number(query.team_id) || null,
    };
    dispatch({
      type: 'ACCOUNT_TEAM/getOnePaginateEvents',
      payload,
    });
  }, [location.query.member_id, location.query.team_id]);

  useEffect(() => {
    const { member_id, team_id, team_all, member_all } = location.query;
    if (member_id || member_all) {
      getList();
    } else if (team_id || team_all) {
      getListTeam();
    } else {
      getList();
    }
  }, [
    pageIndex,
    location.query.member_id,
    location.query.member_all,
    location.query.team_all,
    // location.query.team_id,
  ]);

  useEffect(() => {
    if (location.query.member_all || location.query.team_all) {
      const temListPageIndexEvent = [];
      listPaginateTeam &&
        listPaginateTeam.data.map(item => {
          temListPageIndexEvent.push({
            pageIndexEvent: 1,
            user_id_of_member: location.query.member_all ? item.id : null,
            team_id: location.query.team_all ? item.id : null,
          });
        });
      setListPageIndexEvent(temListPageIndexEvent);
    }

    if (listPaginateTeam) {
      if (listPaginateTeam.is_admin_contract) {
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
                is_admin: temCheckRole.is_admin ? true : false,
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

  const getList = async (pageIndexValue = null) => {
    const payload = {
      page: pageIndexValue !== null ? pageIndexValue : pageIndex,
      has_pagination: true,
    };
    await dispatch({ type: 'ACCOUNT_TEAM/getPaginateMember', payload });
  };
  const getListTeam = async (pageIndexValue = null) => {
    const payload = {
      relationship_type: EVENT_RELATIONSHIP_TYPE.oneToGroup,
      page_size: pageSize,
      page: pageIndexValue !== null ? pageIndexValue : pageIndex,
    };
    await dispatch({ type: 'ACCOUNT_TEAM/getPaginateTeam', payload });
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
  function showModal(id, member_expired) {
    if (checkUserExpired(member_expired)) {
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
        if (id === eventItem.id || id === eventItem.team_id) {
          setStateModal(true);
        }
      });
    } else {
      paginateEvents.data.map(eventItem => {
        if (id === eventItem.id || id === eventItem.team_id) {
          setStateModal(true);
        }
      });
    }
  }

  const handleClickTimeToEmail = member_expired => {
    if (checkUserExpired(member_expired)) {
      return;
    }
    setTimeToEmailModal(true);
  };

  async function handleOk() {
    // is delete event
    setStateModal(false);

    if (teamID) {
      await dispatch({
        type: 'ACCOUNT_TEAM/deletePaginateTeam',
        payload: { team_id: teamID },
      });

      setTeamSlug(null);
      setTeamID(null);
    } else {
      await dispatch({
        type: 'EVENT/deleteEventType',
        payload: { eventTypeId: idEvent },
      });
    }
    // success
    const { query } = location;
    if (
      query.member_id ||
      (!location.query.team_all && !location.query.member_all)
    ) {
      const payload = {
        user_id_of_member: Number(query.member_id) || profile?.id,
        page: 1,
        page_size: 2,
        relationship_type: 1,
      };
      dispatch({
        type: 'ACCOUNT_TEAM/getOnePaginateEvents',
        payload,
      });
    } else if (query.team_id) {
      const payload = {
        page: 1,
        page_size: 2,
        relationship_type: 1,
        team_id: Number(query.team_id),
      };
      dispatch({
        type: 'ACCOUNT_TEAM/getOnePaginateEvents',
        payload,
      });
    } else {
      if (totalPersonalEventType % pageSize === 1) {
        if (location.query.member_id || location.query.member_all) {
          getList(pageIndex - 1);
        } else if (location.query.team_id || location.query.team_all) {
          getListTeam(pageIndex - 1);
        } else {
          getList(pageIndex - 1);
        }
      } else {
        if (location.query.member_id || location.query.member_all) {
          getList();
        } else if (location.query.team_id || location.query.team_all) {
          getListTeam();
        } else {
          getList();
        }
      }
    }
  }

  function handleCancel() {
    setStateModal(false);
    setTeamSlug(null);
    setTeamID(null);
  }
  function cloneEvent(member_expired) {
    if (checkUserExpired(member_expired)) {
      return;
    }
    history.push(
      `/calendar-creation?idEvent=${idEvent}&clone=1&relationship_type=${TYPE_EVENT_RELATIONSHIP}&member_id=${memberId}`,
    );
  }
  function editEvent(member_expired) {
    if (checkUserExpired(member_expired)) {
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

    history.push(
      `/calendar-creation?idEvent=${idEvent}&edit=true&relationship_type=${TYPE_EVENT_RELATIONSHIP}&member_id=${memberId}`,
    );
  }

  const handleCopyLatestBlockTime = async (member_expired, isManual) => {
    if (checkUserExpired(member_expired)) {
      return;
    }
    const onceCode = await dispatch({
      type: 'EVENT/generateOnceEventCode',
      payload: { event_id: idEvent },
    });

    const breakResult = generateValidTimeForCopy(currentEvent);

    let listTime = '';

    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1) {
      if (ua.indexOf('chrome') > -1) {
        for (let i = 0; i < breakResult.length; i++) {
          const item = breakResult[i];
          listTime += `<div>${
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
          ).format('HH:mm')}\r</div>`;
        }
        copyFormatted(
          `<div>
              <div>
                ${listTime}
              </div>
              <div>
                ※最新の日程は ${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode}&once=true" をご確認ください。
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
          copyText(
            listTime +
              `※最新の日程は ${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode}&once=true をご確認ください。`,
          );
        }, 0);
      }
    }
    if (ua.indexOf('firefox') !== -1) {
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
        copyText(
          listTime +
            `※最新の日程は ${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode}&once=true をご確認ください。`,
        );
      }, 0);
    }
    message.success(formatMessage({ id: 'i18n_copy_latest_block_success' }));
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

  // const handleCopyUrl = async (event, index, member_expired) => {
  //   const {
  //     id,
  //     name,
  //     event_code,
  //     block_name,
  //     location_name,
  //     user_id,
  //     is_manual_setting,
  //   } = event;
  //   if (checkUserExpired(member_expired)) {
  //     return;
  //   }
  //   // handleClickOptionEvent(id, index, event_code, user_id)
  //
  //   // get code once
  //   const onceCode = await dispatch({
  //     type: 'EVENT/generateOnceEventCode',
  //     payload: { event_id: id },
  //   });
  //   let payloadBlockTime = {
  //     id,
  //     urlCopy: `${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode}&once=true`,
  //     nameEvent: name,
  //     block_name,
  //     location_name,
  //   };
  //   if (!is_manual_setting) {
  //     const { startTime, endTime } = createTimeAsync();
  //
  //     await dispatch({
  //       type: 'EVENT/getGuestEventClient',
  //       payload: {
  //         event_code: onceCode,
  //         need_sync: false,
  //         start: startTime,
  //         end: endTime,
  //       },
  //     });
  //   }
  //
  //   const breakResult = generateValidTimeForCopy(currentEvent);
  //   payloadBlockTime.listBlockTime = breakResult.map(item => {
  //     item.timeFormat = formatTime(item);
  //     return item;
  //   });
  //   dispatch({
  //     type: 'EVENT/setCalendarCopyUrl',
  //     payload: payloadBlockTime,
  //   });
  //   history.push('/calendar-creation-copy');
  // };

  const checkUserExpired = (member_expired, web_embedded) => {
    const { team_all, team_id } = location.query;
    let prevent;
    if (team_all || team_id || web_embedded) {
      if (isExpired() || member_expired) {
        personalExpiredModal();
        prevent = true;
      }
    }
    return prevent;
  };

  /**
   *
   */
  const generateEmbedCode = (member_expired, web_embedded) => {
    if (checkUserExpired(member_expired, web_embedded)) {
      return;
    }
    if (IsIndividual()) {
      setEmbedUrl(
        `${
          config.WEB_DOMAIN
        }/schedule-adjustment/many?event_code=${linkUrl}&user_code=${
          paginateEvents.data.find(eventType => eventType.id === idEvent).user
            .code
        }`,
      );
    }

    if (IsAll()) {
      setEmbedUrl(
        `${
          config.WEB_DOMAIN
        }/schedule-adjustment/many?event_code=${linkUrl}&user_code=${
          listPaginateEvents[indexTeam].data.find(
            eventType => eventType.id === idEvent,
          ).user.code
        }`,
      );
    }
    setIsEmbedModalVisible(true);
  };

  const menu = (member_expired, isManual) => (
    <Menu className={styles.eventTypeOption}>
      <Menu.Item key="0" className={styles.greyHover}>
        <div onClick={() => editEvent(member_expired)}>
          {formatMessage({ id: 'i18n_edit' })}
        </div>
      </Menu.Item>
      <Menu.Item key="1" className={styles.greyHover}>
        <div onClick={() => cloneEvent(member_expired)}>
          {formatMessage({ id: 'i18n_copy' })}
        </div>
      </Menu.Item>
      <Menu.Item key="2" className={styles.greyHover}>
        <div onClick={() => showModal(idEvent, member_expired)}>
          {formatMessage({ id: 'i18n_delete' })}
        </div>
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => handleClickTimeToEmail(member_expired)}
        className={styles.greyHover}
      >
        <div>{formatMessage({ id: 'i18n_copy_link_to_email' })}</div>
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() => handleCopyLatestBlockTime(member_expired, isManual)}
        className={styles.greyHover}
      >
        <div>{formatMessage({ id: 'i18n_copy_schedule_date' })} </div>
      </Menu.Item>
      <Menu.Item
        key="5"
        onClick={() => generateEmbedCode(member_expired, true)}
        className={styles.greyHover}
      >
        <div>{formatMessage({ id: 'i18n_embed_in_website' })}</div>
      </Menu.Item>
    </Menu>
  );

  const menuTeam = () => (
    <Menu className={styles.eventTypeOption}>
      <Menu.Item key="0" className={styles.greyHover}>
        <div onClick={() => editEventTeam()}>編集する</div>
      </Menu.Item>
      <Menu.Item key="1" className={styles.greyHover}>
        <div onClick={removeTeam}>
          {formatMessage({ id: 'i18n_remove_team' })}
        </div>
      </Menu.Item>
    </Menu>
  );

  const editEventTeam = () => {
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
    // setTeamSlug(null);
  };

  const removeTeam = () => {
    if (!currentTeam) {
      return;
    }

    if (!isAdminContract && !isAdminTeam(currentTeam)) {
      return notify();
    }

    // show modal remote team
    setStateModal(true);
  };

  const copyLink = async (linkUrl, id, once = true, index, team_expired) => {
    let onceCode = generateCodeCopy(linkUrl);

    if (checkUserExpired(team_expired)) {
      return;
    }

    // copy link use many
    if (!once) {
      if (
        location.query.member_id ||
        location.query.team_id ||
        (!location.query.team_all && !location.query.member_all)
      ) {
        setTimeout(() => {
          copyText(
            `${
              config.WEB_DOMAIN
            }/schedule-adjustment/many?event_code=${linkUrl}&user_code=${
              paginateEvents.data.find(eventType => eventType.id === id).user
                .code
            }`,
          );
        }, 0);

        const result = paginateEvents.data.map(eventType => {
          if (eventType.id === id) {
            eventType.choosenManyTimeLink = true;
            eventType.disabledOnceLink = true;
          } else {
            eventType.disabledOnceLink = true;
            eventType.disabledManyTimeLink = true;
          }
          return eventType;
        });
        await dispatch({
          type: 'ACCOUNT_TEAM/setOnePaginateEvents',
          payload: { ...paginateEvents, data: result },
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
            type: 'ACCOUNT_TEAM/setOnePaginateEvents',
            payload: { ...paginateEvents, data: final },
          });
        }, 1000);
        return;
      }

      setTimeout(() => {
        copyText(
          `${
            config.WEB_DOMAIN
          }/schedule-adjustment/many?event_code=${linkUrl}&user_code=${
            listPaginateEvents[index].data.find(
              eventType => eventType.id === id,
            ).user.code
          }`,
        );
      }, 0);

      const result = listPaginateEvents[index].data.map(eventType => {
        if (eventType.id === id) {
          eventType.choosenManyTimeLink = true;
          eventType.disabledOnceLink = true;
        } else {
          eventType.disabledOnceLink = true;
          eventType.disabledManyTimeLink = true;
        }
        return eventType;
      });
      let temListPaginateEvents = [...listPaginateEvents];
      temListPaginateEvents[index].data = result;
      await dispatch({
        type: 'ACCOUNT_TEAM/setListPaginateEvents',
        payload: temListPaginateEvents,
      });

      await setTimeout(() => {
        const final = listPaginateEvents[index].data.map(eventType => {
          eventType.choosenOnceLink = false;
          eventType.choosenManyTimeLink = false;
          eventType.disabledOnceLink = false;
          eventType.disabledManyTimeLink = false;
          return eventType;
        });
        let temListPaginateEvents = [...listPaginateEvents];
        temListPaginateEvents[index].data = final;
        dispatch({
          type: 'ACCOUNT_TEAM/setListPaginateEvents',
          payload: temListPaginateEvents,
        });
      }, 1000);
      return;
    }

    // copy link use once
    if (
      location.query.member_id ||
      location.query.team_id ||
      (!location.query.team_all && !location.query.member_all)
    ) {
      const payload = {
        event_id: id,
      };
      const result = paginateEvents.data.map(eventType => {
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
        type: 'ACCOUNT_TEAM/setOnePaginateEvents',
        payload: { ...paginateEvents, data: result },
      });
      // let onceCode = await dispatch({
      //   type: 'EVENT/generateOnceEventCode',
      //   payload,
      // });

      copyText(
        `${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode}&once=true`,
      );
      // save code event use once
      await dispatch({
        type: 'EVENT/createEventCodeCopy',
        payload: {
          event_code: onceCode,
          event_id: id,
        },
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
          type: 'ACCOUNT_TEAM/setOnePaginateEvents',
          payload: { ...paginateEvents, data: final },
        });
      }, 1000);
      return;
    }

    const payload = {
      event_id: id,
    };
    const result = listPaginateEvents[index].data.map(eventType => {
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
    temListPaginateEvents[index].data = result;
    await dispatch({
      type: 'ACCOUNT_TEAM/setListPaginateEvents',
      payload: temListPaginateEvents,
    });
    // let onceCode = await dispatch({
    //   type: 'EVENT/generateOnceEventCode',
    //   payload,
    // });

    // setTimeout(() => {
    copyText(
      `${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode}&once=true`,
    );

    // save code event use once
    await dispatch({
      type: 'EVENT/createEventCodeCopy',
      payload: {
        event_code: onceCode,
        event_id: id,
      },
    });

    // }, 0);

    await setTimeout(() => {
      const final = listPaginateEvents[index].data.map(eventType => {
        eventType.choosenOnceLink = false;
        eventType.choosenManyTimeLink = false;
        eventType.disabledOnceLink = false;
        eventType.disabledManyTimeLink = false;
        return eventType;
      });
      let temListPaginateEvents = [...listPaginateEvents];
      temListPaginateEvents[index].data = final;
      dispatch({
        type: 'ACCOUNT_TEAM/setListPaginateEvents',
        payload: temListPaginateEvents,
      });
    }, 1000);
  };
  const onSwitchChange = async (value, index, type, item, member_expired) => {
    if (checkUserExpired(member_expired)) {
      return;
    }
    const member_id = location.query.member_id;
    const team_id = location.query.team_id;
    const team_all = location.query.team_all;
    const member_all = location.query.member_all;

    if (!isAdminOrOwnerOfEvent(item, value)) {
      return notify();
    }

    dispatch({ type: 'ACCOUNT_TEAM/setLoading', payload: true });
    const payload = {
      eventTypeId: value.id,
      status: !value.status,
      tab: 1,
      member_id,
      team_id,
      team_all,
      member_all,
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
          type: 'ACCOUNT_TEAM/setListPaginateEvents',
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
          type: 'ACCOUNT_TEAM/setOnePaginateEvents',
          payload: { ...paginateEvents, data: result },
        });
      }
    }
    dispatch({ type: 'ACCOUNT_TEAM/setLoading', payload: false });
  };
  const createEventType = (item, click_event) => {
    const { has_member_expired, id } = item;
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

    const { team_all, team_id } = location.query;

    if (team_all || team_id) {
      history.push(
        `/calendar-creation?relationship_type=${
          menu[click_event['key']].type
        }&team_id=${id}&member_id=${memberId}&isOneTime=${
          menu[click_event['key']].isOneTime
        }`,
      );
    } else
      history.push(
        `/calendar-creation?relationship_type=${
          menu[click_event['key']].type
        }&member_id=${id}&isOneTime=${menu[click_event['key']].isOneTime}`,
      );
  };

  const onPreview = (eventType, member_expired) => {
    if (checkUserExpired(member_expired)) {
      return;
    }
    history.push(
      `/preview?event_code=${eventType.event_code}&user_code=${eventType.user.code}`,
    );
  };

  const handleClickOptionEvent = async (
    id,
    index,
    linkUrl,
    memberId,
    setCopyUrl,
  ) => {
    setId(id);
    setIndexTeam(index);
    setLinkUrl(linkUrl);
    setMemberId(memberId);

    let event = null;
    if (IsIndividual()) {
      event = paginateEvents.data.find(item => item.id === id);
      await dispatch({ type: 'EVENT/updateCurrentEvent', payload: event });
    } else {
      event = listPaginateEvents[index].data.find(item => item.id === id);
      await dispatch({ type: 'EVENT/updateCurrentEvent', payload: event });
    }

    // fetch data for generate
    dispatch({
      type: 'EVENT/getListFreeDaySuccess',
      payload: event.event_datetimes || [],
    });

    // loading data for auto mode
    if (!event.is_manual_setting) {
      const payload = {
        event_code: event.event_code,
      };
      dispatch({ type: 'EVENT/getListFreedayByEvent', payload: event.id });

      dispatch({ type: 'EVENT/getEventCustomizeDates', payload });

      dispatch({ type: 'EVENT/getFreeTimeByGuest', payload });

      const { startTime, endTime } = createTimeAsync(null, 28);
      // get all A schedule calendar
      // getGuestEventClient
      dispatch({
        type: 'EVENT/getGuestEventClient',
        payload: {
          ...payload,
          user_code: event.user.code,
          need_sync: true,
          start: startTime,
          end: endTime,
        },
      });
    }
  };

  // hide page copy url
  const handleCopyUrl = async (event, index, member_expired, urlMulti) => {
    const {
      id,
      name,
      event_code,
      block_name,
      location_name,
      user_id,
      is_manual_setting,
    } = event;
    if (checkUserExpired(member_expired)) {
      return;
    }
    if (urlMulti) {
      setUrlMulti(true);
    }
    handleClickOptionEvent(id, index, event_code, user_id);
  };

  // ==================START AUTO GENERATE TOOLS==================
  const generateValidTimeForCopy = (eventInfo, maxBlock = 5, maxPerDay = 2) => {
    let results = [];

    // group by date
    let freeDayGroupByDate = [];
    if (listFreeDay.length) {
      freeDayGroupByDate = groupBy('dateStr')(listFreeDay);
    }

    let members = [];
    let eventBooked = [];
    if (guestEventClients && guestEventClients.length) {
      members = guestEventClients.map(e => {
        eventBooked.push(...e.events);
        return {
          option: e.option,
          checked: true,
          id: e.email,
        };
      });
    }

    const currentStartWeekDate = moment();
    let i = 0;

    if (
      eventInfo.reservation_number &&
      eventInfo.reservation_number < maxBlock
    ) {
      maxBlock = eventInfo.reservation_number;
    }

    // only generate 4 week, and break if can not generate continue
    let generatedDate = 0;
    // max block is max day
    while (generatedDate < maxBlock && i < 28) {
      const validDate = moment(currentStartWeekDate)
        .add(i++, 'd')
        .format(FORMAT_DATE);
      let validBlocks = freeDayGroupByDate[validDate];
      if (validBlocks && validBlocks.length) {
        // filter disable event_datetime
        validBlocks = validBlocks.filter(item => {
          return (
            item.status &&
            moment()
              .add(eventInfo.move_number || 0)
              .isBefore(moment(item.start_time), 'minutes')
          );
        });
        validBlocks.map(item => {
          item.timeFormat = formatTime(item);
          item.start = moment(item.start_time).format(YYYYMMDDTHHmm);
          item.end = moment(item.end_time).format(YYYYMMDDTHHmm);
          return item;
        });

        // filter reception_start_time
        validBlocks = filterReceptionTime(
          validBlocks,
          eventInfo.reception_start_time + eventInfo.move_number || 0,
        );

        // slice max block per day
        validBlocks = validBlocks.slice(0, maxPerDay);

        if (validBlocks.length > 0) {
          generatedDate++;
        }
        results = [...results, ...validBlocks];
        continue;
      }

      // not auto generate if is manual setting
      if (eventInfo.is_manual_setting) {
        continue;
      }
      // generate by default setting
      let defaultValidBlocks = generateDefaultSettingForDate(
        validDate,
        eventInfo,
      );

      // filter checked user
      if (guestEventClients && guestEventClients.length) {
        const currentWeekEventBook = eventBooked.filter(e => {
          return moment(e.start_time).isSame(moment(validDate), 'day');
        });

        defaultValidBlocks = defaultValidBlocks.filter(e => {
          return !checkEventBooked(
            e.start_time,
            e.end_time,
            currentWeekEventBook,
            members,
          );
        });
      }
      // only gget max block per day
      defaultValidBlocks = defaultValidBlocks.slice(0, maxPerDay);

      if (defaultValidBlocks.length > 0) {
        generatedDate++;
      }

      results = [...results, ...defaultValidBlocks];
    }
    return results;
  };

  // Generate block cho 1 ngay theo setting default
  // Filter advance
  // use firstSetupFreeTime
  // use eventCustomizeDates
  const generateDefaultSettingForDate = (date, eventInfo, maxBlock) => {
    const dayOfWeek = moment(date).isoWeekday();
    const settingOfDayOfWeek = firstSetupFreeTime.find(item => {
      return item.day_of_week === dayOfWeek;
    });

    // handle customize day
    const haveCustomize = eventCustomizeDates.find(item => {
      return moment(item.date).isSame(moment(date), 'day');
    });

    let settings = {};

    if (haveCustomize) {
      if (!haveCustomize.status) {
        return [];
      }

      if (settingOfDayOfWeek) {
        settings = settingOfDayOfWeek;
      } else {
        settings.start_time = '09:00';
        settings.end_time = '18:00';
      }
    } else {
      if (!settingOfDayOfWeek || !settingOfDayOfWeek?.status) {
        return [];
      }

      settings = settingOfDayOfWeek;
    }
    // default_start_time
    // default_end_time
    let startTime = moment(`${date} ${settings.start_time}`);
    let endTime = moment(`${date} ${settings.end_time}`);

    if (eventInfo.default_start_time && eventInfo.default_end_time) {
      startTime = moment(`${date} ${eventInfo.default_start_time}`);
      endTime = moment(`${date} ${eventInfo.default_end_time}`);
    }

    let validBlocks = [];
    if (eventInfo.priority_times && eventInfo.priority_times.length) {
      eventInfo.priority_times.forEach(item => {
        let priority_start_time = moment(`${date}T${item.priority_start_time}`);
        let priority_end_time = moment(`${date}T${item.priority_end_time}`);

        let tempBlocks = splitRange(
          priority_start_time,
          priority_end_time,
          eventInfo.block_number,
          eventInfo.relax_time,
        );
        validBlocks = [...validBlocks, ...tempBlocks];
      });
    } else {
      validBlocks = splitRange(
        startTime,
        endTime,
        eventInfo.block_number,
        eventInfo.relax_time,
      );
    }

    // filter by advance
    validBlocks = validBlocks.filter((item, index) => {
      let start = moment(item.start);
      let end = moment(item.end);

      // is past time
      if (
        moment()
          .add(eventInfo.move_number || 0)
          .isAfter(start, 'minutes')
      ) {
        return false;
      }

      // reception_start_time
      if (
        !canStartAt(
          item,
          eventInfo.reception_start_time + eventInfo.move_number || 0,
        )
      ) {
        return false;
      }

      // lunch_break_start_time
      // lunch_break_end_time
      if (eventInfo.lunch_break_start_time && eventInfo.lunch_break_end_time) {
        let breakStartTime = moment(
          `${date} ${eventInfo.lunch_break_start_time}`,
        );
        let breakEndTime = moment(`${date} ${eventInfo.lunch_break_end_time}`);

        // check is duplicate with break lunch time
        const duplicate = isOverlap(breakStartTime, breakEndTime, start, end);

        return duplicate ? false : true;
      }

      return true;
    });

    // split max block
    if (maxBlock) {
      validBlocks = validBlocks.slice(0, maxBlock);
    }
    return validBlocks;
  };

  // ==================END AUTO GENERATE TOOLS==================

  const handleVisibleChangeSetting = value => {
    if (!value) {
      dispatch({ type: 'EVENT/updateIsSelectEvent', payload: false });
    }
  };

  const handleListPageIndexEvent = (index, id) => {
    let temListPageIndexEvent = [...listPageIndexEvent].map(item => {
      if (item.user_id_of_member === id || item.team_id === id) {
        item.pageIndexEvent = index;
      }
      return item;
    });
    setListPageIndexEvent(temListPageIndexEvent);
    dispatch({
      type: 'ACCOUNT_TEAM/getListPagePaginateEvents',
      payload: temListPageIndexEvent,
    });
  };

  const handlePageIndexEvent = index => {
    setPageIndexEvent(index);
    const payload = Number(location.query.team_id)
      ? {
          page: index,
          page_size: 2,
          relationship_type: 1,
          team_id: Number(location.query.team_id) || null,
        }
      : {
          user_id_of_member: paginateEvents.member_id || profile?.id,
          page: index,
          page_size: 2,
          relationship_type: 1,
        };
    dispatch({
      type: 'ACCOUNT_TEAM/getPagePaginateEvents',
      payload,
    });
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
      <Menu.Item key="2" icon={<img src={logoUserGroup} width={32} />}>
        <h4>投票ページを作成</h4>
        <p>複数社が、投票形式で日程調整できる機能</p>
      </Menu.Item>
    </Menu>
  );

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
  const canEditEvent = event => {
    if (!event) {
      return false;
    }

    return event.can_edit_or_delete_event || event.is_admin || isAdminContract;
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

  const isAdminOrOwnerOfEvent = (item, event) => {
    if (canEditEvent(item) || isAdminContract) {
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

  const [menuAddDropdownVisible, setMenuAddDropdownVisible] = useState(true);
  const [menuAddDropdownVisible2, setMenuAddDropdownVisible2] = useState(true);

  const editEventItem = (
    event,
    eventTem,
    relationship_type,
    member_expired,
  ) => {
    if (checkUserExpired(member_expired)) {
      return;
    }

    if (isAdminOrOwnerOfEvent(eventTem, event)) {
      if (event.team_id) {
        history.push(
          `/calendar-creation?idEvent=${event.id}&edit=true&relationship_type=${relationship_type}&team_id=${event.team_id}&member_id=${event.user_id}`,
        );
      } else {
        history.push(
          `/calendar-creation?idEvent=${event.id}&edit=true&relationship_type=${relationship_type}&member_id=${event.user_id}`,
        );
      }
    }
  };

  const listCssChooseOneLink = event => {
    let listCss = styles.linkButton;
    if (event.choosenOnceLink) {
      listCss += ' ' + styles.savedLinkButton;
    }
    if (event.disabledOnceLink || !event.status) {
      listCss += ' ' + styles.disabledBtn;
    }
    return listCss;
  };

  const choosePageTeam = page => {
    setPageIndex(page);
  };

  return (
    <div>
      <div className={styles.personalMeeting}>
        <Spin spinning={tabLoading || isLoading}>
          {/* START ALL MEMER OR ALL TEAM */}
          {IsAll() &&
            listPaginateTeam.data.map((item, index) => (
              <div key={index} className={index % 2 ? styles.bgWhite : ''}>
                {/* BEGIN HEADER */}
                <div className={styles.listHeader} key={index}>
                  <Row>
                    <Col xs={12} sm={16} md={18} lg={19}>
                      <div className={styles.personalInfo}>
                        <div className={styles.avtImage}>
                          <Avatar
                            size={60}
                            src={item.avatar ? item.avatar : logoImage}
                            className={`${!item.avatar &&
                              styles.defaultAvatar}`}
                          />
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
                          <>
                            <DropdownMenu
                              dropdownName={() => (
                                <Button style={{ marginRight: '10px' }}>
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
                                  setTeamID(item.id);
                                  setCurrentTeam(item);
                                }}
                              >
                                <img src={pinion2} />
                              </Dropdown>
                            )}
                          </>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                {/* END HEADER */}
                <div className={styles.listEventTypes}>
                  <Row>
                    {listPaginateEvents &&
                      listPaginateEvents.map((eventTem, index) => {
                        return (
                          <>
                            {item.id === eventTem.id && (
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
                                              editEventItem(
                                                event,
                                                eventTem,
                                                TYPE_EVENT_RELATIONSHIP,
                                                item?.has_member_expired,
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
                                                />
                                                <div
                                                  className={
                                                    styles.normalColIcon
                                                  }
                                                />
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
                                          <p className={styles.eventTypeDetail}>
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
                                              !!event.move_number && (
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
                                                  {Number(event.block_number)}
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
                                              )}
                                          </p>
                                          <div
                                            className={styles.linkButtonZone}
                                          >
                                            <Button
                                              className={listCssChooseOneLink(
                                                event,
                                              )}
                                              onClick={
                                                () =>
                                                  copyLink(
                                                    event.event_code,
                                                    event.id,
                                                    true,
                                                    index,
                                                    item?.has_member_expired,
                                                  )
                                                // handleCopyUrl(
                                                //   event,
                                                //   index,
                                                //   item?.has_member_expired,
                                                // )
                                              }
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
                                                    id: 'i18n_once_link',
                                                  })}
                                            </Button>
                                            <Button
                                              className={`${
                                                styles.linkButton
                                              } ${event.choosenManyTimeLink &&
                                                styles.savedLinkButton} ${
                                                event.disabledManyTimeLink ||
                                                !event.status
                                                  ? styles.disabledBtn
                                                  : ''
                                              }`}
                                              onClick={
                                                () =>
                                                  copyLink(
                                                    event.event_code,
                                                    event.id,
                                                    false,
                                                    index,
                                                    item?.has_member_expired,
                                                  )
                                                // handleCopyUrl(
                                                //   event,
                                                //   index,
                                                //   item?.has_member_expired,
                                                //   true,
                                                // )
                                              }
                                              disabled={
                                                event.disabledManyTimeLink ||
                                                !event.status
                                              }
                                              loading={
                                                event.copyManyTimeLinkLoading
                                              }
                                            >
                                              {event.choosenManyTimeLink
                                                ? formatMessage({
                                                    id: 'i18n_copied',
                                                  })
                                                : formatMessage({
                                                    id: 'i18n_many_time_link',
                                                  })}
                                            </Button>
                                            <Button
                                              className={styles.previewButton}
                                              disabled={!event.status}
                                              onClick={() =>
                                                onPreview(
                                                  event,
                                                  item?.has_member_expired,
                                                )
                                              }
                                            >
                                              {formatMessage({
                                                id: 'i18n_preview',
                                              })}
                                            </Button>
                                            {
                                              <Dropdown
                                                overlay={() =>
                                                  menu(
                                                    item?.has_member_expired,
                                                    event.is_manual_setting,
                                                  )
                                                }
                                                trigger={['click']}
                                                disabled={!event.status}
                                                onClick={() =>
                                                  handleClickOptionEvent(
                                                    event.id,
                                                    index,
                                                    event.event_code,
                                                    event.user_id,
                                                  )
                                                }
                                                onVisibleChange={
                                                  handleVisibleChangeSetting
                                                }
                                                overlayClassName={
                                                  styles.menuSetting
                                                }
                                              >
                                                <img src={pinion2} />
                                              </Dropdown>
                                            }
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

                  {/* START PAGINATION */}
                  {listPaginateEvents &&
                    listPaginateEvents[0] &&
                    listPaginateEvents.map(eventTem => {
                      return (
                        <>
                          {item.id === eventTem.id ? (
                            eventTem.data[0] ? (
                              <div className={styles.paginationAccount}>
                                <Pagination
                                  defaultCurrent={
                                    listPageIndexEvent.find(
                                      item => item.id === eventTem.id,
                                    ) &&
                                    listPageIndexEvent.find(
                                      item => item.id === eventTem.id,
                                    ).pageIndexEvent
                                  }
                                  pageSize={renderPageSize(
                                    eventTem?.per_page,
                                    eventTem?.total,
                                  )}
                                  total={eventTem.total}
                                  className={`${
                                    renderCssPageSize(
                                      eventTem?.per_page,
                                      eventTem?.total,
                                    )
                                      ? styles.paginateOnePage
                                      : ''
                                  }`}
                                  onChange={(page, pageSize) =>
                                    handleListPageIndexEvent(page, eventTem.id)
                                  }
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
                  {/* END PAGINATION */}
                </div>
              </div>
            ))}

          {/* END ALL MEMER OR ALL TEAM */}
          {(location.query.member_all || location.query.team_all) &&
            listPaginateTeam &&
            !listPaginateTeam.data[0] && (
              <div className={styles.dataHollow} style={{ marginTop: '50px' }}>
                {formatMessage({ id: 'i18n_data_hollow1' })}
                <br />
                {formatMessage({ id: 'i18n_data_hollow2' })}
              </div>
            )}
          {/* START MEMBER OR TEAM */}
          {IsIndividual() && (
            <Spin spinning={tabLoading}>
              <div className={styles.listHeader}>
                <Row>
                  <Col xs={12} sm={16} md={18} lg={19}>
                    <div className={styles.personalInfo}>
                      <div className={styles.avtImage}>
                        <Avatar
                          size={60}
                          src={
                            paginateEvents.avatar
                              ? paginateEvents.avatar
                              : logoImage
                          }
                          className={`${!paginateEvents.avatar &&
                            styles.defaultAvatar}`}
                        />
                      </div>
                      <div>
                        <p>{paginateEvents.name}</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={6} lg={5} className={styles.antdCol}>
                    {
                      <div className={styles.rightActions}>
                        <div className={styles.creatNewBtnZone}>
                          <DropdownMenu
                            dropdownName={() => (
                              <Button style={{ marginRight: '10px' }}>
                                <span className={styles.plusIcon}>＋</span>{' '}
                                {formatMessage({
                                  id: 'i18n_create_button',
                                })}
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
                                setTeamID(paginateEvents.id);
                                setCurrentTeam(paginateEvents);
                              }}
                            >
                              <img src={pinion2} />
                            </Dropdown>
                          )}
                        </div>
                      </div>
                    }
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
                              editEventItem(
                                event,
                                paginateEvents,
                                TYPE_EVENT_RELATIONSHIP,
                                paginateEvents?.has_member_expired,
                              )
                            }
                          />
                          <div className={styles.eventTypeHeader}>
                            <div className={styles.stepTitle}>
                              <div className={styles.titleIcon}>
                                <div className={styles.bolderColIcon} />
                                <div className={styles.normalColIcon} />
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
                          <p className={styles.eventTypeDetail}>
                            {formatMessage({ id: 'i18n_meeting_format' })}：
                            {event.real_category}
                            <br />
                            {formatMessage({ id: 'i18n_meeting_location' })}：
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
                            {!!event.block_number && !!event.move_number && (
                              <span className={styles.smaller_in_mobile}>
                                ({formatMessage({ id: 'i18n_breakdown' })}：
                                {formatMessage({ id: 'i18n_event_time' })}
                                {Number(event.block_number)}
                                {formatMessage({ id: 'i18n_minute' })}
                                {' + '}
                                {formatMessage({ id: 'i18n_move_time_double' })}
                                {event.move_number * 2}
                                {formatMessage({ id: 'i18n_minute' })})
                              </span>
                            )}
                          </p>
                          <div className={styles.linkButtonZone}>
                            <Button
                              className={listCssChooseOneLink(event)}
                              onClick={
                                () =>
                                  copyLink(
                                    event.event_code,
                                    event.id,
                                    true,
                                    index,
                                    paginateEvents?.has_member_expired,
                                  )
                                // handleCopyUrl(
                                //   event,
                                //   index,
                                //   paginateEvents?.has_member_expired,
                                // )
                              }
                              disabled={event.disabledOnceLink || !event.status}
                              loading={event.copyOnceLoading}
                            >
                              {event.choosenOnceLink
                                ? formatMessage({ id: 'i18n_copied' })
                                : formatMessage({ id: 'i18n_once_link' })}
                            </Button>
                            <Button
                              className={`${
                                styles.linkButton
                              } ${event.choosenManyTimeLink &&
                                styles.savedLinkButton} ${
                                event.disabledManyTimeLink || !event.status
                                  ? styles.disabledBtn
                                  : ''
                              }`}
                              onClick={
                                () =>
                                  copyLink(
                                    event.event_code,
                                    event.id,
                                    false,
                                    index,
                                    paginateEvents?.has_member_expired,
                                  )
                                // handleCopyUrl(
                                //   event,
                                //   index,
                                //   paginateEvents?.has_member_expired,
                                //   true,
                                // )
                              }
                              disabled={
                                event.disabledManyTimeLink || !event.status
                              }
                              loading={event.copyManyTimeLinkLoading}
                            >
                              {event.choosenManyTimeLink
                                ? formatMessage({ id: 'i18n_copied' })
                                : formatMessage({ id: 'i18n_many_time_link' })}
                            </Button>
                            <Button
                              className={styles.previewButton}
                              disabled={!event.status}
                              onClick={() =>
                                onPreview(
                                  event,
                                  paginateEvents?.has_member_expired,
                                )
                              }
                            >
                              {formatMessage({ id: 'i18n_preview' })}
                            </Button>
                            {
                              <Dropdown
                                overlay={() =>
                                  menu(
                                    paginateEvents?.has_member_expired,
                                    event.is_manual_setting,
                                  )
                                }
                                trigger={['click']}
                                disabled={!event.status}
                                onClick={() =>
                                  handleClickOptionEvent(
                                    event.id,
                                    index,
                                    event.event_code,
                                    event.user_id,
                                  )
                                }
                                onVisibleChange={handleVisibleChangeSetting}
                                overlayClassName={styles.menuSetting}
                              >
                                <img src={pinion2} />
                              </Dropdown>
                            }
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
                <div className={styles.paginationAccount}>
                  <Pagination
                    current={pageIndexEvent}
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
              </div>
            </Spin>
          )}
          {/* END MEMBER OR TEAM */}

          {/* START PAGINATION ALL MEMBER OR ALL TEAM */}
          {IsAll() && listPaginateTeam && (
            <div className={styles.paginationAccount}>
              <Pagination
                current={pageIndex}
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
                onChange={(page, pageSize) => choosePageTeam(page)}
                responsive={true}
              />
            </div>
          )}
          {/* END PAGINATION ALL MEMBER OR ALL TEAM */}

          {/* START MODAL */}
          <Modal
            visible={modalState}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={false}
            footer={null}
          >
            <div className={styles.modalDelete}>
              <div className={styles.modalTitle}>
                {formatMessage({ id: 'i18n_title_delete_event_type' })}
              </div>
              <div className={styles.btnGroup}>
                <Button onClick={() => handleCancel()} className="btn btnWhite">
                  {formatMessage({ id: 'i18n_cancel_delete' })}
                </Button>
                <Button onClick={() => handleOk()} className="btn btnGreen">
                  {formatMessage({ id: 'i18n_confirm_delete_event' })}
                </Button>
              </div>
            </div>
          </Modal>

          {/* END MODAL */}
          {timeToEmailModal && (
            <TimeToEmailModal
              profile={profile}
              visible={timeToEmailModal}
              closeModal={() => setTimeToEmailModal(false)}
            />
          )}

          <EmbedModal
            embedUrl={embedUrl}
            visible={isEmbedModalVisible}
            closeModal={() => setIsEmbedModalVisible(false)}
          />
        </Spin>
      </div>
      <Footer />
    </div>
  );
}

export default connect(({ EVENT, ACCOUNT_TEAM, TEAM }) => ({
  eventStore: EVENT,
  accountTeamStore: ACCOUNT_TEAM,
  teamStore: TEAM,
}))(withRouter(ListAccount));
