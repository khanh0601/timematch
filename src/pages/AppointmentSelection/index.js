import BubbleChatIcon from '@/pages/AppointmentDetail/icon/BubbleChatIcon';
import './styles.less';
import { connect } from 'dva';
import { useEffect } from 'react';
import { withRouter } from 'umi';
import { HOUR_FORMAT } from '@/constant';
import {
  profileFromStorage,
  createTimeAsync,
  tz,
  getJPMonthAndDay,
} from '@/commons/function';
import { useParams } from 'umi';
import { Input } from 'antd';
import googleCalendarIcon from '@/assets/images/google-calendar-icon.png';
import { useState, useLayoutEffect } from 'react';
import { history } from 'umi';
import moment from 'moment';
import AvailableTimeModal from './AvailableTimeModal';
const AppointmentSelection = props => {
  const [openAvailableTimeModal, setOpenAvailableTimeModal] = useState(false);
  const { dispatch, voteStore, location } = props;
  const profile = profileFromStorage();
  const [isLandScape, setIsLandScape] = useState(false);
  const { id } = useParams();
  const { startTime, endTime } = createTimeAsync();
  const { eventDateTimeGuest, voteGuest } = voteStore;
  const [toggleOkEvent, setToggleOkEvent] = useState(null);
  const [comment, setComment] = useState('');

  const onOpenAvailableTimeModal = () => {
    setOpenAvailableTimeModal(true);
  };

  const onCloseAvailableTimeModal = () => {
    setOpenAvailableTimeModal(false);
  };

  const onChangeComment = e => {
    setComment(e.target.value);
  };
  const getData = async () => {
    const profile = profileFromStorage();
    const payload = {
      vote: location.query.id,
      user_code: profile ? profile.code : '',
      type: 2, // screen B
    };
    const payloadShow = {
      id: location.query.id,
    };
    if (location.query.name) {
      payloadShow.name = location.query.name;
    } else if (location.query.invitee) {
      payloadShow.invitee = location.query.invitee;
    } else if (location.query.code) {
      payloadShow.code = location.query.code;
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

  useEffect(() => {
    const events = eventDateTimeGuest.map(item => {
      return {
        id: item.id,
        isOk: false,
      };
    });
    setToggleOkEvent(events);
  }, [eventDateTimeGuest]);

  useEffect(() => {
    if (profile?.code) {
      const payloadShow = {
        id: `お打合せ9`,
      };
      payloadShow.name = 'd3294fdb-65e7-4189-9891-5e3a90f8b1bf';
      dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });
    }
  }, []);

  useLayoutEffect(() => {
    setIsLandScape(window.orientation === 90 || window.orientation === -90);
  }, []);

  useEffect(() => {
    window.addEventListener(
      'orientationchange',
      function() {
        setIsLandScape(window.orientation === 90 || window.orientation === -90);
      },
      false,
    );
  }, []);
  return (
    <div className="appointment-selection">
      <div className="header">
        <div className="header-line"></div>
        <div className="header-title">懇親会</div>
      </div>
      <div style={{ padding: 10 }}>○○日までに回答をお願いいたします。</div>
      <div className="content">
        {isLandScape ? (
          <div
            style={{
              padding: 10,
              background: '#e1e1e1',
              width: '100%',
              overflowX: 'scroll',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${eventDateTimeGuest.length +
                  1}, 1fr)`,
                gap: 2,
                alignItems: 'center',
                color: 'white',
                fontSize: 16,
                fontWeight: '500',
              }}
            >
              <div
                style={{ background: '#e1e1e1', padding: 8, width: 200 }}
              ></div>
              {eventDateTimeGuest.map((item, index) => (
                <div
                  style={{
                    background: '#5b8bfc',
                    padding: 8,
                    textAlign: 'center',
                    width: 200,
                  }}
                >
                  {getJPMonthAndDay(item.start_time)}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {moment(item.start_time).format('(dd)')}
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${eventDateTimeGuest.length +
                  1}, 1fr)`,
                gap: 2,
                alignItems: 'center',
                marginTop: 2,
                color: 'white',
                fontSize: 16,
                fontWeight: '500',
              }}
            >
              <div style={{ background: '#e1e1e1', width: 200 }}></div>
              {eventDateTimeGuest.map((item, index) => (
                <div
                  style={{
                    background: '#5b8bfc',
                    padding: 8,
                    textAlign: 'center',
                    width: 200,
                  }}
                >
                  {moment(item.start_time).format(HOUR_FORMAT)}
                  &nbsp; ～ &nbsp;
                  {moment(item.end_time).format(HOUR_FORMAT)}
                </div>
              ))}
            </div>
            {voteGuest.map(voter => (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${eventDateTimeGuest.length +
                    1}, 1fr)`,
                  gap: 2,
                  alignItems: 'center',
                  marginTop: 2,
                  fontSize: 16,
                  fontWeight: '500',
                }}
              >
                <div
                  style={{
                    background: '#fafafb',
                    padding: 8,
                    textAlign: 'center',
                    height: 40,
                    width: 200,
                  }}
                >
                  {voter.name}
                </div>
                {eventDateTimeGuest.map(item => (
                  <div
                    style={{
                      background: '#fafafb',
                      padding: 8,
                      textAlign: 'center',
                      height: 40,
                      width: 200,
                    }}
                  >
                    {item?.choices?.find(choice => choice.voter_id === voter.id)
                      ?.option ? (
                      <>
                        {' '}
                        {item?.choices?.find(
                          choice => choice.voter_id === voter.id,
                        )?.option === 1
                          ? '○'
                          : ' X'}
                      </>
                    ) : (
                      <>{'  '}</>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${eventDateTimeGuest.length +
                  1}, 1fr)`,
                gap: 2,
                alignItems: 'center',
                marginTop: 2,
                fontSize: 16,
                fontWeight: '500',
              }}
            >
              <div
                style={{
                  padding: 8,
                  textAlign: 'center',
                  width: 200,
                }}
              ></div>
              {eventDateTimeGuest.map(item => (
                <div
                  style={{
                    background: '#fafafb',
                    padding: 8,
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    width: 200,
                  }}
                >
                  <div
                    style={{
                      background: toggleOkEvent?.find(
                        toggle => item.id === toggle.id,
                      )?.isOk
                        ? '#8f8f8f'
                        : '#5b8bfc',
                      border: '1px solid #fff',
                      padding: '4px 10px',
                      borderRadius: 8,
                      color: '#FFF',
                    }}
                    onClick={() => {
                      const newToggleOkEvent = toggleOkEvent?.map(toggle => {
                        if (toggle.id === item.id) {
                          return {
                            ...toggle,
                            isOk: !toggle.isOk,
                          };
                        }
                        return toggle;
                      });
                      setToggleOkEvent(newToggleOkEvent);
                    }}
                  >
                    {toggleOkEvent?.find(toggle => item.id === toggle.id)?.isOk
                      ? 'NG'
                      : 'OK'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="table-content">
            <div
              style={{
                gridTemplateColumns: `repeat(${voteGuest.length + 5}, 1fr)`,
              }}
              className="grid header-grid"
            >
              <div className="grid-item span-2">日程</div>
              <div className="grid-item">OK</div>
              <div className="grid-item">NG</div>
              {voteGuest.map(item => (
                <div className="grid-item" title={item.name}>
                  {item.name}
                </div>
              ))}
              <div className="grid-item"></div>
            </div>
            {eventDateTimeGuest?.map((item, index) => {
              return (
                <div
                  style={{
                    gridTemplateColumns: `repeat(${voteGuest.length + 5}, 1fr)`,
                  }}
                  className={`grid ${
                    item.choices.every(choice => choice?.option === 1)
                      ? 'blue-grid'
                      : item.choices.every(
                          choice => choice.option === 2 || choice.option === 3,
                        )
                      ? 'grey-grid'
                      : 'white-grid'
                  }`}
                >
                  <div className="grid-item span-2">
                    {getJPMonthAndDay(item.start_time)}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {moment(item.start_time).format('(dd)')}
                    <br />
                    {moment(item.start_time).format(HOUR_FORMAT)}
                    &nbsp; ～ &nbsp;
                    {moment(item.end_time).format(HOUR_FORMAT)}
                  </div>
                  <div className="grid-item">
                    {item.choices.filter(choice => choice.option === 1).length}
                  </div>
                  <div className="grid-item">
                    {' '}
                    {
                      item.choices.filter(
                        choice => choice.option === 3 || choice.option === 2,
                      ).length
                    }
                  </div>
                  {voteGuest.map(voter => (
                    <div className="grid-item">
                      {item?.choices?.find(
                        choice => choice.voter_id === voter.id,
                      )?.option ? (
                        <>
                          {item?.choices?.find(
                            choice => choice.voter_id === voter.id,
                          )?.option === 1
                            ? '○'
                            : '×'}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                  <div
                    style={{
                      background: toggleOkEvent?.find(
                        toggle => item.id === toggle.id,
                      )?.isOk
                        ? '#8f8f8f'
                        : '#5b8bfc',
                      border: '1px solid #fff',
                    }}
                    onClick={() => {
                      const newToggleOkEvent = toggleOkEvent?.map(toggle => {
                        if (toggle?.id === item?.id) {
                          return {
                            ...toggle,
                            isOk: !toggle.isOk,
                          };
                        }
                        return toggle;
                      });
                      setToggleOkEvent(newToggleOkEvent);
                    }}
                    className={`grid-item bordered blue-background`}
                  >
                    {toggleOkEvent?.find(toggle => item?.id === toggle?.id)
                      ?.isOk
                      ? 'NG'
                      : 'OK'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div
        style={{
          marginLeft: 10,
          marginTop: 10,
          fontSize: 20,
          fontWeight: '600',
        }}
      >
        依頼者へのメッセージ
      </div>
      <div style={{ margin: 10 }}>
        <Input onChange={onChangeComment} size="large" />
      </div>
      <div style={{ marginTop: 50, marginBottom: 50 }} className="buttons">
        <div
          onClick={() => {
            history.push(
              `/appointment-selection-form?id=${location.query.id}&name=${location.query.name}`,
              {
                choices: toggleOkEvent,
                comment: comment,
              },
            );
          }}
          className="button blue"
        >
          <div style={{ marginLeft: 10 }}>決定</div>
        </div>
        <div onClick={onOpenAvailableTimeModal} className="button white">
          <div
            style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}
          >
            <img src={googleCalendarIcon} />
            Googleカレンダーと連携
          </div>
        </div>
      </div>
      <div
        style={{
          padding: 20,
          border: '1px solid #3a3a3a',
          margin: 10,
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
          >
            ログイン
          </div>
        </div>
      </div>
      <AvailableTimeModal
        open={openAvailableTimeModal}
        onClose={onCloseAvailableTimeModal}
      />
    </div>
  );
};

export default connect(({ EVENT, MASTER, VOTE }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  voteStore: VOTE,
}))(withRouter(AppointmentSelection));
