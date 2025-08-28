import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';

function LoginZoomSuccess(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;

  useEffect(() => {
    if (history.location.query.code) {
      const payload = {
        code: history.location.query.code,
      };
      dispatch({ type: 'MASTER/zoomLogin', payload });
    }
  }, [history]);

  return (
    <div className={styles.loginZoomSuccess}>
      <h2>{formatMessage({ id: 'i18n_connect_to_zoom_success' })}</h2>
      <a href="/" className={styles.btnBack}>
        {formatMessage({ id: 'i18n_back' })}
      </a>
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(LoginZoomSuccess);
