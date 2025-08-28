import React from 'react';
import styles from '../styles.less';
import { Checkbox } from 'antd';
import { history, useIntl } from 'umi';

function TermVerify({ acceptTerm, remindAcceptTerm, onCheck }) {
  const intl = useIntl();
  const { formatMessage } = intl;

  const redirectToUrl = link => {
    history.push(link);
  };

  return (
    <div className={styles.loginCheckbox}>
      <Checkbox checked={acceptTerm} onChange={() => onCheck()}>
        <div className={styles.labelCheckbox}>
          <a href="javascript:" onClick={() => redirectToUrl('term-of-user')}>
            {formatMessage({ id: 'i18n_signup_term' })}
          </a>
          {'・'}
          <a href="javascript:" onClick={() => redirectToUrl('privacy-policy')}>
            プライバシーポリシー
          </a>
          {formatMessage({ id: 'i18n_signup_accept_text' })}
        </div>
      </Checkbox>
      {remindAcceptTerm && !acceptTerm && (
        <p className={styles.errorNotice}>
          {formatMessage({ id: 'i18n_require_accept_term' })}
        </p>
      )}
    </div>
  );
}

export default TermVerify;
