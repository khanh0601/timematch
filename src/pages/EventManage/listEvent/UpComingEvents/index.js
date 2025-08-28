import React, { useEffect, useState, useCallback } from 'react';
import styles from '../styles.less';
import { connect } from 'dva';
import UpComingEventItem from './UpComingEventItem';
import ReactLoading from 'react-loading';
import { Pagination, Spin } from 'antd';

import { profileFromStorage } from '@/commons/function';

function UpComingEvents(props) {
  const { dispatch, calendarStore } = props;
  const { listCalendar } = calendarStore;
  const pageSize = 4;
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const profile = profileFromStorage();

  const getList = useCallback(() => {
    setLoading(true);
    const payload = {
      status: 1,
      pageSize: pageSize,
      page: pageIndex,
    };

    dispatch({ type: 'CALENDAR/getListCalendar', payload });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [pageIndex, pageSize]);
  useEffect(() => {
    getList();
  }, [getList]);
  return (
    <div>
      <Spin spinning={loading}>
        {listCalendar.total > 0 ? (
          <div className={styles.inCommingEvent}>
            {listCalendar.data &&
              listCalendar.data.map(calendar => {
                return (
                  <UpComingEventItem key={calendar.id} calendar={calendar} />
                );
              })}
            {
              <div className={styles.paginationEvent}>
                <Pagination
                  defaultCurrent={pageIndex}
                  pageSize={pageSize}
                  total={listCalendar.total}
                  onChange={(page, pageSize) => setPageIndex(page)}
                  responsive={true}
                />
              </div>
            }
          </div>
        ) : (
          ''
        )}
      </Spin>
    </div>
  );
}

export default connect(({ CALENDAR }) => ({
  calendarStore: CALENDAR,
}))(UpComingEvents);
