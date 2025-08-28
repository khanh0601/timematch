import React from 'react';
import styles from './styles.less';
import { useIntl, history, Link } from 'umi';

function FooterMobile() {
  const intl = useIntl();
  return (
    <div className={styles.wrapperFooter}>
      <div className={styles.footer}>
        <ul className={styles.footerContent}>
          <li>
            <Link to={'/term-of-user'}>
              {intl.formatMessage({ id: 'i18n_footer_service' })}
            </Link>
          </li>
          <li>
            <Link to={'/privacy-policy'}>
              {intl.formatMessage({ id: 'i18n_footer_privacy' })}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FooterMobile;
