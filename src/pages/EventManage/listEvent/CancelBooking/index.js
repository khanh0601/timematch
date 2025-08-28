import { getJPFullDate } from '@/commons/function.js';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { HOUR_FORMAT } from '@/constant';
import { Button, Input, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import zone from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { history, useIntl } from 'umi';
import CancelBookingComplete from './CancelBookingComplete';
import styles from './styles.less';

function CancelBooking(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { dispatch, calendarStore, masterStore } = props;
  const { detailCalendar } = calendarStore;
  const { profile } = masterStore;
  const [reason, setReason] = useState('');
  const [cancelSuccessState, setCancelSuccessState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncCalendar, setSyncCalendar] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const syncGG = async () => {
    const res = await dispatch({
      type: 'EVENT/syncGoogleCalendar',
      payload: {
        start_date: moment()
          .hour(0)
          .minute(0)
          .second(0)
          .format('YYYY-MM-DDTHH:mm:ssZ'),
      },
    });
    if (res) {
      setSyncCalendar(true);
    } else {
      setVisibleModal(true);
    }
  };

  const syncMicrosoft = async () => {
    const res = await dispatch({
      type: 'EVENT/syncMicrosoftCalendar',
      payload: {
        timeZone: zone.tz.guess(),
      },
    });
    if (res) {
      setSyncCalendar(true);
    } else {
      setVisibleModal(true);
    }
  };

  const checkSync = async () => {
    if (profile?.id) {
      if (profile.type_login === 1 && !syncCalendar) {
        await syncGG();
      } else if (profile.type_login === 2 && !syncCalendar) {
        await syncMicrosoft();
      } else {
        setSyncCalendar(true);
      }
    }
  };

  useEffect(() => {
    checkSync();
  }, [profile]);

  useEffect(() => {
    if (history.location.query.code) {
      const payload = { calendarId: history.location.query.id };
      dispatch({ type: 'CALENDAR/getDetailCalendarByGuess', payload });
    }
    if (!history.location.query.code) {
      const payload = { calendarId: history.location.query.id };
      dispatch({ type: 'CALENDAR/getDetailCalendar', payload });
    }
  }, []);
  const cancelBookingFunction = () => {
    if (!history.location.query.code) {
      const payload = {
        calendarId: history.location.query.id,
        cancel_reason: reason,
        _method: 'DELETE',
        setCancelSuccessState: setCancelSuccessState,
        setLoading: setLoading,
      };
      dispatch({ type: 'CALENDAR/cancelBooking', payload });
    } else {
      const payload = {
        calendarId: history.location.query.id,
        cancel_reason: reason,
        _method: 'DELETE',
        code: history.location.query.code,
        setCancelSuccessState: setCancelSuccessState,
        setLoading: setLoading,
      };
      dispatch({ type: 'CALENDAR/cancelBookingByGuest', payload });
    }
  };

  return cancelSuccessState || !detailCalendar ? (
    <CancelBookingComplete detailCalendar={detailCalendar} />
  ) : (
    <div className={styles.cancelBookingLayout}>
      {/* <ReLoginPopup
        setVisibleModal={setVisibleModal}
        visibleModal={visibleModal}
        setSyncCalendar={setSyncCalendar}
      /> */}
      <Header />
      <div className={styles.cancelBooking}>
        <div className={styles.progressBar}>
          <div className={`${styles.firstStep} ${styles.activeStep}`}>
            <span>1</span>
            <p>{formatMessage({ id: 'i18n_confirm_content' })}</p>
          </div>
          <div className={styles.dottedBar}></div>
          <div className={styles.secondStep}>
            <span>2</span>
            <p>{formatMessage({ id: 'i18n_cancel_done' })}</p>
          </div>
        </div>
        <div className={styles.pageTitle}>
          <div className={styles.titleIcon}></div>
          <span>{formatMessage({ id: 'i18n_cancel_booking' })}</span>
        </div>
        <div className={styles.cancelationDetail}>
          <div className={styles.comment}>
            <div className={styles.divTitle}>
              <div className={styles.blackIcon}></div>
              <span>{formatMessage({ id: 'i18n_comment' })}</span>
            </div>
            <span className={styles.note}>
              {formatMessage({ id: 'i18n_cancel_comment_note' })}
            </span>
            <Input.TextArea
              value={reason != null ? reason : ''}
              onChange={event => setReason(event.target.value)}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.divTitle}>
              <div className={styles.blackIcon}></div>
              <span>{formatMessage({ id: 'i18n_content_label' })}</span>
            </div>
            <div className={styles.detail}>
              <p>
                {detailCalendar.event_name}（{detailCalendar.block_number}
                分）
              </p>
              <div className={styles.groupLine}>
                <p>
                  {getJPFullDate(detailCalendar.start_time)}
                  {moment(detailCalendar.start_time).format('(dd)')} &nbsp;
                  {moment(detailCalendar.start_time).format(HOUR_FORMAT)}～
                  {moment(detailCalendar.start_time)
                    .add(detailCalendar.block_number, 'minutes')
                    .format('HH:mm')}
                </p>
                <p>
                  (内容：イベント時間{detailCalendar.block_number}分
                  {detailCalendar.move_number
                    ? `往復移動時間${detailCalendar.move_number * 2}分`
                    : '往復移動時間なし'}
                  )
                </p>
              </div>
              <div className={styles.groupLine}>
                <p>{detailCalendar.owner_name}</p>
                <p>{detailCalendar.owner_company}</p>
              </div>
              <div className={styles.groupLine}>
                <p>
                  {formatMessage({ id: 'i18n_meeting_format' })}：
                  {detailCalendar.category_name}
                </p>
                <p>
                  {formatMessage({ id: 'i18n_meeting_place' })}：
                  {detailCalendar.location_name}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.btnZone}>
          <Button
            className={styles.backBtn}
            onClick={() => history.push('/event?tab=3')}
          >
            {formatMessage({ id: 'i18n_turn_back' })}
          </Button>
          <Spin spinning={loading}>
            <Button
              className={styles.confirmCancelBtn}
              onClick={() => cancelBookingFunction()}
            >
              {formatMessage({ id: 'i18n_confirm_cancel' })}
            </Button>
          </Spin>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default connect(({ CALENDAR, MASTER }) => ({
  calendarStore: CALENDAR,
  masterStore: MASTER,
}))(CancelBooking);
