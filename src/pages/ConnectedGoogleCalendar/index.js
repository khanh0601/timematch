import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import zone from 'moment-timezone';

function ConnectedGoogleCalendar(props) {
  const { dispatch, userStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;

  useEffect(() => {
    if (history.location.query.code) {
      const local_calendar_id = JSON.parse(localStorage.getItem('calendar_id'));
      const payload = {
        code: history.location.query.code,
        calendar_id: local_calendar_id,
        time_zone: zone.tz.guess(),
      };
      dispatch({ type: 'USER/syncGoogleCalendar', payload });
    }
  }, [history]);

  return (
    <div className={styles.connectedGoogleCalendar}>
      <h2>{formatMessage({ id: 'i18n_sync_gg_calendar_success' })}</h2>
    </div>
  );
}

export default connect(({ USER }) => ({
  userStore: USER,
}))(ConnectedGoogleCalendar);
