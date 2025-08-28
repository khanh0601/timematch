import React, { useEffect, useState, useCallback } from 'react';
import styles from '../styles.less';
import { connect } from 'dva';
import PastEventItem from './PastEventItem';
import { Pagination, Spin } from 'antd';

function PastEvents(props) {
  const { dispatch, calendarStore } = props;
  const { listPastCalendar } = calendarStore;
  const pageSize = 4;
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(true);

  const getList = useCallback(() => {
    setLoading(true);
    const payload = {
      status: 1,
      pageSize: pageSize,
      page: pageIndex,
    };

    dispatch({ type: 'CALENDAR/getListPastCalendar', payload });
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
        {listPastCalendar.total > 0 ? (
          <div className={styles.inCommingEvent}>
            {listPastCalendar.data &&
              listPastCalendar.data.map(calendar => {
                return <PastEventItem key={calendar.id} calendar={calendar} />;
              })}
            <div className={styles.paginationEvent}>
              <Pagination
                defaultCurrent={pageIndex}
                pageSize={pageSize}
                total={listPastCalendar.total}
                onChange={(page, pageSize) => setPageIndex(page)}
                responsive={true}
              />
            </div>
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
}))(PastEvents);
