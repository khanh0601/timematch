import React, { useEffect, useState, useCallback } from 'react';
import styles from './styles.less';
import { useIntl, history, Link } from 'umi';
import { connect } from 'dva';
import EventType from './EventType';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Pagination } from 'antd';
import iconBack from '@/assets/images/i-back-white.png';

function DefaultURL(props) {
  const { dispatch, eventStore } = props;
  const intl = useIntl();
  const {
    listEventTypeFromGuest,
    isValidUserCode,
    owner_name,
    company,
  } = eventStore;
  const { formatMessage } = intl;
  const userCode = history.location.pathname.replace('/', '');
  const pageSize = 4;
  const [pageIndex, setPageIndex] = useState(1);
  const getList = useCallback(() => {
    const payload = {
      relationship_type: 1,
      code: userCode,
      page_size: pageSize,
      status: 1,
      page: pageIndex,
    };
    dispatch({ type: 'EVENT/getEventTypeFromGuest', payload });
  }, [pageIndex, pageSize]);
  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <>
      {/*<Header />*/}
      {isValidUserCode ? (
        <div className={styles.defaultURL}>
          <p className={styles.headInfo}>
            {company} &nbsp;
            {owner_name}
            {formatMessage({ id: 'i18n_booking_schedule_from' })}
          </p>

          <p className={styles.suggestion}>
            {formatMessage({ id: 'i18n_please_select_event_type' })}
          </p>
          <div className={styles.listEventType}>
            {listEventTypeFromGuest.data &&
              listEventTypeFromGuest.data.map(event => (
                <EventType
                  data={event}
                  key={`eventType_${event.id}`}
                  userCode={userCode}
                />
              ))}
          </div>
          {listEventTypeFromGuest.total > 1 && (
            <Pagination
              defaultCurrent={pageIndex}
              pageSize={pageSize}
              total={listEventTypeFromGuest.total}
              onChange={(page, pageSize) => setPageIndex(page)}
              responsive={true}
            />
          )}
          <Footer />
        </div>
      ) : (
        <div className={`${styles.defaultURL} ${styles.defaultURLNotFound}`}>
          <p className={styles.notFound}>
            {formatMessage({ id: 'i18n_404_not_found' })}
          </p>
          <Link to={'/login'} className={styles.backToHome}>
            <img src={iconBack} alt={'back'} />
            {formatMessage({ id: 'i18n_back_to_homepage' })}
          </Link>
          {/*<Footer />*/}
        </div>
      )}
    </>
  );
}

export default connect(({ EVENT }) => ({
  eventStore: EVENT,
}))(DefaultURL);
