import AvailableTimeSetting from '@/components/EventTypeSetting/AvailableTimeSetting';
import BasicSetting from '@/components/EventTypeSetting/BasicSetting';
import ButtonGroup from '@/components/EventTypeSetting/ButtonGroup';
import Footer from '@/components/Footer';
import { Button, Modal, Spin } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useRef, useState } from 'react';
import { history, useIntl } from 'umi';
import {
  create,
  loadingData,
  reset,
  resetCalendarHeader,
  setLoading,
  setSync,
  settingForFirstLoad,
  syncCalendar,
  setEventTemplate,
} from './actions';
import AdvancedSetting from './components/AdvancedSetting';
import Preview from './components/Preview';

import styles from './styles.less';
import Vote from '../Vote';
import { TYPE_VOTE_RELATIONSHIP } from '../../constant';
import {
  createTimeAsync,
  notify,
  profileFromStorage,
} from '../../commons/function';
import useWindowDimensions from '@/commons/useWindowDimensions';

function CalendarCreation({
  // state
  masterStore,
  calendarStore,
  availableTime,
  basicSetting,
  // actions
  onSyncCalendar,
  onLoadingData,
  onSetLoading,
  onReset,
  onCreate,
  onResetCalendarHeader,
  onSettingForFirstLoad,
  onSetEventTemplate,
  onResetAvailableTime,
  togetherHeaderSettingAdvance,
  eventStore,
}) {
  const relationshipType =
    Number(history.location.query.relationship_type) || null;
  const teamId = Number(history.location.query.team_id) || null;
  const memberId = Number(history.location.query.member_id) || null;
  const eventId = Number(history.location.query.idEvent) || null;
  const isOneTime = Number(history.location.query.isOneTime) || 0;
  const isClone = Number(history.location.query.clone) || 0;
  const isFinished = Number(history.location.query.is_finished) || 0;
  const { width } = useWindowDimensions();

  const { formatMessage } = useIntl();

  const profile = profileFromStorage();
  const { sync, loading } = calendarStore;
  const { displayEvents } = availableTime;

  const { isLoading } = eventStore;

  const [preview, setPreview] = useState(false);
  const btnSaveRef = useRef(null);
  const btnSaveGroupRef = useRef(null);
  const [advencedSetting, setAdvencedSetting] = useState(false);
  const [dataPreviewVote, setDataPreviewVote] = useState(null);
  const [showConfirmClone, setShowConfirmClone] = useState(false);
  const [showShowNavigate, setShowNavigate] = useState(true);
  const [showTeamParent, setShowTeamParent] = useState(false);

  // setting for first load
  useEffect(() => {
    setShowTeamParent(isShowTeam());
    onSettingForFirstLoad(relationshipType, isOneTime, isClone);
  }, []);

  // Fetch all data
  useEffect(() => {
    if (profile?.id) {
      onSyncCalendar(profile);
    }
  }, []);

  useEffect(() => {
    if (sync) {
      onLoadingData(
        teamId,
        memberId,
        eventId,
        profile,
        isClone,
        createTimeAsync(),
      );
    }
  }, [sync]);

  useEffect(() => {
    // auto show setting when initial in mobile
    if (width <= 768) {
      setShowNavigate(true);
    }

    return () => {
      onResetAvailableTime();
      onReset();
    };
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const handleScroll = () => {
    if (!btnSaveRef || !btnSaveRef?.current) {
      return;
    }
    const { y } = btnSaveRef.current.getBoundingClientRect();
    if (y <= window.innerHeight) {
      btnSaveGroupRef.current.style.display = 'none';
    } else {
      btnSaveGroupRef.current.style.display = 'inline-block';
    }
  };

  const setAdvancePage = payload => {
    setAdvencedSetting(payload);

    // is closed page
    if (!payload) {
      onResetCalendarHeader();
    }
  };

  const isShowTeam = () => {
    if (width <= 768) {
      return false;
    }

    return !eventId;
  };

  const openPreview = () => {
    if (relationshipType === TYPE_VOTE_RELATIONSHIP) {
      const eventNotBook = displayEvents.filter(item => !item.isBooked);
      if (!eventNotBook.length) {
        notify('候補日程ブロックは最低1つ作成する必要があります。');
        return;
      }
      const dataPreview = {
        event_datetimes: eventNotBook,
        ...basicSetting,
      };
      // set data vote
      const profile = localStorage.getItem('profile');
      // if (profile && !eventId && teamId) {
      if (profile && !eventId) {
        const { name, avatar, company } = JSON.parse(profile);
        dataPreview.profile = {
          avatar: avatar || '',
          company: company || '',
          name: name,
        };
      }
      dataPreview.dataCreateTeam = !eventId;

      setDataPreviewVote(dataPreview);
    }

    onResetCalendarHeader();
    setPreview(true);
  };

  const closePreview = () => {
    if (relationshipType === TYPE_VOTE_RELATIONSHIP) {
      setDataPreviewVote(null);
    }

    onResetCalendarHeader();
    setPreview(false);
  };

  const saveToTemplate = type_template => {
    onSetEventTemplate({
      type_template,
      basicSetting,
      scheduleSetting: calendarStore.scheduleSetting,
      timeSetting: calendarStore.timeSetting,
      messageSetting: calendarStore.messageSetting,
    });
  };

  const canSaveCalendar = () => {
    if (basicSetting.is_manual_setting === true) {
      const { manualEvents } = availableTime;
      return !!(
        manualEvents &&
        manualEvents.length &&
        manualEvents.filter(e => !e.isBooked).length
      );
    }

    const { displayEvents } = availableTime;
    return !!(
      displayEvents &&
      displayEvents.length &&
      displayEvents.filter(e => !e.isBooked).length
    );
  };

  const saveCalendar = () => {
    if (!canSaveCalendar()) {
      return;
    }

    if (isFinished) {
      setShowConfirmClone(true);
      return;
    }
    onSetLoading(true);
    onCreate({
      event_id: eventId,
      team_id: teamId,
      member_id: memberId,
      relationshipType,
      basicSetting,
      ...calendarStore,
      ...availableTime,
    });
  };

  const confirmCloneVote = () => {
    setShowConfirmClone(false);
    history.push({
      pathname: '/calendar-creation',
      search: `?idEvent=${eventId}&clone=1&relationship_type=${TYPE_VOTE_RELATIONSHIP}&member_id=${memberId}`,
    });
    window.location.reload(true);
  };

  const togetherStep1 = () => {
    setShowNavigate(!showShowNavigate);
  };

  const settingBasicCss = () => {
    let listCss = styles.settingBasic;
    if (showShowNavigate) {
      listCss += ' ' + styles.settingBasicActive;
    }

    if (canSaveCalendar()) {
      listCss += ' ' + styles.active;
    }

    return listCss;
  };

  const formCalendarCss = () => {
    let listCss = styles.formCalendar;
    if (showShowNavigate) {
      listCss += ' ' + styles.formCalendarActive;
    }
    return listCss;
  };

  return (
    <div>
      {!preview && (
        // <Spin spinning={loading} size="large">
        <div>
          {advencedSetting && (
            <AdvancedSetting
              relationshipType={relationshipType}
              onClose={() => {
                setAdvancePage(false);
                togetherHeaderSettingAdvance(false);
              }}
            />
          )}

          {!advencedSetting && (
            <div className={styles.calendarCreation}>
              {/*PC*/}
              <div className={settingBasicCss()}>
                <BasicSetting
                  showAdvancedSetting={() => {
                    setAdvancePage(true);
                    togetherHeaderSettingAdvance(true);
                  }}
                />
              </div>

              <div className={formCalendarCss()}>
                <AvailableTimeSetting
                  isShowTeam={isShowTeam()}
                  togetherNavigate={togetherStep1}
                  showShowNavigate={showShowNavigate}
                  showTeamParent={showTeamParent}
                  setShowTeamParent={setShowTeamParent}
                />

                <div className={styles.padding}>
                  <ButtonGroup
                    refBtn={btnSaveRef}
                    created={!!eventId}
                    disabledSubmit={canSaveCalendar()}
                    onSave={saveCalendar}
                    onCancel={() => history.push('/')}
                    showPreview={openPreview}
                    showAdvancedSetting={() => {
                      setAdvancePage(true);
                      togetherHeaderSettingAdvance(true);
                    }}
                  />

                  <div>
                    <div className={styles.registerTemplateText}>
                      上記の設定をテンプレートに登録される場合は、
                      <br />
                      下記よりご登録ください。
                    </div>
                    <div className={styles.saveToTemplateBtn}>
                      <Button onClick={() => saveToTemplate(1)}>
                        {formatMessage({ id: 'i18n_update_template_1' })}
                      </Button>
                      <Button onClick={() => saveToTemplate(2)}>
                        {formatMessage({ id: 'i18n_update_template_2' })}
                      </Button>
                      <Button onClick={() => saveToTemplate(3)}>
                        {formatMessage({ id: 'i18n_update_template_3' })}
                      </Button>
                    </div>
                  </div>

                  <div className={styles.groupSaveMb}>
                    <button
                      onClick={() => {
                        setShowTeamParent(!showTeamParent);
                      }}
                    >
                      ＋ メンバーを編集する
                    </button>
                    <button
                      className={canSaveCalendar() ? styles.active : ''}
                      onClick={saveCalendar}
                    >
                      作成を完了する
                    </button>
                  </div>
                </div>

                <div className={styles.btnSaveGroup} ref={btnSaveGroupRef}>
                  {/*<div className={styles.previewBtnZone}>*/}
                  {/*  <Button*/}
                  {/*    onClick={openPreview}*/}
                  {/*    className={styles.previewButton}*/}
                  {/*  >*/}
                  {/*    {formatMessage({ id: 'i18n_preview' })}*/}
                  {/*  </Button>*/}
                  {/*</div>*/}
                  <div className={styles.listBtn}>
                    <button onClick={() => history.push('/')}>
                      {formatMessage({ id: 'i18n_return' })}
                    </button>
                    <button
                      className={`${!canSaveCalendar() &&
                        styles.disabledBtnSave}`}
                      onClick={saveCalendar}
                    >
                      {formatMessage({
                        id: !!eventId ? 'i18n_update' : 'i18n_create',
                      })}
                    </button>
                  </div>
                </div>

                <Footer />
              </div>
            </div>
          )}
        </div>
      )}

      {preview && relationshipType !== 3 && (
        <Preview
          onBackPrevious={closePreview}
          eventId={eventId}
          textComment={calendarStore.messageSetting.calendar_create_comment}
        />
      )}

      {/* VOTE PREVIEW */}
      {preview && relationshipType === TYPE_VOTE_RELATIONSHIP && (
        <Vote
          preview
          dataCreateTeam={teamId && !eventId}
          dataPreview={dataPreviewVote}
          onBackPrevious={closePreview}
        />
      )}

      {/* modal confirm clone Calendar create */}
      <Modal visible={showConfirmClone} closable={false} footer={null}>
        <div className={styles.modalDelete}>
          <div className={styles.modalDescription}>
            {formatMessage({ id: 'i18n_schedule_finished_notification' })}
          </div>
          <div className={styles.btnGroup}>
            <Button
              onClick={() => setShowConfirmClone(false)}
              className="btn btnWhite"
            >
              {formatMessage({ id: 'i18n_cancel_delete' })}
            </Button>
            <Button onClick={confirmCloneVote} className="btn btnGreen">
              {formatMessage({ id: 'i18n_confirm_delete_event' })}
            </Button>
          </div>
        </div>
      </Modal>

      {width <= 768 && (
        <Modal
          visible={showShowNavigate}
          style={{ top: 20 }}
          closable={false}
          footer={null}
          className={styles.basicSettingModal}
        >
          <Spin spinning={isLoading || availableTime.loading}>
            <BasicSetting
              showAdvancedSetting={() => {
                setAdvancePage(true);
                togetherHeaderSettingAdvance(true);
              }}
              onHideBasicSetting={() => setShowNavigate(false)}
            />
          </Spin>
        </Modal>
      )}
    </div>
  );
}

const mapStateToProps = ({
  CALENDAR_CREATION,
  MASTER,
  AVAILABLE_TIME,
  BASIC_SETTING,
  EVENT,
}) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  calendarStore: CALENDAR_CREATION,
  availableTime: AVAILABLE_TIME,
  basicSetting: BASIC_SETTING,
});

function mapDispatchToProps(dispatch) {
  return {
    onSyncCalendar: value => dispatch(syncCalendar(value)),
    onLoadingData: (...props) => dispatch(loadingData(...props)),
    onSetLoading: payload => dispatch(setLoading(payload)),
    onReset: () => dispatch(reset()),
    onCreate: payload => dispatch(create(payload)),
    onResetCalendarHeader: () => dispatch(resetCalendarHeader()),
    onSettingForFirstLoad: (relationshipType, isOneTime, isClone) =>
      dispatch(settingForFirstLoad(relationshipType, isOneTime, isClone)),
    onSetEventTemplate: payload => dispatch(setEventTemplate(payload)),
    onCheckAccountMicrosoft: () =>
      dispatch({ type: 'CALENDAR_CREATION/checkAccountMicrosoft' }),
    onResetAvailableTime: () =>
      dispatch({
        type: 'AVAILABLE_TIME/reset',
      }),
    togetherHeaderSettingAdvance: payload =>
      dispatch({
        type: 'AVAILABLE_TIME/setHeaderSettingAdvance',
        payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarCreation);
