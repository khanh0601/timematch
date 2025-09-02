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
            <Link
              to={'/term-of-user'}
              className={`${styles.textDarkBlue} ${styles.link}`}
            >
              {intl.formatMessage({ id: 'i18n_footer_service' })}
            </Link>
          </li>
          <li>
            <a
              href={'https://vision-net.co.jp/privacy.html'}
              className={`${styles.textDarkBlue} ${styles.link}`}
              target={'_blank'}
            >
              {intl.formatMessage({ id: 'i18n_footer_privacy' })}
            </a>
          </li>
        </ul>

        <span className={styles.footerCopyright}>
          Copyright©Vision Inc. All Rights Reserved.
        </span>
      </div>
    </div>
  );
}

export default FooterMobile;
