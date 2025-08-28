import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';

function LoginMSTeamSuccess(props) {
  const { dispatch } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (history.location.query.code) {
      const payload = {
        code: history.location.query.code,
      };

      connect(payload);
    }
  }, [history]);

  const connect = async payload => {
    const res = await dispatch({ type: 'MASTER/microsoftConnect', payload });
    setMessage(res);
  };

  return (
    <div className={styles.loginMSTeamSuccess}>
      {message && <h2>{message}</h2>}
      <a href="/" className={styles.btnBack}>
        {formatMessage({ id: 'i18n_back' })}
      </a>
    </div>
  );
}

export default connect()(LoginMSTeamSuccess);
