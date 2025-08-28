import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';

function LoginGoogleMeetSuccess(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;

  useEffect(() => {
    if (history.location.query.code) {
      const payload = {
        code: history.location.query.code,
      };
      dispatch({ type: 'MASTER/googleMeetLogin', payload });
    }
  }, [history]);

  return (
    <div className={styles.loginGoogleMeetSuccess}>
      <h2>{formatMessage({ id: 'i18n_connect_to_google_meet_success' })}</h2>
      <a href="/" className={styles.btnBack}>
        {formatMessage({ id: 'i18n_back' })}
      </a>
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(LoginGoogleMeetSuccess);
