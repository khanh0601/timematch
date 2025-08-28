import google_calendar_logo from '@/assets/images/i-calendar.png';
import office_365 from '@/assets/images/i-office-365.png';
import { getJPFullDate, meetingMethod } from '@/commons/function.js';
import { HOUR_FORMAT } from '@/constant';
import { Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { history, useIntl } from 'umi';
import styles from './styles.less';

function ConfirmBooking(props) {
  const {
    dispatch,
    eventInfo,
    start_time,
    end_time,
    userInfo,
    eventStore,
    selectedTime,
  } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const { scheduleInfo } = eventStore;
  const [urlGGCalendar, setUrlGGCalendar] = useState();
  const [urlOffice, setUrlOffice] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const payload = {
      setUrlOffice: setUrlOffice,
    };
    dispatch({ type: 'USER/getLinkConnectMicrosoft365', payload });
  }, []);
  useEffect(() => {
    const payload = {
      setUrlGGCalendar: setUrlGGCalendar,
    };
    dispatch({ type: 'USER/getLinkConnectGGCalendar', payload });
  }, []);

  const meetingType = {
    ZOOM: 1,
    GOOGLE_MEET: 2,
    PHONE: 3,
    PLACE: 4,
    CUSTOM: 5,
  };
  return (
    <div>
      <div className={styles.confirmBooking}>
        <div className={styles.mainContent}>
          <div className={styles.headTitle}>
            <div className={styles.bolderIcon}></div>
            <div className={styles.titleIcon}></div>
            <span>{formatMessage({ id: 'i18n_adjusted_schedule' })}</span>
          </div>
          <div className={styles.textLeft}>
            <p className={styles.eventInfo}>
              {getJPFullDate(selectedTime)}
              {moment(start_time).format('(dd)')}&nbsp;
              {moment(start_time).format(HOUR_FORMAT)}～
              {moment(end_time).format(HOUR_FORMAT)}
            </p>
            <p className={styles.eventInfo}>
              <div>{userInfo.company}</div>
              <div className={styles.mb_20}>{userInfo.name}</div>
              <div>
                {formatMessage({ id: 'i18n_meeting_format' })}：
                {eventInfo.real_category}
              </div>
              <div>
                {formatMessage({ id: 'i18n_meeting_place' })}：
                {meetingMethod(eventInfo)}
              </div>
              {scheduleInfo.location_type === meetingType.ZOOM && (
                <>
                  ZOOM URL :{' '}
                  <a
                    className={styles.locationLink}
                    href={scheduleInfo.zoom_url}
                    target="_blank"
                  >
                    {scheduleInfo.zoom_url}
                  </a>
                </>
              )}
              {scheduleInfo.location_type === meetingType.GOOGLE_MEET && (
                <>
                  Google Meet URL :{' '}
                  <a
                    className={styles.locationLink}
                    href={scheduleInfo.google_meet_url}
                    target="_blank"
                  >
                    {scheduleInfo.google_meet_url}
                  </a>
                </>
              )}
              {scheduleInfo.location_type !== meetingType.ZOOM &&
                scheduleInfo.location_type !== meetingType.GOOGLE_MEET &&
                eventInfo.location_name}
            </p>
            <p className={styles.eventInfoNoBottom}>
              {userInfo.name}
              {formatMessage({ id: 'i18n_comment_from' })}
            </p>
            {eventInfo.calendar_confirm_comment && (
              <pre>{eventInfo.calendar_confirm_comment}</pre>
            )}
            <pre className={styles.eventInfo}>
              カレンダーに下記より登録いただけます
            </pre>
          </div>
          <div className={styles.linkedBtns}>
            <a
              className={styles.ggCalendar}
              href={urlGGCalendar}
              target="_blank"
            >
              <img src={google_calendar_logo} />
              <div>
                {formatMessage({ id: 'i18n_register_to_google_calendar' })}
              </div>
            </a>
            <a className={styles.office365} href={urlOffice} target="_blank">
              <img src={office_365} />
              <div>
                {formatMessage({ id: 'i18n_register_to_microsoft_365' })}
              </div>
            </a>
          </div>
        </div>
        <div className={styles.suggestBanner}>
          <div className={styles.mainContent}>
            <span>Smoothlyに登録して日程調整業務を自動化しませんか？</span>
            <div className={styles.freeTrialBanner}>
              <div className={styles.freeTrialBannerContent}></div>
              今なら、2週間無料トライアルできます！
            </div>
          </div>
        </div>
        <div className={styles.mainContent}>
          <p className={styles.eventInfo}>
            サービス特徴は下記となります。
            <br />
            ■テレワークに最適！オンラインだけでなくオフラインのスケジュール調整も10秒で解決！
            <br />
            ■Google, Microsoft, Zoomなどのサービスと連携済み
            <br />
            ■候補日自動発行機能によりワンタッチで候補日を自動選択
            <br />
            ■オンライン、社内・社外ミーティング（移動時間も設定可能）、会食など用途ごとに詳細な設定が可能
            <br />
            ■自動更新されるため同じ候補日程を複数人に提案可能で、ダブルブッキングしない
            <br />
          </p>
          <div className={styles.btnZone}>
            <Button
              className={styles.registerBtn}
              onClick={() => history.push('/smooth-login')}
            >
              {formatMessage({ id: 'i18n_register_as_new_member_free' })}
            </Button>
          </div>
          <div className={styles.btnZone}>
            <Button
              className={styles.backToHomeBtn}
              onClick={() => history.push('/home')}
            >
              {formatMessage({ id: 'i18n_service_site' })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(({ EVENT }) => ({
  eventStore: EVENT,
}))(ConfirmBooking);
