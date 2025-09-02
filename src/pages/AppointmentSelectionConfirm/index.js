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
import iconBack from '@/assets/images/i-back-white.png';
import iconClose from '@/assets/images/i-close-white.png';
import { ROUTER } from '@/constant';
import useIsPc from '@/hooks/useIsPc';

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
      <HeaderMobile
        title={formatMessage({ id: 'i18n_appointment_success_title' })}
        isShowLeft={true}
        isShowRight={true}
        itemLeft={{
          event: 'back',
          url: `/appointment-selection?id=${history.location.query.id}&name=${history.location.query.name}`,
          icon: iconBack,
          bgColor: 'bgPrimaryBlue',
        }}
        itemRight={{
          event: 'backRight',
          url: ROUTER.home,
          icon: iconClose,
          bgColor: 'bgPrimaryBlue',
        }}
      />
      <div
        style={{
          padding: 10,
        }}
      >
        {' '}
        <div style={{ marginBottom: 20, fontSize: 16 }}>
          こちらの日程で調整希望を送信しました。
        </div>
        <div
          style={{
            padding: 10,
            border: '1px solid ',
            borderRadius: 8,
            marginBottom: 50,
          }}
        >
          <p>
            <div>イベント名: {informationVote?.name}</div>
            <div>ミーティング詳細</div>
            {history.location?.state?.choices
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
              ))}
          </p>
          <p>
            <div>
              ▽ミーティング参加予定者: {history.location.state.information.name}
            </div>
            {/*<div>▼ミーティング形式: {informationVote?.category_name}</div>*/}
            {/*<div>マミーティング場所:{informationVote?.location_name}</div>*/}
            <div>▽ミーティング時間: {informationVote?.block_number}分</div>
            <div>▽コメント: {history.location.state?.information?.comment}</div>
          </p>
        </div>
        {!profile?.id && !getCookie('token') && (
          <div
            style={{
              padding: 20,
              border: '1px solid #3a3a3a',
              borderRadius: 8,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              新規会員登録・ログインいただくと、
              <br />
              あなたの予定が入っている箇所が表示され便利です。
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  width: '50%',
                  background: '#9db9fa',
                  textAlign: 'center',
                  padding: 8,
                  color: 'white',
                  borderRadius: 8,
                }}
                onClick={() => history.push('/register')}
              >
                新規会員登録(無料)
              </div>
              <div
                style={{
                  width: '50%',
                  background: '#004491',
                  textAlign: 'center',
                  padding: 8,
                  color: 'white',
                  borderRadius: 8,
                }}
                onClick={() => history.push('/login')}
              >
                ログイン
              </div>
            </div>
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
