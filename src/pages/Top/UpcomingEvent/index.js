import React, { useCallback, useEffect, useState } from 'react';
import AdjustmentList from '@/pages/Top/AdjustmentList';
import SwipableItem from '@/components/SwipableItem';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import { getStep } from '@/commons/function.js';
import { history } from 'umi';
import Tab from '../../../models/Tab';
import { profileFromStorage } from '@/commons/function';

const UpComingEvent = props => {
  const { dispatch, calendarStore, tabStore } = props;
  const { listUpcomingCalendar } = calendarStore;
  const { adjustingEvents, tabLoading } = tabStore;
  const pageSize = 1e10;
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const profile = profileFromStorage();
  const [listCheckRole, setListCheckRole] = useState([]);

  const payload = {
    user_id_of_member: profile?.id,
    page: 1,
    page_size: 10,
    relationship_type: 3,
    is_finished: 0,
  };

  const getList = () => {
    dispatch({
      type: 'TAB/getOnePaginateAdjustingEventsMember',
      payload,
    });
  };

  useEffect(() => {
    getList();
  }, [history.location.query]);

  return (
    <Spin spinning={tabLoading}>
      <AdjustmentList
        renderItem={(item, index) => (
          <SwipableItem index={index} item={item}>
            <div
              onClick={() => {
                const fullUrl = item?.vote?.full_url?.split('=')[
                  item?.vote?.full_url?.split('=')?.length - 1
                ];
                history.push(
                  `/appointment/${item?.id}?id=${
                    item.vote.slug
                  }&name=${fullUrl}&chooseSchedule=true&role=${false}`,
                );
              }}
              className="swipableItem"
            >
              {/* <div className="swipableItemInner">
                <div className="swipableItemInnerDiv"></div>
                <div>
                  <span>
                    {moment(item.start_time).format('MMMM Do (dd) HH:mm')}
                  </span>
                  <span>～</span>
                  <span>
                    {moment(item.start_time)
                      .add(getStep(item), 'minutes')
                      .format('HH:mm')}
                  </span>
                </div>
              </div> */}
              <div className="flexSpaceBetween">
                <div className="flex2">調整済</div>{' '}
                <div className="flex1">: {item.owner_name}</div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex2">会議形式</div>
                <div className="flex1">: {item && item.real_category}</div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex2">イベント名</div>
                <div className="flex1">: {item && item.name}</div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex2">ミーティング形式</div>
                <div className="flex1"> : {item && item.category_name}</div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex2">ミーティング相手</div>
                <div className="flex1">: {item && item.location_name}</div>
              </div>
            </div>
          </SwipableItem>
        )}
        data={adjustingEvents?.data}
      />
    </Spin>
  );
};

export default connect(({ CALENDAR, TAB }) => ({
  calendarStore: CALENDAR,
  tabStore: TAB,
}))(UpComingEvent);
