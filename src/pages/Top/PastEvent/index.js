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

const PastEvent = props => {
  const { dispatch, calendarStore, tabStore } = props;
  const { listUpcomingCalendar } = calendarStore;
  const { adjustedEvents, tabLoading } = tabStore;
  const pageSize = 1e10;
  const [pageIndex, setPageIndex] = useState(1);
  const profile = profileFromStorage();
  const [listCheckRole, setListCheckRole] = useState([]);

  const payload = {
    user_id_of_member: profile?.id,
    page: 1,
    page_size: 10,
    relationship_type: 3,
    is_finished: 1,
  };

  const getList = () => {
    dispatch({
      type: 'TAB/getOnePaginateAdjustedEventsMember',
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
                  `/past-appointment/${item?.id}?id=${
                    item.vote.slug
                  }&name=${fullUrl}&chooseSchedule=true&role=${false}`,
                );
              }}
              className="swipableItem"
            >
              <div className="swipableItemInner">
                <div className="swipableItemInnerDiv"></div>
                <div>
                  {/* format date time by japanese */}
                  <span>
                    {moment(item.calendar).format('MMMM Do (dd) HH:mm')}
                  </span>
                  <span>～</span>
                  <span>
                    {moment(item.calendar)
                      .add(getStep(item), 'minutes')
                      .format('HH:mm')}
                  </span>
                </div>
              </div>
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
        data={adjustedEvents?.data}
      />
    </Spin>
  );
};

export default connect(({ CALENDAR, TAB }) => ({
  calendarStore: CALENDAR,
  tabStore: TAB,
}))(PastEvent);
