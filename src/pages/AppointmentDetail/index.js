import BubbleChatIcon from './icon/BubbleChatIcon';
import './styles.less';
import { connect } from 'dva';
import { useEffect } from 'react';
import { withRouter } from 'umi';
import { HOUR_FORMAT } from '@/constant';
import moment from 'moment';
import { notify, personalExpiredModal } from '@/commons/function';
import { TYPE_VOTE_RELATIONSHIP } from '@/constant';
import { useState } from 'react';
import { Modal } from 'antd';
import { Button } from 'antd';
import { useIntl } from 'umi';
import { history } from 'umi';
import {
  profileFromStorage,
  createTimeAsync,
  tz,
  getJPMonthAndDay,
} from '@/commons/function';
import { useParams } from 'umi';

const AppointmentDetail = props => {
  const { dispatch, voteStore, location } = props;

  const profile = profileFromStorage();
  const formatMessage = useIntl().formatMessage;
  const { startTime, endTime } = createTimeAsync();
  const { informationVote, voteUser, eventDateTimeUser } = voteStore;
  const [isShowModal, setIsShowModal] = useState({
    deleteTeam: false,
    deleteEventVote: false,
    cloneEventVoted: false,
  });
  const [idEventDateTime, setIdEventDateTime] = useState('');

  const handleSubmitOK = async (force = false) => {
    const payload = {
      vote: location.query.id,
      user: profile.code,
      event_datetime: idEventDateTime,
      time_zone: tz(),
      force,
    };
    const res = await dispatch({ type: 'VOTE/postUserVote', payload });
    if (res) {
      history.push('/calendar');
    }
  };

  const getData = async () => {
    const payloadShow = {
      id: location.query.id,
    };
    if (location.query.name) {
      payloadShow.name = location.query.name;
    }
    await dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });
  };

  useEffect(() => {
    const { startTime, endTime } = createTimeAsync();
    const payload = {
      vote: location.query.id,
      type: 1, // screen A
      start: startTime,
      end: endTime,
      timeZone: tz(),
    };
    dispatch({ type: 'VOTE/getVoteUserSummary', payload });
    getData();
  }, []);

  const IsAll = () => {
    return (
      (location.query.member_all || location.query.team_all) && listPaginateTeam
    );
  };

  const IsIndividual = () => {
    return (
      !location.query.member_all && !location.query.team_all && paginateEvents
    );
  };

  const editEvent = () => {
    if (informationVote && informationVote?.team_id) {
      history.push(
        `/calendar-creation?idEvent=${informationVote?.id}&edit=true&relationship_type=${TYPE_VOTE_RELATIONSHIP}&team_id=${informationVote?.team_id}&member_id=${informationVote?.user_id}`,
      );
    } else {
      history.push(
        `/calendar-creation?idEvent=${informationVote?.id}&edit=true&relationship_type=${TYPE_VOTE_RELATIONSHIP}&member_id=${informationVote?.user_id}`,
      );
    }
  };

  const cloneEvent = item => {
    if (checkUserExpired(item?.has_member_expired)) {
      return;
    }
    history.push(
      `/calendar-creation?idEvent=${informationVote?.id}&clone=1&relationship_type=${TYPE_VOTE_RELATIONSHIP}&member_id=${informationVote?.user_id}`,
    );
  };

  const checkUserExpired = member_expired => {
    const { team_all, team_id } = location.query;
    let prevent;
    if (team_all || team_id) {
      if (isExpired() || member_expired) {
        personalExpiredModal();
        prevent = true;
      }
    }
    return prevent;
  };

  const showModal = () => {
    setIsShowModal({
      deleteTeam: false,
      deleteEventVote: true,
      cloneEventVoted: false,
    });
  };

  async function handleOk() {
    setIsShowModal({
      deleteTeam: false,
      deleteEventVote: false,
      cloneEventVoted: false,
    });
    await dispatch({ type: 'TAB/setLoading', payload: true });
    if (informationVote?.vote?.teamSlug) {
      await dispatch({
        type: 'TAB/deletePaginateTeam',
        payload: { team_id: teamID },
      });
      const payload = {
        page: pageIndex,
      };
      if (location.query.team_id) {
        history.push({ pathname: '/', search: '?tab=2&team_all=true' });
        await dispatch({ type: 'TEAM/getTeam' });
      } else {
        await dispatch({ type: 'TAB/getPaginateTeam', payload });
        await dispatch({ type: 'TEAM/getTeam' });
      }

      await dispatch({ type: 'TAB/setLoading', payload: false });
      return;
    }
    const payload = {
      eventTypeId: informationVote?.id,
    };
    const res = await dispatch({ type: 'EVENT/deleteEventType', payload });
    history.go(-1);
    await dispatch({ type: 'TAB/setLoading', payload: false });
  }

  return (
    <div className="appointment-detail">
      <div className="header">
        <div className="header-line"></div>
        <div className="header-title">懇親会</div>
      </div>
      <div className="content">
        <div className="table-content">
          <div
            style={{
              gridTemplateColumns: `repeat(${voteUser.length + 5}, 1fr)`,
            }}
            className="grid header-grid"
          >
            <div className="grid-item span-2">日程</div>
            <div className="grid-item">OK</div>
            <div className="grid-item">NG</div>
            {voteUser.map(item => (
              <div className="grid-item" title={item.name}>
                {item.name}
              </div>
            ))}
            <div className="grid-item"></div>
          </div>
          {eventDateTimeUser?.map(item => (
            <div
              style={{
                gridTemplateColumns: `repeat(${voteUser?.length + 5}, 1fr)`,
              }}
              className="grid white-grid"
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
              {voteUser.map(voter => (
                <div className="grid-item">
                  {item?.choices?.find(choice => choice.voter_id === voter.id)
                    ?.option ? (
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
                onClick={() => {
                  setIdEventDateTime(item.id);
                }}
                className={`grid-item bordered ${
                  item.id === idEventDateTime ? 'blue-background' : ''
                }`}
              >
                確定
              </div>
            </div>
          ))}

          <div
            style={{
              gridTemplateColumns: `repeat(${voteUser?.length + 5}, 1fr)`,
            }}
            className="grid white-grid"
          >
            <div className="grid-item span-2">コメント</div>
            <div className="grid-item"></div>
            <div className="grid-item"></div>
            {voteUser.map(item => (
              <div className="grid-item">
                {item.comment && <BubbleChatIcon />}
              </div>
            ))}

            <div className="grid-item"></div>
            <div className="grid-item"></div>
          </div>
        </div>
        <div className="buttons">
          <div
            onClick={() => {
              if (idEventDateTime === '') {
                return;
              } else {
                handleSubmitOK();
              }
            }}
            className="button blue"
          >
            <div style={{ marginLeft: 10 }}>決定</div>
          </div>
          <div
            onClick={() => {
              cloneEvent(informationVote);
            }}
            className="button light-blue"
          >
            <div style={{ marginLeft: 10 }}>再調整</div>
          </div>
          <div
            onClick={() => {
              showModal();
            }}
            className="button red"
          >
            <div style={{ marginLeft: 10 }}>削除</div>
          </div>
        </div>
      </div>
      <Modal open={isShowModal.deleteEventVote} closable={false} footer={null}>
        <div className="modalDelete">
          <div className="modalTitle">
            {formatMessage({ id: 'i18n_title_delete_event_type' })}
          </div>
          <div className="btnGroup">
            <Button
              onClick={() => {
                setIsShowModal({
                  deleteTeam: false,
                  deleteEventVote: false,
                  cloneEventVoted: false,
                });
              }}
              className="btn btnWhite"
            >
              {formatMessage({ id: 'i18n_cancel_delete' })}
            </Button>
            <Button onClick={() => handleOk()} className="btn btnGreen">
              {formatMessage({ id: 'i18n_confirm_delete_event' })}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ EVENT, MASTER, VOTE }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  voteStore: VOTE,
}))(withRouter(AppointmentDetail));
