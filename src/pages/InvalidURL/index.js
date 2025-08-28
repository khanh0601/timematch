import React from 'react';
import styles from './styles.less';
import { useIntl } from 'umi';
import { history } from 'umi';

function InvalidURL() {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div className={styles.invalidURL}>
      <h2>{formatMessage({ id: 'i18n_invalid_url' })}</h2>
      <h2>
        {/*<span>{formatMessage({ id: 'i18n_login_to_set_valid_url_1' })}</span>*/}
        {/*<a onClick={() => history.push('/login')}>*/}
        {/*  {formatMessage({ id: 'i18n_login_to_set_valid_url_2' })}*/}
        {/*</a>*/}
        <span>{formatMessage({ id: 'i18n_login_to_set_valid_url_3' })}</span>
      </h2>
    </div>
  );
}

export default InvalidURL;
