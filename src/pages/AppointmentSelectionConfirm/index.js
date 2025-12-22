import {
  createTimeAsync,
  profileFromStorage,
  tz,
  getJPMonthAndDay,
  getCookie,
} from '@/commons/function.js';
import { CloseOutlined, LeftOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { history, useIntl, withRouter } from 'umi';
import moment from 'moment';
import { HOUR_FORMAT } from '@/constant';
import styles from './styles.less';
import HeaderMobile from '@/components/Mobile/Header';
import icName from '@/assets/images/ic_name.png';
import useIsPc from '@/hooks/useIsPc';
import PCHeader from '@/components/PC/Header';

const AppointmentSelectionConfirm = props => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const profile = profileFromStorage();
  const { formatMessage } = intl;
  const [savePolicy, setSavePolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dispatch, voteStore, masterStore } = props;
  const { informationVote, voteGuest, eventDateTimeGuest } = voteStore;

  const isPc = useIsPc();

  const onCheck = event => {
    setSavePolicy(event.target.checked);
  };

  const getData = async () => {
    const payload = {
      vote: history.location.query.id,
      user_code: profile ? profile.code : '',
      type: 2, // screen B
    };
    const payloadShow = {
      id: history.location.query.id,
    };
    if (history.location.query.name) {
      payloadShow.name = history.location.query.name;
    } else if (history.location.query.invitee) {
      payloadShow.invitee = history.location.query.invitee;
    } else if (history.location.query.code) {
      payloadShow.code = history.location.query.code;
    }
    await dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });
    const { startTime, endTime } = createTimeAsync();
    await dispatch({
      type: 'VOTE/getVoteGuestSummary',
      payload: {
        ...payload,
        start: startTime,
        end: endTime,
        timeZone: tz(),
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmit = () => {
    form.validateFields().then(values => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
  };

  return (
    <div className={styles.appointmentSelectionConfirmContainer}>
      <PCHeader />
      <div className={styles.contentWrapper}>
        <div className={styles.title}>
          こちらの日程で調整希望を送信しました。
        </div>
        <div className={styles.content}>
          <div className={styles.eventNameWrapper}>
            <div className={styles.eventNameIcon}>
              <img src={icName} alt="icon name" />
            </div>
            <div className={styles.eventNameContent}>
              イベント名: {informationVote?.name}
            </div>
          </div>

          <div className={styles.meetingDetails}>
            <div className={styles.meetingDetailsTitle}>ミーティング詳細</div>
            {/* {history.location?.state?.choices
              .filter(item => item.option === 1)
              .map((item, index) => (
                <>
                  <div>日程{index + 1}</div>
                  <div>
                    ▽開催日時:
                    {getJPMonthAndDay(
                      eventDateTimeGuest.find(
                        e => item?.event_datetime_id === e?.id,
                      )?.start_time,
                    )}
                    {moment(
                      eventDateTimeGuest.find(
                        e => item?.event_datetime_id === e?.id,
                      )?.start_time,
                    ).format('(dd)')}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {moment(
                      eventDateTimeGuest.find(
                        e => item?.event_datetime_id === e?.id,
                      )?.start_time,
                    ).format(HOUR_FORMAT)}
                    &nbsp; ～ &nbsp;
                    {moment(
                      eventDateTimeGuest.find(
                        e => item?.event_datetime_id === e?.id,
                      )?.end_time,
                    ).format(HOUR_FORMAT)}
                  </div>
                </>
              ))} */}
            <div>
              ▽ミーティング参加予定者: {history.location.state.information.name}
            </div>
            {/*<div>▼ミーティング形式: {informationVote?.category_name}</div>*/}
            {/*<div>マミーティング場所:{informationVote?.location_name}</div>*/}
            <div>▽ミーティング時間: {informationVote?.block_number}分</div>
            <div>▽コメント: {history.location.state?.information?.comment}</div>
          </div>
        </div>
        {!profile?.id && !getCookie('token') ? (
          <div>
            <div className={styles.loginContentWrap}>
              <div className={styles.loginContentLine}></div>
              <div className={styles.loginContentText}>または</div>
              <div className={styles.loginContentLine}></div>
            </div>
            <div className={styles.loginContentSub}>
              新規会員登録・ログインいただくと、
              <br />
              あなたの予定が入っている箇所が表示され便利です。
            </div>
            <div className={styles.loginContentButtonWrap}>
              <div
                className={styles.registerButton}
                onClick={() => history.push('/register')}
              >
                新規登録
              </div>
              <div
                className={styles.loginButton}
                onClick={() => history.push('/login')}
              >
                ログイン
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.buttonWrapper}>
            <button
              className={styles.buttonBackToList}
              onClick={() => history.push('/')}
            >
              調整一覧へ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default connect(({ EVENT, MASTER, VOTE }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  voteStore: VOTE,
}))(withRouter(AppointmentSelectionConfirm));
