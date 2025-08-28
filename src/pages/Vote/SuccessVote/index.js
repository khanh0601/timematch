import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Button } from 'antd';
import { meetingMethod, getJPFullDate, getStep } from '@/commons/function.js';
import { HOUR_FORMAT } from '@/constant';
import moment from 'moment';
import iconGoogle from '@/assets/images/google-success-vote.png';
import iconOffice from '@/assets/images/office-red.png';
import config from '../../../config';

function SuccessVote({
  dispatch,
  choices,
  eventStore,
  eventInfo,
  userInfo,
  start_time,
  end_time,
  selectedTime,
  type,
}) {
  const { scheduleInfo } = eventStore;

  const intl = useIntl();
  const { formatMessage } = intl;
  const [urlOffice, setUrlOffice] = useState();
  const [urlGGCalendar, setUrlGGCalendar] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (type === 1) {
      const payload = {
        setUrlOffice: setUrlOffice,
      };
      dispatch({ type: 'USER/getLinkConnectMicrosoft365', payload });
    }
  }, []);

  useEffect(() => {
    if (type === 1) {
      const payload = {
        setUrlGGCalendar: setUrlGGCalendar,
      };
      dispatch({ type: 'USER/getLinkConnectGGCalendar', payload });
    }
  }, []);

  const arr = [
    {
      icon: '①',
      text: '1対1での日程調整だけでなく、',
      text2: '複数社（3社間以上）での日程調整も可能！',
    },
    {
      icon: '②',
      text: 'チーム機能により、チームメンバー全体での',
      text2: '日程調整や代理人による調整も簡単にできる！',
    },
    {
      icon: '③',
      text: 'ダブルブッキングの心配なし。自動更新されるので、',
      text2: '同じ候補日程を複数人に提案可能！',
    },
    {
      icon: '④',
      text: 'Webサイトへ日程調整カレンダーの',
      text2: '埋め込み機能により、アポイント数増加！',
    },
  ];
  const meetingType = {
    ZOOM: 1,
    GOOGLE_MEET: 2,
    PHONE: 3,
    PLACE: 4,
    CUSTOM: 5,
    MICROSOFT: 6,
  };

  const openLink = url => {
    if (url === 'なし') {
      return;
    }
    window.open(url, '_blank');
  };

  const disabledLink = url => {
    return url === 'なし';
  };

  const showLink = () => {
    let title;
    let linkUrl;
    const typeShow = [
      meetingType.ZOOM,
      meetingType.GOOGLE_MEET,
      meetingType.MICROSOFT,
    ];
    const {
      zoom_url,
      location_type,
      microsoft_team_url,
      google_meet_url,
    } = scheduleInfo;
    if (!typeShow.includes(location_type)) {
      return;
    }
    switch (location_type) {
      case meetingType.ZOOM:
        title = 'Zoom URL :';
        linkUrl = zoom_url;
        break;
      case meetingType.GOOGLE_MEET:
        title = 'Google Meet URL :';
        linkUrl = google_meet_url;
        break;
      case meetingType.MICROSOFT:
        title = 'Microsoft URL :';
        linkUrl = microsoft_team_url;
        break;
      default:
        title = 'Zoom URL :';
        linkUrl = zoom_url;
    }
    let objCss = styles.locationLink;
    if (disabledLink(linkUrl)) {
      objCss += ' ' + styles.notOpenLink;
    }
    return (
      <div>
        <span>{title}</span>
        <a className={objCss} onClick={() => openLink(linkUrl)}>
          {linkUrl}
        </a>
      </div>
    );
  };

  const redirectPage = url => {
    history.push(url);
  };

  return (
    <div>
      <div className={styles.confirmBooking}>
        <div className={styles.mainContent}>
          <div className={styles.stepCalendarTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />
            </div>

            {type && <h2>{type === 1 ? '日程調整完了' : '完了しました'}</h2>}
          </div>

          {/* vote */}
          {type === 2 && (
            <>
              <div className={styles.note}>
                <div className={styles.noteItem}>
                  <p>日程調整いただきありがとうございました。</p>
                </div>

                <div className={styles.noteItem}>
                  <p>
                    ご選択及びご入力いただいた内容を、
                    <span className={styles.hideSm}>
                      いただきましたメールに送信しております。
                    </span>
                  </p>
                </div>

                <div className={`${styles.noteItem} ${styles.hidePc}`}>
                  <p>メールに送信しております。</p>
                </div>

                <div className={styles.noteItem}>
                  <p>ご確認いただけると幸いです。</p>
                </div>
              </div>

              <div className={styles.inforConfirmSuccess}>
                <div className={styles.comment}>
                  <p>
                    <a>無料会員登録</a> いただくと、連携カレンダーに{' '}
                    <span>「仮予約」として予定が自動登録できます！</span>
                  </p>
                  <p className={styles.hidePc}>
                    「仮予約」として予定が自動登録できます！
                  </p>
                  <p>
                    メリットとして、 <a>ダブルブッキング</a>{' '}
                    <span>を防ぐことができるので大変便利です！</span>
                  </p>
                  <p className={styles.hidePc}>
                    を防ぐことができるので大変便利です！
                  </p>
                </div>
                <div className={styles.time}>
                  【仮予約】 【<span>○○</span>様】 午後15：00ー16:00
                </div>
                <p className={styles.descriptImage}>※上記はイメージです</p>
              </div>

              <div className={styles.description}>
                ぜひ下記より無料トライアルを お申し込みください。
              </div>
            </>
          )}

          {/*1:1*/}
          {type === 1 && (
            <>
              <div className={styles.textLeft}>
                <p className={styles.eventInfo}>
                  {getJPFullDate(selectedTime)}
                  {moment(start_time).format('(dd)')}&nbsp;&nbsp;&nbsp;&nbsp;
                  {moment(start_time).format(HOUR_FORMAT)}～
                  {moment(end_time).format(HOUR_FORMAT)}
                </p>
                <div className={styles.eventInfo}>
                  <div>{userInfo.company}</div>
                  <div className={styles.mb_20}>{userInfo.name}</div>
                  <div>
                    {formatMessage({ id: 'i18n_meeting_format' })}：
                    {eventInfo.real_category}
                  </div>
                  <div className={styles.meetingPlace}>
                    {formatMessage({ id: 'i18n_meeting_place' })}：
                    {meetingMethod(eventInfo)}
                  </div>
                  {showLink()}
                </div>
                <p className={styles.eventInfoNoBottom}>
                  {userInfo.name} {formatMessage({ id: 'i18n_comment_from' })}
                </p>

                {userInfo.comment && <p>{userInfo.comment}</p>}

                <p className={styles.eventRegister}>
                  カレンダーに下記より登録いただけます
                </p>
              </div>
              <div className={styles.grid}>
                <div>
                  <a href={urlGGCalendar} target="_blank">
                    <img src={iconGoogle} />
                    <span className={styles.textPc}>
                      Googleカレンダーに登録
                    </span>
                    <span className={styles.textSM}>
                      Googleアカウントでログイン
                    </span>
                    <span className={styles.linkSm}>※法人</span>
                  </a>
                </div>
                {/* End Google */}
                {/* Microsoft */}
                <div>
                  <a href={urlOffice} target="_blank">
                    <img src={iconOffice} />
                    <span className={styles.textPc}>Microsoftに登録</span>
                    <span className={styles.textSM}>
                      Microsoftアカウントでログイン
                    </span>
                    <span className={styles.linkSm}>※法人</span>
                  </a>
                  {/*</Button>*/}
                </div>
                {/* End Microsoft */}
              </div>
              <div className={styles.banner}>
                Smoothlyに無料登録して日程調
                <div />
                整業務を自動化しませんか？
              </div>
            </>
          )}

          <div className={styles.btnServices}>
            <div>
              <Button
                className={styles.btnRegister}
                onClick={() => redirectPage('/registration')}
              >
                <span>新規会員登録（無料）</span>
              </Button>
            </div>

            <div>
              <Button
                className={styles.btnHome}
                onClick={() => (window.location.href = config.URL_COMPANY)}
              >
                <span>サービスサイト</span>
              </Button>
            </div>
          </div>

          <div className={styles.note}>
            {arr.map((item, index) => (
              <div
                key={index}
                className={`${styles.noteItem} ${styles.noteItemEnd}`}
              >
                <span>{item.icon}</span>
                <p>
                  {item.text}
                  <br /> {item.text2}
                </p>
                {/*<br/>*/}
                {/*<p>{item.text2}</p>*/}
              </div>
            ))}
            <p className={styles.noteLast}>
              上記以外にも様々な機能がございます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(({ EVENT }) => ({
  eventStore: EVENT,
}))(SuccessVote);
