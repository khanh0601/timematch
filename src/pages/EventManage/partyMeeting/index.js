import React, { useCallback, useState, useEffect } from 'react';
import {
  Button,
  Row,
  Col,
  Switch,
  Dropdown,
  Menu,
  Modal,
  Pagination,
  Spin,
  Tooltip,
  Avatar,
  message,
} from 'antd';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import helper from '@/assets/images/imgQuestion.png';
import pinion2 from '@/assets/images/i-pinion-2.svg';
import { connect } from 'dva';
import config from '@/config';
import { meetingMethod } from '@/commons/function.js';
import logoImage from '@/assets/images/logo-black.svg';
import {
  EVENT_RELATIONSHIP_TYPE,
  FORMAT_DATE_TEXT_2,
  DOW_NAME,
  FULL_DATE_TIME,
} from '@/constant';
import TimeToEmailModal from '@/components/TimeToEmailModal';
import Footer from '@/components/Footer';
import dayjs from 'dayjs';
import { copyRichText, copyText } from '@/commons/function';
import EventTemplateModal from '@/components/EventTemplateModal';

function PartyMeeting(props) {
  const { dispatch, eventStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    listEventType,
    totalEventType,
    currentEvent,
    listFreeDay,
  } = eventStore;
  const [localListEventType, setLocalListEventType] = useState(listEventType);
  const [profile, setProfile] = useState({});
  const [modalState, setStateModal] = useState(false);
  const [idEvent, setId] = useState(0);
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [timeToEmailModal, setTimeToEmailModal] = useState(false);

  useEffect(() => {
    setLocalListEventType(listEventType);
  }, [listEventType]);

  useEffect(() => {
    getProfile();
    getEventTemplate();
    dispatch({ type: 'EVENT/backToEventTypeList', payload: {} });
  }, []);

  useEffect(() => {
    getList();
  }, [pageIndex]);

  const getEventTemplate = () => {
    dispatch({ type: 'EVENT/getEventTemplate', payload: {} });
  };

  const getList = async (pageIndexValue = null) => {
    setFetchLoading(true);
    const payload = {
      relationship_type: EVENT_RELATIONSHIP_TYPE.oneToGroup,
      page_size: pageSize,
      page: pageIndexValue !== null ? pageIndexValue : pageIndex,
    };
    await dispatch({ type: 'EVENT/getListEventType', payload });
    setFetchLoading(false);
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
  function showModal(id) {
    localListEventType.map(eventItem => {
      if (id === eventItem.id) {
        setStateModal(true);
      }
    });
  }
  async function handleOk() {
    setFetchLoading(true);
    setStateModal(false);
    const payload = {
      eventTypeId: idEvent,
    };
    const res = await dispatch({ type: 'EVENT/deleteEventType', payload });
    if (res.status === 200) {
      totalEventType % pageSize === 1 ? getList(pageIndex - 1) : getList();
    }
    setFetchLoading(false);
  }

  function handleCancel() {
    setStateModal(false);
  }
  function cloneEvent() {
    history.push(
      `/calendar-creation?idEvent=${idEvent}&clone=true&relationship_type=1`,
    );
  }
  function editEvent() {
    history.push(
      `/calendar-creation?idEvent=${idEvent}&edit=true&relationship_type=1`,
    );
  }

  const handleClickTimeToEmail = () => {
    setTimeToEmailModal(true);
  };

  const handleClickOptionEvent = id => {
    setId(id);
    const event = listEventType.find(item => item.id === id);
    dispatch({ type: 'EVENT/updateCurrentEvent', payload: event });
    const payload = {
      event_code: event.event_code,
      user_code: profile.code,
    };
    dispatch({
      type: 'EVENT/getListFreeDay',
      payload,
    });
    dispatch({
      type: 'EVENT/getGuestCalendar',
      payload,
    });
  };

  const handleCopyLatestBlockTime = async () => {
    const { relax_time = 0, reception_start_time, block_number } = currentEvent;
    const availableBefore = reception_start_time ? reception_start_time : 0;
    let breakResult = [];

    for (const item of listFreeDay) {
      const start = item.start_time;
      const end = item.end_time;
      if (dayjs(end).diff(start, 'minute') > block_number) {
        const countSubBlockTime =
          ((dayjs(end).hour() - dayjs(start).hour()) * 60) /
          (block_number + relax_time);
        for (let i = 0; i < countSubBlockTime; i++) {
          const start_time = dayjs(start)
            .add(relax_time * i + block_number * i, 'minute')
            .format(FULL_DATE_TIME);
          const end_time = dayjs(start)
            .add(relax_time * i + block_number * i + block_number, 'minute')
            .format(FULL_DATE_TIME);
          breakResult.push({
            ...item,
            start_time,
            end_time,
          });
        }
      } else {
        breakResult.push(item);
      }
    }

    breakResult = breakResult
      .filter(day => {
        return (
          day.status &&
          dayjs(day.start_time).valueOf() >
            dayjs().valueOf() + availableBefore * 60 * 1000
        );
      })
      .slice(0, 5);

    const onceCode = await dispatch({
      type: 'EVENT/generateOnceEventCode',
      payload: { event_id: idEvent },
    });

    let listTime = '';

    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
      if (ua.indexOf('chrome') > -1) {
        for (let i = 0; i < breakResult.length; i++) {
          const item = breakResult[i];
          listTime += `${dayjs()
            .day(item.day_of_week)
            .format(FORMAT_DATE_TEXT_2)} (${
            DOW_NAME[
              dayjs()
                .day(item.day_of_week)
                .day()
            ].name_jp
          }) ${dayjs(item.start_time).format('HH:mm')} ~ ${dayjs(
            item.end_time,
          ).format('HH:mm')}\r\n`;
        }
        copyRichText(
          `${listTime} ※最新の日程は ${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode}&once=true をご確認ください。\n`,
          'tool',
        );
      } else {
        for (let i = 0; i < breakResult.length; i++) {
          const item = breakResult[i];
          listTime += `${dayjs()
            .day(item.day_of_week)
            .format(FORMAT_DATE_TEXT_2)} (${
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
    }
  };

  const menu = (
    <Menu className={styles.eventTypeOption}>
      <Menu.Item key="0">
        <div onClick={() => editEvent()}>
          {formatMessage({ id: 'i18n_edit' })}
        </div>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={() => cloneEvent()}>
          {formatMessage({ id: 'i18n_copy' })}
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div onClick={() => showModal(idEvent)}>
          {formatMessage({ id: 'i18n_delete' })}
        </div>
      </Menu.Item>
      <Menu.Item key="3" onClick={handleClickTimeToEmail}>
        <div>{formatMessage({ id: 'i18n_copy_link_to_email' })}</div>
      </Menu.Item>
      <Menu.Item key="4" onClick={handleCopyLatestBlockTime}>
        <div>{formatMessage({ id: 'i18n_copy_schedule_date' })} </div>
      </Menu.Item>
    </Menu>
  );

  const copyLink = async (linkUrl, id, once = true) => {
    if (!once) {
      setTimeout(() => {
        copyText(
          `${config.WEB_DOMAIN}/schedule-adjustment/many?event_code=${linkUrl}&user_code=${profile.code}`,
        );
      }, 0);

      const result = localListEventType.map(eventType => {
        if (eventType.id === id) {
          eventType.choosenManyTimeLink = true;
          eventType.disabledOnceLink = true;
        } else {
          eventType.disabledOnceLink = true;
          eventType.disabledManyTimeLink = true;
        }
        return eventType;
      });
      setLocalListEventType(result);
    } else {
      const payload = {
        event_id: id,
      };
      const result = localListEventType.map(eventType => {
        if (eventType.id === id) {
          eventType.choosenOnceLink = true;
          eventType.disabledManyTimeLink = true;
        } else {
          eventType.disabledOnceLink = true;
          eventType.disabledManyTimeLink = true;
        }
        return eventType;
      });
      setLocalListEventType(result);
      let onceCode = await dispatch({
        type: 'EVENT/generateOnceEventCode',
        payload,
      });
      setTimeout(() => {
        copyText(
          `${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode}&once=true`,
        );
      }, 0);
    }

    setTimeout(() => {
      const final = localListEventType.map(eventType => {
        eventType.choosenOnceLink = false;
        eventType.choosenManyTimeLink = false;
        eventType.disabledOnceLink = false;
        eventType.disabledManyTimeLink = false;
        return eventType;
      });
      setLocalListEventType(final);
    }, 1000);
    return;
  };
  const setLoading = (id, type, value) => {
    const result = localListEventType.map(eventType => {
      if (eventType.id === id) {
        eventType[type] = value;
      }
      return eventType;
    });
    setLocalListEventType(result);
  };
  const onSwitchChange = async value => {
    await setLoading(value.id, 'switchLoading', true);
    const payload = {
      eventTypeId: value.id,
      status: value.status === 0 ? 1 : 0,
    };
    const res = await dispatch({ type: 'EVENT/updateEventType', payload });
    if (res.status === 200) {
      const result = localListEventType.map(item => {
        if (item.id === value.id) {
          if (item.status === 0) {
            item.status = 1;
          } else item.status = 0;
        }
        return item;
      });
      setLocalListEventType(result);
    }
    await setLoading(value.id, 'switchLoading', false);
  };
  const createEventType = () => {
    history.push('/calendar-creation?relationship_type=1');
  };

  const onPreview = eventType => {
    history.push(`/preview?eventCode=${eventType.event_code}`);
  };

  const handleVisibleChangeSetting = value => {
    if (!value) {
      dispatch({ type: 'EVENT/updateIsSelectEvent', payload: false });
    }
  };

  return (
    <div>
      <div className={styles.partyMeeting}>
        <div className={styles.listHeader}>
          <Row>
            <Col lg={12} md={16} sm={24} xs={24}>
              <div className={styles.personalInfo}>
                <div className={styles.avtImage}>
                  {profile.avatar ? (
                    <Avatar size={60} src={profile.avatar} />
                  ) : (
                    <Avatar
                      size={60}
                      src={logoImage}
                      className={styles.defaultAvatar}
                    />
                  )}
                </div>
                <div>
                  <p>{profile.name}</p>
                  {/* <a
                    href={`${config.WEB_DOMAIN}/${profile.code}`}
                  >{`${config.SHORT_DOMAIN}/${profile.code}`}</a> */}
                </div>
              </div>
            </Col>
            <Col lg={12} md={8} sm={24} xs={24}>
              <div className={styles.rightActions}>
                <div className={styles.creatNewBtnZone}>
                  <Button onClick={createEventType}>
                    <span className={styles.plusIcon}>＋</span>{' '}
                    {formatMessage({ id: 'i18n_create_button' })}
                  </Button>
                </div>
                <p>
                  {formatMessage({ id: 'i18n_schedule_auto_personal' })}{' '}
                  <Tooltip
                    title={formatMessage({
                      id: 'i18n_use_standard_setting_tooltip',
                    })}
                  >
                    <img src={helper} className="helper" />
                  </Tooltip>
                </p>
                <EventTemplateModal getList={getList} relationship_type={1} />
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.listEventTypes}>
          <Spin spinning={fetchLoading}>
            <Row>
              {localListEventType.map(event => {
                return (
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
                        onClick={() => {
                          history.push(
                            `/calendar-creation?idEvent=${event.id}&edit=true&relationship_type=1`,
                          );
                        }}
                      ></div>
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
                          onChange={() => onSwitchChange(event)}
                          loading={event.switchLoading}
                        />
                      </div>
                      <p className={styles.eventTypeDetail}>
                        {formatMessage({ id: 'i18n_meeting_format' })}：
                        {(event.m_category_id === 2 ||
                          event.m_category_id === 3) &&
                          '対面'}
                        {event.m_category_id === 1 && 'オンライン'}
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
                          className={`${
                            styles.linkButton
                          } ${event.choosenOnceLink &&
                            styles.savedLinkButton} ${
                            event.disabledOnceLink || !event.status
                              ? styles.disabledBtn
                              : ''
                          } `}
                          onClick={() =>
                            copyLink(event.event_code, event.id, true)
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
                          onClick={() =>
                            copyLink(event.event_code, event.id, false)
                          }
                          disabled={event.disabledManyTimeLink || !event.status}
                          loading={event.copyManyTimeLinkLoading}
                        >
                          {event.choosenManyTimeLink
                            ? formatMessage({ id: 'i18n_copied' })
                            : formatMessage({ id: 'i18n_many_time_link' })}
                        </Button>
                        <Button
                          className={styles.previewButton}
                          disabled={!event.status}
                          onClick={() => onPreview(event)}
                        >
                          {formatMessage({ id: 'i18n_preview' })}
                        </Button>
                        <Dropdown
                          overlay={menu}
                          trigger={['click']}
                          onClick={() => handleClickOptionEvent(event.id)}
                          onVisibleChange={handleVisibleChangeSetting}
                          overlayClassName={styles.menuSetting}
                        >
                          <img src={pinion2} />
                        </Dropdown>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Spin>
          {!!totalEventType && (
            <Pagination
              defaultCurrent={pageIndex}
              pageSize={pageSize}
              total={totalEventType}
              onChange={(page, pageSize) => setPageIndex(page)}
              responsive={true}
            />
          )}
        </div>
        <Modal
          visible={modalState}
          onOk={handleOk}
          onCancel={handleCancel}
          closable={false}
          footer={null}
        >
          {localListEventType.map(event => {
            if (event.id === idEvent) {
              return (
                <div key={event.id} className={styles.modalDelete}>
                  <div className={styles.modalTitle}>
                    {formatMessage({ id: 'i18n_title_delete_event_type' })}
                  </div>
                  <div className={`${styles.btnGroup} ${styles.btnGroupSP}`}>
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
              );
            }
          })}
        </Modal>
        <TimeToEmailModal
          profile={profile}
          visible={timeToEmailModal}
          closeModal={() => setTimeToEmailModal(false)}
        />
        {/* <EventTemplateModal show={templateModal} onClose={() => setTemplateModal(false)} typeTemplate={typeTemplate} /> */}
      </div>
      <Footer />
    </div>
  );
}

export default connect(({ EVENT }) => ({ eventStore: EVENT }))(PartyMeeting);
