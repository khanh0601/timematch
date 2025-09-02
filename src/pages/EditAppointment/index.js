import PlusIcon from '../Top/icon/PlusIcon';
import { SwipeableList } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import SwipableItem from '@/components/SwipableItem';
import moment from 'moment';
import { connect } from 'dva';
import { getStep } from '@/commons/function.js';
import { history } from 'umi';
import { useEffect } from 'react';
import { useParams } from 'umi';
import { Spin } from 'antd';

const EditAppointment = props => {
  const { id } = useParams();
  const payload = { calendarId: id };
  const { dispatch, calendarStore } = props;
  const { detailCalendar } = calendarStore;
  useEffect(() => {
    if (id) {
      dispatch({ type: 'CALENDAR/getDetailCalendar', payload });
    }
  }, [id]);
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
      <div className="content">
        <SwipeableList style={{ overflow: 'unset' }} fullSwipe={true}>
          <SwipableItem item={detailCalendar}>
            <div className="swipableItem">
              <div className="swipableItemInner">
                <div className="swipableItemInnerDiv"></div>
                <div>
                  {/* format date time by japanese */}
                  <span>
                    {moment(detailCalendar.start_time).format(
                      'MMMM Do (dd) HH:mm',
                    )}
                  </span>
                  <span>～</span>
                  <span>
                    {moment(detailCalendar.start_time)
                      .add(getStep(detailCalendar), 'minutes')
                      .format('HH:mm')}
                  </span>
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex2">調整状況</div>{' '}
                <div className="flex1">: {detailCalendar.owner_name}</div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex2">会議形式</div>
                <div className="flex1">
                  :{' '}
                  {detailCalendar &&
                    detailCalendar.event &&
                    detailCalendar.event.real_category}
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex2">イベント名</div>
                <div className="flex1">
                  :{' '}
                  {detailCalendar &&
                    detailCalendar.event &&
                    detailCalendar.event.name}
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex2">ミーティング形式</div>
                <div className="flex1">
                  {' '}
                  :{' '}
                  {detailCalendar &&
                    detailCalendar.event &&
                    detailCalendar.event.category_name}
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex2">ミーティング相手</div>
                <div className="flex1">
                  :{' '}
                  {detailCalendar &&
                    detailCalendar.event &&
                    detailCalendar.event.location_name}
                </div>
              </div>
            </div>
          </SwipableItem>
        </SwipeableList>
      </div>
      <div className="buttons">
        <div className="button blue">
          <div style={{ marginLeft: 10 }}>編集</div>
        </div>
        <div className="button light-blue">
          <div style={{ marginLeft: 10 }}>この日程を流用して新規作成</div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ CALENDAR }) => ({ calendarStore: CALENDAR }))(
  EditAppointment,
);
