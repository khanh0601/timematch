import React, { useCallback, useEffect, useState } from 'react';
import AdjustmentList from '@/pages/Top/AdjustmentList';
import SwipableItem from '@/components/SwipableItem';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import { getStep } from '@/commons/function.js';
import { history } from 'umi';
import { profileFromStorage } from '@/commons/function';

const AllEvent = props => {
  const { dispatch, calendarStore, tabStore } = props;
  const { listUpcomingCalendar } = calendarStore;
  const { allEvents, tabLoading } = tabStore;
  const pageSize = 1e10;
  const [pageIndex, setPageIndex] = useState(1);
  const profile = profileFromStorage();
  const [listCheckRole, setListCheckRole] = useState([]);

  const payload = {
    user_id_of_member: profile?.id,
    page: 1,
    page_size: 10,
    relationship_type: 3,
  };

  const getList = () => {
    dispatch({
      type: 'TAB/getOnePaginateAllEventsMember',
      payload,
    });
  };
  useEffect(() => {
    getList();
  }, [history.location.query]);

  console.log('allEvents?.data', allEvents?.data);
  return (
    <Spin spinning={tabLoading}>
      <AdjustmentList
        renderItem={(item, index) => (
          <SwipableItem index={index} item={item}>
            <div
              id={index === 0 ? 'first-item' : ''}
              onClick={() => {
                const fullUrl = item?.vote?.full_url?.split('=')[
                  item?.vote?.full_url?.split('=')?.length - 1
                ];
                if (item.vote.is_finished === 0) {
                  history.push(
                    `/appointment/${item?.id}?id=${
                      item.vote.slug
                    }&name=${fullUrl}&chooseSchedule=true&role=${false}`,
                  );
                } else {
                  history.push(
                    `/past-appointment/${item?.id}?id=${
                      item.vote.slug
                    }&name=${fullUrl}&chooseSchedule=true&role=${false}`,
                  );
                }
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
                <div className="flex1">調整状況</div>{' '}
                <div className="flex1">
                  : {item.vote.is_finished === 0 ? '調整中' : '調整済'}
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex1">依頼元</div>
                <div className="flex1">
                  : {item && item.real_category ? item.real_category : '私から'}
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex1">イベント名</div>
                <div
                  style={{
                    wordBreak: 'break-word',
                  }}
                  className="flex1"
                >
                  : {item && item.name}
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex1">ミーティング形式</div>
                <div className="flex1">
                  {' '}
                  :{' '}
                  {item && item.category_name
                    ? item.category_name
                    : 'オンライン'}
                </div>
              </div>
              <div className="flexSpaceBetween">
                <div className="flex1">ミーティング相手</div>
                <div className="flex1">
                  :{' '}
                  {item && item.vote?.voters?.map(item => item.name).join(', ')}
                </div>
              </div>
            </div>
          </SwipableItem>
        )}
        data={allEvents?.data}
      />
    </Spin>
  );
};

export default connect(({ CALENDAR, TAB }) => ({
  calendarStore: CALENDAR,
  tabStore: TAB,
}))(AllEvent);
