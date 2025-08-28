import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
import { history, useIntl } from 'umi';

const LoginFree = () => {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div className={styles.suggestLogin}>
      <p>
        {formatMessage({
          id: 'i18n_suggest_login_line_1',
        })}
      </p>
      <p>
        {formatMessage({
          id: 'i18n_suggest_login_line_2',
        })}
      </p>
      <p>
        {formatMessage({
          id: 'i18n_suggest_login_line_3',
        })}
      </p>

      <div className={styles.btnZone}>
        <Button
          className={styles.signUpBtn}
          onClick={() => history.push('/registration')}
        >
          {formatMessage({
            id: 'i18n_register_new_free_acc',
          })}
        </Button>
        <Button
          className={styles.signInBtn}
          onClick={() => history.push('/login')}
        >
          {formatMessage({ id: 'i18n_btn_login' })}
        </Button>
      </div>
    </div>
  );
};
export default LoginFree;
