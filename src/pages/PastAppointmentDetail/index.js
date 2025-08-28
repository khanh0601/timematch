import './styles.less';
import PlusIcon from '../Top/icon/PlusIcon';
import { connect } from 'dva';
import { history, withRouter } from 'umi';
import { useParams } from 'umi';
import { useEffect } from 'react';
import moment from 'moment';
import { getStep } from '@/commons/function.js';
import { SwipeableList } from 'react-swipeable-list';
import SwipableItem from '@/components/SwipableItem';
import { profileFromStorage } from '@/commons/function';
import { createTimeAsync, tz } from '@/commons/function';
import { useState } from 'react';

const PastAppointmentDetail = props => {
  const { id } = useParams();
  const payload = { calendarId: id };
  const { dispatch, calendarStore, voteStore, location } = props;

  const { informationVote, voteUser, eventDateTimeUser } = voteStore;
  const profile = profileFromStorage();
  console.log('profile', profile, informationVote);

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

  return (
    <div className="container">
      <div className="header">
        <div className=""></div>
        <div className="header-title">詳細</div>
        <div
          onClick={() => {
            history.go(-1);
          }}
          className="close-btn"
        >
          <div
            style={{
              rotate: '45deg',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <PlusIcon />
          </div>
        </div>
      </div>

      {profile?.id === informationVote?.user?.id ? (
        <>
          <div className="content">
            <SwipeableList style={{ overflow: 'unset' }} fullSwipe={true}>
              <SwipableItem item={informationVote}>
                <div className="swipableItem">
                  <div className="swipableItemInner">
                    <div className="swipableItemInnerDiv"></div>
                    <div>
                      {/* format date time by japanese */}
                      <span>
                        {moment(informationVote?.calendar).format(
                          'MMMM Do (dd) HH:mm',
                        )}
                      </span>
                      <span>～</span>
                      <span>
                        {moment(informationVote?.calendar)
                          .add(getStep(informationVote), 'minutes')
                          .format('HH:mm')}
                      </span>
                    </div>
                  </div>
                  <div className="flexSpaceBetween">
                    <div className="flex2">調整済</div>{' '}
                    <div className="flex1">: {informationVote?.vote?.name}</div>
                  </div>
                  <div className="flexSpaceBetween">
                    <div className="flex2">会議形式</div>
                    <div className="flex1">
                      : {informationVote && informationVote?.real_category}
                    </div>
                  </div>
                  <div className="flexSpaceBetween">
                    <div className="flex2">イベント名</div>
                    <div className="flex1">
                      : {informationVote && informationVote?.name}
                    </div>
                  </div>
                  <div className="flexSpaceBetween">
                    <div className="flex2">ミーティング形式</div>
                    <div className="flex1">
                      {' '}
                      : {informationVote && informationVote?.category_name}
                    </div>
                  </div>
                  <div className="flexSpaceBetween">
                    <div className="flex2">ミーティング相手</div>
                    <div className="flex1">
                      : {informationVote && informationVote?.location_name}
                    </div>
                  </div>
                </div>
              </SwipableItem>
            </SwipeableList>
          </div>
          <div className="buttons">
            <div
              onClick={() => {
                history.push(
                  `/calendar-creation?idEvent=${informationVote?.id}&edit=true&relationship_type=1`,
                );
              }}
              className="button blue"
            >
              <div style={{ marginLeft: 10 }}>編集</div>
            </div>
            <div
              onClick={() => {
                history.push(
                  `/calendar-creation?idEvent=${informationVote?.id}&clone=1&relationship_type=${informationVote?.event_relationship_type}`,
                );
              }}
              className="button light-blue"
            >
              <div style={{ marginLeft: 10 }}>この日程を流用して新規作成</div>
            </div>
          </div>
        </>
      ) : (
        <div className="content">
          <div
            onClick={() => {
              history.push(`/past-appointment/${id}/edit`);
            }}
            className="swipableItem"
          >
            <div className="swipableItemInner">
              <div className="swipableItemInnerDiv"></div>
              <div>
                {/* format date time by japanese */}
                <span>
                  {moment(informationVote?.calendar).format(
                    'MMMM Do (dd) HH:mm',
                  )}
                </span>
                <span>～</span>
                <span>
                  {moment(informationVote?.calendar)
                    .add(getStep(informationVote), 'minutes')
                    .format('HH:mm')}
                </span>
              </div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">調整済</div>{' '}
              <div className="flex1">: {informationVote?.owner_name}</div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">会議形式</div>
              <div className="flex1">
                : {informationVote && informationVote?.real_category}
              </div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">イベント名</div>
              <div className="flex1">
                : {informationVote && informationVote?.name}
              </div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">ミーティング形式</div>
              <div className="flex1">
                {' '}
                : {informationVote && informationVote?.category_name}
              </div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">ミーティング相手</div>
              <div className="flex1">
                : {informationVote && informationVote?.location_name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default connect(({ CALENDAR, VOTE }) => ({
  calendarStore: CALENDAR,
  voteStore: VOTE,
}))(withRouter(PastAppointmentDetail));
