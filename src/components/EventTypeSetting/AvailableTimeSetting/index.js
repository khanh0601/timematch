import eraserImage from '@/assets/images/eraser.png';
import iconArrowLeft from '@/assets/images/i-arrow-left.png';
import helper from '@/assets/images/imgQuestion.png';
import { YYYYMMDD } from '@/constant';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Spin, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from '../basic_styles.less';
import {
  personalExpiredModal,
  slotLabelFormat,
} from '../../../commons/function';

import {
  addEvent,
  autoGenerateEvent,
  customizeGenerateEvent,
  deleteAllEvent,
  deleteEvent,
  dropEvent,
  memberChecked,
  nextWeek,
  prevWeek,
  resizeEvent,
  setCalendarRef,
  switchChange,
  sendAddMemberEmail,
} from './actions';
import Content from './components/Content';
import Header from './components/Header';
import TeamList from './components/TeamList';
import useWindowDimensions from '@/commons/useWindowDimensions';
import { history } from 'umi';

function AvailableTimeSetting(props) {
  const { formatMessage } = useIntl();

  const {
    showShowNavigate,
    togetherNavigate,
    // actions
    onSwitchChange,
    onAddEvent,
    onDeleteEvent,
    onResizeEvent,
    onDropEvent,
    onNextWeek,
    onPrevWeek,
    onSetCalendarRef,
    onAutoGenerateEvent,
    onCustomizeGenerateEvent,
    onDeleteAllEvent,
    onMemberChecked,
    onSendAddMemberEmail,
    onAsyncToWeek,
    // state
    availableTime,
    calendarStore,
    masterStore,
    basicSetting,
    eventStore,
    isShowTeam,
    showTeamParent,
    setShowTeamParent,
  } = props;

  const {
    loading,
    calendarRef,
    calendarHeaders,
    displayEvents,
    bookedEvents,
    members,
    customizeDayOnOff,
  } = availableTime;

  const { isLoading } = eventStore;

  // Get store data
  const { scheduleSetting } = calendarStore;
  const { profile } = masterStore;
  const { width } = useWindowDimensions();
  const teamId = Number(history.location.query.team_id) || null;
  const [firstDay, setFirstDay] = useState(moment().isoWeekday());
  const [isReloadMemberChange, setReloadMemberChange] = useState(false);
  const [dateIncrement, setDateIncrement] = useState(7);
  const calendarParentRef = React.useRef();

  // Fetch data
  useEffect(() => {
    onSetCalendarRef(React.createRef());
  }, []);

  useEffect(() => {
    if (members.length && isReloadMemberChange) {
      handleReloadMemberChange();
      setReloadMemberChange(false);
    }
  }, [isReloadMemberChange]);

  useEffect(() => {
    const firstDay =
      calendarHeaders && calendarHeaders.length
        ? calendarHeaders[0]?.weekDay
        : moment().isoWeekday();
    setFirstDay(firstDay);
  }, [calendarHeaders]);

  useEffect(() => {
    if (members && members.length > 0) {
      generate();
    }
  }, [members]);

  useEffect(() => {
    if (profile?.id && members && members.length > 0) {
      generate();
    }
  }, [
    basicSetting.m_category_id,
    basicSetting.block_number,
    basicSetting.is_manual_setting,
    basicSetting.move_number,
    customizeDayOnOff,
    bookedEvents,
  ]);

  useEffect(() => {
    if (width <= 768) {
      setShowTeam(false);
      setShowTeamParent(false);
      setDateIncrement(3);
      return;
    }

    setDateIncrement(7);
  }, [width]);

  useEffect(() => {
    setShowTeam(showTeamParent);
  }, [showTeamParent]);

  const generate = () => {
    // auto generate
    if (!basicSetting.is_manual_setting) {
      onAutoGenerateEvent({ ...calendarStore, basicSetting });
    } else {
      // customize generate
      onCustomizeGenerateEvent();
    }
  };

  const handleReloadMemberChange = async () => {
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    await onAsyncToWeek({
      listMember: members,
      startTime,
      endTime,
    });
    generate();
  };

  const handleNextWeek = async step => {
    calendarParentRef.current.scrollTo(0, 0);

    await onNextWeek(step);
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    await onAsyncToWeek({
      listMember: members,
      startTime,
      endTime,
    });
    generate();
  };

  const handlePrevWeek = async step => {
    calendarParentRef.current.scrollTo(0, 0);

    await onPrevWeek(step);
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    await onAsyncToWeek({
      listMember: members,
      startTime,
      endTime,
    });
    generate();
  };

  // Select events
  const [selected, onSelect] = useState({});
  const [showTeam, setShowTeam] = useState(isShowTeam);

  const currentWeek = () =>
    calendarHeaders[0] && calendarHeaders[0]?.date == moment().format(YYYYMMDD);

  displayEvents.forEach(
    event =>
      (event.name =
        event.hide || (event.isBooked && event.name == null)
          ? formatMessage({ id: 'i18n_anonymous_event' })
          : event.name),
  );

  const renderCurrentTime = () => {
    if (!calendarHeaders.length) {
      return;
    }
    const [{ date }] = calendarHeaders;
    const [year, month] = date.split('-');
    return (
      year +
      formatMessage({ id: 'i18n_year' }) +
      ' ' +
      month +
      formatMessage({ id: 'i18n_month' })
    );
  };

  const groupBtnMbCss = () => {
    let listCss = styles.btnActionMobile;
    if (!currentWeek()) {
      listCss += ' ' + styles.multiBtn;
    }
    return listCss;
  };

  const onChangeCheckedMember = (e, member) => {
    const { is_expired } = member;
    if (is_expired && teamId) {
      personalExpiredModal();
      return;
    }
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    const timeAsync = {
      startTime,
      endTime,
    };
    const payload = {
      checked: e,
      member,
      timeAsync,
    };
    onMemberChecked(payload);
    // setReloadMemberChange(true);
  };

  const btnTogetherSettingBasicCss = () => {
    let listCss = styles.stepHeaderTool;
    if (!showShowNavigate) {
      listCss += ' ' + styles.active;
    }
    return listCss;
  };

  const titleHeader = () => {
    return width <= 768 ? (
      <h2>
        2: ご確認の上「完了する」を
        <br />
        選択ください。
      </h2>
    ) : (
      <h2>
        2: 日程調整したい日時を
        <br />
        下記より選択ください。
      </h2>
    );
  };

  const setShowTeamList = value => {
    setShowTeam(value);
    setShowTeamParent(value);
  };

  const addTimeBlock = info => {
    if (!basicSetting.block_number) {
      return;
    }
    onAddEvent(info, basicSetting);
  };

  return (
    <div className={styles.calendarViewContainer}>
      <div className={styles.stepHeader}>
        <div className={styles.stepHeaderLeft}>
          <div className={btnTogetherSettingBasicCss()}>
            <button
              className={styles.btnTogetherSettingBasic}
              onClick={togetherNavigate}
            >
              <img src={iconArrowLeft} alt="huyngocpham-error" />
              <img src={iconArrowLeft} alt="huyngocpham-error" />
            </button>
          </div>
          <div className={styles.stepHeaderTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />
            </div>

            <div className={styles.titleText}>
              {titleHeader()}

              <p className={styles.titleDescript}>
                {formatMessage({ id: 'i18n_calendar_creation_step_2_tips' })}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.stepHeaderRight}>
          <button onClick={togetherNavigate}>
            基本設定を
            <br />
            変更する
          </button>
        </div>
      </div>

      <div className={styles.buttonDeleteCalendarContainer}>
        <button
          // className={styles.buttonDeleteCalendarContainer}
          onClick={onDeleteAllEvent}
        >
          <img className={styles.eraserStyle} src={eraserImage} />
          <span className={styles.buttonDeleteCalendar}>
            {formatMessage({ id: 'i18n_name_delete_button_calendar' })}
          </span>
          <Tooltip
            title={formatMessage({
              id: 'i18n_description_delete_button_calendar',
            })}
          >
            <img src={helper} className="helper" />
          </Tooltip>
        </button>
      </div>

      <div className={styles.calendarView}>
        <div className={styles.calendarContainer}>
          <TeamList
            profile={profile}
            show={showTeam}
            setShow={setShowTeamList}
            members={members}
            onChecked={onChangeCheckedMember}
            onSendEmail={onSendAddMemberEmail}
          />
          <Spin spinning={loading || isLoading}>
            <div className={groupBtnMbCss()}>
              <button
                className={`${currentWeek() && styles.disabledNav}`}
                onClick={() => {
                  handlePrevWeek(3);
                }}
              >
                <div className={styles.prevBtnMobile} />
                <span>次の3日</span>
              </button>

              <button
                onClick={() => {
                  handleNextWeek(3);
                }}
              >
                <span>次の3日</span>
                <div className={styles.nextBtnMobile} />
              </button>
            </div>

            <div className={styles.btnAction}>
              <div
                className={`${styles.prevBtn} ${
                  currentWeek() ? styles.disabledNav : ''
                }`}
                onClick={() => {
                  handlePrevWeek(7);
                }}
              >
                <div className={styles.btnImg} />
              </div>
              <div
                className={styles.nextBtn}
                onClick={() => {
                  handleNextWeek(7);
                }}
              >
                <div className={styles.btnImg} />
              </div>
            </div>
            <div
              ref={calendarParentRef}
              className={styles.bookingCalendarParent}
              style={{ width: width < 767 ? width : '' }}
            >
              <div style={{ width: width < 767 ? ((width - 45) / 3) * 7 : '' }}>
                <FullCalendar
                  ref={calendarRef}
                  eventOverlap={true}
                  headerToolbar={false}
                  expandRows={true}
                  timeZone={'local'}
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  events={displayEvents.filter(event => !event.isDeleted)}
                  slotMinTime={'00:00:00'}
                  slotMaxTime={'24:00:00'}
                  slotDuration={'00:15:00'}
                  slotLabelInterval={{ hours: 1 }}
                  eventMinHeight={15}
                  editable={true}
                  allDaySlot={false}
                  slotLabelFormat={slotLabelFormat}
                  dateIncrement={{
                    days: dateIncrement,
                  }}
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                    hourCycle: 'h23',
                  }}
                  dateClick={info => addTimeBlock(info)}
                  eventResize={onResizeEvent}
                  eventDrop={onDropEvent}
                  firstDay={firstDay}
                  scrollTime={scheduleSetting.default_start_time || '09:00:00'}
                  scrollTimeReset={false}
                  dayHeaderContent={value => (
                    <Header
                      value={value}
                      calendarHeaders={calendarHeaders}
                      onSwitchChange={onSwitchChange}
                      isAuto={!basicSetting.is_manual_setting}
                    />
                  )}
                  eventContent={info => (
                    <Content
                      info={info}
                      selected={selected}
                      onSelect={onSelect}
                      deleteEvent={onDeleteEvent}
                    />
                  )}
                  windowResize={true}
                />
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({
  AVAILABLE_TIME,
  EVENT,
  CALENDAR_CREATION,
  MASTER,
  BASIC_SETTING,
}) => ({
  availableTime: AVAILABLE_TIME,
  eventStore: EVENT,
  calendarStore: CALENDAR_CREATION,
  masterStore: MASTER,
  basicSetting: BASIC_SETTING,
});

function mapDispatchToProps(dispatch) {
  return {
    onSwitchChange: (day, isAuto) => dispatch(switchChange(day, isAuto)),
    onAddEvent: (info, basicSetting) => dispatch(addEvent(info, basicSetting)),
    onDeleteEvent: (event, isManualSetting) =>
      dispatch(deleteEvent(event, isManualSetting)),
    onResizeEvent: info => dispatch(resizeEvent(info)),
    onDropEvent: info => dispatch(dropEvent(info)),
    onNextWeek: step => dispatch(nextWeek(step)),
    onPrevWeek: step => dispatch(prevWeek(step)),
    onResetAvailableTime: () =>
      dispatch({
        type: 'AVAILABLE_TIME/reset',
      }),
    onSetCalendarRef: value => dispatch(setCalendarRef(value)),
    onAutoGenerateEvent: payload => dispatch(autoGenerateEvent(payload)),
    onCustomizeGenerateEvent: () => dispatch(customizeGenerateEvent()),
    onDeleteAllEvent: () => dispatch(deleteAllEvent()),
    onMemberChecked: payload => dispatch(memberChecked(payload)),
    onSendAddMemberEmail: (provider, email) =>
      dispatch(sendAddMemberEmail(provider, email)),
    onAsyncToWeek: payload =>
      dispatch({
        type: 'AVAILABLE_TIME/asyncToWeek',
        payload,
      }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AvailableTimeSetting);
