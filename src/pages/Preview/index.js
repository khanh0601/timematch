import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { Row, Col, Layout, Button, Spin } from 'antd';
import pinned from '@/assets/images/i-pinned.svg';
import user from '@/assets/images/i-user.png';
import comment from '@/assets/images/i-comment.svg';
import { history, useIntl } from 'umi';
import { connect } from 'dva';
import BookingCalendar from '@/components/BookingCalendar';
import logoImage from '@/assets/images/logo-black.svg';
import Footer from '@/components/Footer';
import MenuSPBottom from '@/components/MenuSPBottom';
import HeaderPreview from '@/components/HeaderPreview';
import moment from 'moment';

import {
  autoGenerateEvent,
  customizeGenerateEvent,
  nextWeek,
  prevWeek,
} from '@/components/EventTypeSetting/AvailableTimeSetting/actions';
import { reset } from '@/pages/CalendarCreation/actions';

import { loadingData, backToEventTypeList } from './action';
import {
  meetingMethod,
  meetingCategory,
  filterReceptionTime,
  profileFromStorage,
  createTimeAsync,
} from '../../commons/function';

import useWindowDimensions from '@/commons/useWindowDimensions';
import LoginFree from '../../components/LoginFree';

function Preview(props) {
  const {
    // actions
    onNextWeek,
    onPrevWeek,
    onAutoGenerateEvent,
    onCustomizeGenerateEvent,
    onBackToEventTypeList,
    onLoadingData,
    onReset,
    onAsyncToWeek,
    // state
    eventStore,
    masterStore,
    calendarStore,
    availableTime,
    basicSetting,
  } = props;

  const { userByCode } = eventStore;
  const profile = profileFromStorage();
  const { userEdit, messageSetting } = calendarStore;
  const {
    displayEvents,
    bookedEvents,
    customizeDayOnOff,
    calendarHeaders,
    members,
  } = availableTime;
  const { formatMessage } = useIntl();
  const { event_code, user_code, typeTemplate } = history.location.query;

  const userInfo = typeTemplate ? profile : userEdit;

  const [isLoaded, setIsLoaded] = useState(false);

  const [dateIncrement, setDateIncrement] = useState(7);
  const { width } = useWindowDimensions();

  useEffect(() => onReset, []);

  useEffect(() => {
    if (width <= 768) {
      setDateIncrement(3);
      return;
    }

    setDateIncrement(7);
  }, []);

  useEffect(() => {
    if (profile?.id && !isLoaded) {
      setIsLoaded(true);
      const timeAsync = createTimeAsync();
      onLoadingData({
        event_code,
        user_code,
        typeTemplate,
        profile,
        timeAsync,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!calendarStore.loading && basicSetting.block_number) {
      generate();
    }
  }, [
    basicSetting.m_category_id,
    basicSetting.block_number,
    basicSetting.is_manual_setting,
    basicSetting.move_number,
    bookedEvents,
    customizeDayOnOff,
    calendarStore.loading,
  ]);

  const generate = () => {
    // auto generate
    if (!basicSetting.is_manual_setting) {
      const dataSetting = {
        ...calendarStore,
        basicSetting,
      };
      if (typeTemplate) {
        dataSetting.relationshipType = 1;
      }
      onAutoGenerateEvent(dataSetting);
    } else {
      // customize generate
      onCustomizeGenerateEvent();
    }
  };

  const handleNextWeek = async () => {
    onNextWeek(dateIncrement);
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    await onAsyncToWeek({
      listMember: members,
      startTime,
      endTime,
    });
    generate();
  };

  const handlePrevWeek = async () => {
    onPrevWeek(dateIncrement);
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    await onAsyncToWeek({
      listMember: members,
      startTime,
      endTime,
    });
    generate();
  };

  const backToList = () => {
    onBackToEventTypeList();
    history.goBack();
  };

  const filterDisplayEvent = () => {
    const blocks = displayEvents.filter(
      event =>
        !event.isBooked &&
        moment()
          .add(basicSetting.move_number || 0)
          .isBefore(moment(event.start_time), 'minutes'),
    );

    return filterReceptionTime(
      blocks,
      calendarStore.scheduleSetting.reception_start_time +
        basicSetting.move_number || 0,
    );
  };

  return (
    <Layout className={styles.mainLayout}>
      <HeaderPreview
        userByCode={userInfo}
        bookingState
        togetherModalInfor={() => {}}
        isScheduleAdjust
      />

      <div className={styles.mainContent}>
        <div className={styles.padding}>
          <div className={styles.backToList}>
            <div className={`${styles.noticeText}`}>
              <p>
                こちらが、調整相手に表示するプレビュー画面です。
                <br className={styles.desktop} />
                ご確認ください。
              </p>
            </div>
            <div className={styles.btnZone}>
              <Button onClick={backToList}>戻る</Button>
            </div>
          </div>
        </div>
        <div className={styles.scheduleAdjustment}>
          <div className={styles.padding}>
            <p className={styles.intruction}>
              {/* {formatMessage({
                id: 'i18n_schedule_adjustment_intruction1',
              })}
              <br className={styles.mobile} />
              {formatMessage({
                id: 'i18n_schedule_adjustment_intruction2',
              })} */}
              日程調整可能な日時を下記より選択してください。
            </p>
            <div className={styles.progressBar}>
              <div className={`${styles.firstStep} ${styles.activeStep}`}>
                <span>1</span>
                <p>{formatMessage({ id: 'i18n_step_1_adjust' })}</p>
              </div>
              <div className={styles.dottedBar} />
              <div className={styles.endStep}>
                <span>2</span>
                <p>{formatMessage({ id: 'i18n_step_2_adjust' })}</p>
              </div>
            </div>
          </div>

          <div className={styles.firstStepDetail}>
            <Row>
              <Col
                xs={0}
                sm={0}
                md={7}
                xl={6}
                xxl={5}
                className={styles.boxInforUser}
              >
                <p className={styles.pinnedText}>
                  <img src={user} />
                  {formatMessage({ id: 'i18n_user_info_booking_b' })}
                </p>
                <div className={styles.userInfo}>
                  <p>
                    <span className={styles.infoCompany}>
                      {userByCode.company}
                    </span>
                  </p>
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    <img
                      src={userInfo?.avatar ? userInfo?.avatar : logoImage}
                    />
                  </div>
                  <p>
                    <span className={styles.infoName}>{userInfo?.name}</span>
                  </p>
                </div>
                <div className={styles.meetingInfo}>
                  <p
                    className={`${styles.pinnedText} ${styles.pinnedTextSecond}`}
                  >
                    <img src={pinned} />
                    {formatMessage({ id: 'i18n_meeting' })}
                  </p>
                  <div className={styles.meetingDetail}>
                    {formatMessage({ id: 'i18n_required_time' })}：
                    {basicSetting.block_number}
                    {formatMessage({ id: 'i18n_minute' })}
                    <br />
                    <div className={styles.mt15} />
                    {formatMessage({ id: 'i18n_meeting_formality' })}：
                    {meetingCategory(basicSetting.m_category_id)}
                    <br />
                    <div className={styles.mt15} />
                    {formatMessage({ id: 'i18n_meeting_method' })}：
                    <span className={styles.meetingMethod}>
                      {meetingMethod(basicSetting)}
                    </span>
                  </div>
                </div>
                <div className={styles.meetingComment}>
                  <p className={styles.pinnedText}>
                    <img src={comment} />
                    {userInfo?.name}
                    {formatMessage({ id: 'i18n_comment_from' })}
                  </p>
                </div>
                <div className={styles.secondStepHeader}>
                  <div className={styles.searchKeyword}>
                    <textarea
                      value={
                        messageSetting.calendar_create_comment
                          ? messageSetting.calendar_create_comment
                          : undefined
                      }
                      disabled
                    />
                  </div>
                  <LoginFree />
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={17}
                xl={18}
                xxl={19}
                className={styles.boxBooking}
              >
                <Spin
                  spinning={
                    calendarStore.loading ||
                    availableTime.loading ||
                    eventStore.isLoading
                  }
                  size="large"
                >
                  <div className={styles.calendar}>
                    <BookingCalendar
                      listTimeFrame={filterDisplayEvent()}
                      onSelectTime={() => {}}
                      eventInfo={basicSetting}
                      nextWeek={handleNextWeek}
                      prevWeek={handlePrevWeek}
                    />
                  </div>
                </Spin>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Footer />
      <MenuSPBottom />
    </Layout>
  );
}

const mapStateToProps = ({
  CALENDAR_CREATION,
  AVAILABLE_TIME,
  BASIC_SETTING,
  EVENT,
  MASTER,
}) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  calendarStore: CALENDAR_CREATION,
  availableTime: AVAILABLE_TIME,
  basicSetting: BASIC_SETTING,
});

function mapDispatchToProps(dispatch) {
  return {
    onNextWeek: step => dispatch(nextWeek(step)),
    onPrevWeek: step => dispatch(prevWeek(step)),
    onAutoGenerateEvent: payload => dispatch(autoGenerateEvent(payload)),
    onCustomizeGenerateEvent: () => dispatch(customizeGenerateEvent()),
    onLoadingData: payload => dispatch(loadingData(payload)),
    onBackToEventTypeList: () => dispatch(backToEventTypeList()),
    onReset: () => dispatch(reset()),
    onAsyncToWeek: payload =>
      dispatch({
        type: 'AVAILABLE_TIME/asyncToWeek',
        payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
