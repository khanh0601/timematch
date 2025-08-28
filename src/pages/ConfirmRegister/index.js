import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';

function ConfirmRegister(props) {
  const { dispatch, userStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;

  useEffect(() => {
    if (history.location.query.token) {
      const payload = {
        token_verify: history.location.query.token,
      };
      dispatch({ type: 'USER/verifyRegister', payload });
    }
  }, [history]);

  return (
    <div className={styles.confirmRegister}>
      <h2>{formatMessage({ id: 'i18n_register_success' })}</h2>
    </div>
  );
}

export default connect(({ USER }) => ({
  userStore: USER,
}))(ConfirmRegister);
