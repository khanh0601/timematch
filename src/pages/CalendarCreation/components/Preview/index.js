import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { Row, Col, Layout, Button, Modal, Spin } from 'antd';
import pinned from '@/assets/images/i-pinned.svg';
import user from '@/assets/images/i-user.png';
import comment from '@/assets/images/i-comment.svg';
import { useIntl } from 'umi';
import { connect } from 'dva';
import BookingCalendar from '@/components/BookingCalendar';
import logoImage from '@/assets/images/logo-black.svg';
import Footer from '@/components/Footer';
import MenuSPBottom from '@/components/MenuSPBottom';

import {
  autoGenerateEvent,
  customizeGenerateEvent,
  nextWeek,
  prevWeek,
} from '@/components/EventTypeSetting/AvailableTimeSetting/actions';
import HeaderPreview from '../../../../components/HeaderPreview';
import { meetingCategory, meetingMethod } from '../../../../commons/function';
import useWindowDimensions from '@/commons/useWindowDimensions';
import LoginFree from '../../../../components/LoginFree';

function Preview(props) {
  const {
    // actions
    onNextWeek,
    onPrevWeek,
    onAutoGenerateEvent,
    onCustomizeGenerateEvent,
    onAsyncToWeek,
    // props
    onBackPrevious,
    eventStore,
    eventId,
    textComment,
    // state
    calendarStore,
    masterStore,
    availableTime,
    basicSetting,
  } = props;

  const { profile } = masterStore;
  const { displayEvents, members, calendarHeaders, loading } = availableTime;
  const { messageSetting } = calendarStore;
  const { formatMessage } = useIntl();
  const [modalInforSm, setModalInforSm] = useState(false);
  const [inforUser, setInforUser] = useState(null);
  const [dateIncrement, setDateIncrement] = useState(7);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width <= 768) {
      setDateIncrement(3);
      return;
    }

    setDateIncrement(7);
  }, []);

  useEffect(() => {
    generate();
    if (eventId) {
      setInforUser({ ...calendarStore.userEdit, comment: textComment });
    }

    if (!eventId) {
      setInforUser({ ...profile, comment: textComment });
    }
  }, []);

  const generate = () => {
    // auto generate
    if (!basicSetting.is_manual_setting) {
      onAutoGenerateEvent({ ...calendarStore, basicSetting });
    } else {
      // customize generate
      onCustomizeGenerateEvent();
    }
  };

  const handleNextWeek = async () => {
    onNextWeek(dateIncrement);
    await asyncToWeek();
    generate();
  };

  const handlePrevWeek = async () => {
    onPrevWeek(dateIncrement);
    await asyncToWeek();
    generate();
  };

  const asyncToWeek = async () => {
    const startTime = calendarHeaders[0]?.date;
    const endTime = calendarHeaders[calendarHeaders.length - 1]?.date;
    await onAsyncToWeek({
      listMember: members,
      startTime,
      endTime,
    });
  };

  const formatLocation = locationId => {
    const { listEventLocation } = eventStore;
    const { location_name } = basicSetting;
    const arr = [3, 4, 5];
    if (!locationId || !listEventLocation) {
      return;
    }
    const { name, id } = listEventLocation.filter(
      item => item.id === locationId,
    )[0];
    let nameLocation;
    if (!arr.includes(id)) {
      nameLocation = name;
    }

    if (arr.includes(id)) {
      nameLocation = name + ' ' + location_name;
    }
    return nameLocation;
  };

  const showInforBooking = value => {
    setModalInforSm(value);
  };

  return (
    <Layout className={styles.mainLayout}>
      <HeaderPreview
        userByCode={inforUser}
        bookingState
        togetherModalInfor={() => showInforBooking(true)}
        isScheduleAdjust
        previewCalendar
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
              <Button onClick={() => onBackPrevious()}>戻る</Button>
            </div>
          </div>
        </div>
        <div className={styles.scheduleAdjustment}>
          <div className={styles.padding}>
            <p className={styles.intruction}>
              {/*{formatMessage({*/}
              {/*  id: 'i18n_schedule_adjustment_intruction1',*/}
              {/*})}*/}
              {/*<br className={styles.mobile} />*/}
              {/*{formatMessage({*/}
              {/*  id: 'i18n_schedule_adjustment_intruction2',*/}
              {/*})}*/}
              日程調整可能な日時を下記より選択してください。
            </p>

            <div className={styles.progressBar}>
              <div className={`${styles.firstStep} ${styles.activeStep}`}>
                <span>1</span>
                <p>ご都合の良い日時を選択</p>
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
                  <div className={styles.avatar}>
                    <img
                      src={inforUser?.avatar ? inforUser?.avatar : logoImage}
                    />
                  </div>

                  <p>
                    <span className={styles.infoCompany}>
                      {inforUser?.company}
                    </span>
                    {inforUser?.company ? <br /> : null}
                    <span className={styles.infoName}>{inforUser?.name}</span>
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
                      {formatLocation(basicSetting.m_location_id)}
                    </span>
                  </div>
                </div>
                <div className={styles.meetingComment}>
                  <p className={styles.pinnedText}>
                    <img src={comment} />
                    {inforUser?.name}
                    {formatMessage({ id: 'i18n_comment_from' })}
                  </p>
                </div>
                <div className={styles.secondStepHeader}>
                  <div className={styles.searchKeyword}>
                    <textarea
                      value={
                        inforUser?.comment ? inforUser?.comment : undefined
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
                <div className={styles.calendar}>
                  <Spin spinning={loading}>
                    <BookingCalendar
                      listTimeFrame={displayEvents.filter(
                        event => !event.isBooked,
                      )}
                      onSelectTime={() => {}}
                      eventInfo={basicSetting}
                      nextWeek={handleNextWeek}
                      prevWeek={handlePrevWeek}
                    />
                  </Spin>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <Modal
          title=""
          maxWidth={350}
          visible={modalInforSm}
          footer={null}
          onCancel={() => showInforBooking(false)}
        >
          <div
            className={`${styles.scheduleAdjustment} ${styles.scheduleAdjustmentModal}`}
          >
            <div className={styles.mainContent}>
              <div className={styles.firstStepDetail}>
                <p className={styles.pinnedText}>
                  <img src={user} />
                  {formatMessage({ id: 'i18n_user_info_booking_b' })}
                </p>
                <div className={styles.userInfo}>
                  {inforUser?.avatar ? (
                    <div className={styles.avatar}>
                      <img src={inforUser?.avatar} />
                    </div>
                  ) : (
                    <div className={styles.avatar}>
                      <img src={logoImage} />
                    </div>
                  )}
                  <p>
                    <span className={styles.infoCompany}>
                      {inforUser?.company}
                    </span>
                    {inforUser?.company ? <br /> : null}
                    <span className={styles.infoName}>{inforUser?.name}</span>
                  </p>
                </div>
                <div className={styles.dottedBar}>
                  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                  . . . . . . . . . . . . . . . . .
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
                      {formatLocation(basicSetting.m_location_id)}
                    </span>
                  </div>
                </div>
                <div className={styles.dottedBar}>
                  . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                  . . . . . . . . . . . . . . . . .
                </div>
                <div className={styles.meetingComment}>
                  <p className={styles.pinnedText}>
                    <img src={comment} />
                    {inforUser?.name}
                    {formatMessage({ id: 'i18n_comment_from' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      <Footer />
      <MenuSPBottom />
    </Layout>
  );
}

const mapStateToProps = ({
  CALENDAR_CREATION,
  MASTER,
  AVAILABLE_TIME,
  BASIC_SETTING,
  EVENT,
}) => ({
  masterStore: MASTER,
  calendarStore: CALENDAR_CREATION,
  availableTime: AVAILABLE_TIME,
  basicSetting: BASIC_SETTING,
  eventStore: EVENT,
});

function mapDispatchToProps(dispatch) {
  return {
    onNextWeek: dateIncrement => dispatch(nextWeek(dateIncrement)),
    onPrevWeek: dateIncrement => dispatch(prevWeek(dateIncrement)),
    onAutoGenerateEvent: payload => dispatch(autoGenerateEvent(payload)),
    onCustomizeGenerateEvent: () => dispatch(customizeGenerateEvent()),
    onAsyncToWeek: payload =>
      dispatch({
        type: 'AVAILABLE_TIME/asyncToWeek',
        payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
