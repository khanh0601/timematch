import React from 'react';
import styles from './index.less';
import { getCookie } from '../../../../commons/function';
import useWindowDimensions from '@/commons/useWindowDimensions';
import { useIntl, useDispatch, history, Link } from 'umi';
import logoImage from '@/assets/images/logo-black.svg';

function Footer() {
  const dispatch = useDispatch();

  const handleClickLink = () => {
    dispatch({ type: 'FOOTER/setIsScroll', payload: true });
  };
  const intl = useIntl();

  return (
    <div className={styles.footer}>
      <ul className={styles.footerContent}>
        <li onClick={handleClickLink}>
          <Link to={'/'}>
            <img src={logoImage} className={styles.imgLogo} />
          </Link>
        </li>
        <li onClick={handleClickLink}>
          <Link to={'/term-of-user'}>
            {intl.formatMessage({ id: 'i18n_footer_service' })}
          </Link>
        </li>
        <li onClick={handleClickLink}>
          <Link to={'https://vision-net.co.jp/privacy.html'}>
            {intl.formatMessage({ id: 'i18n_footer_privacy' })}
          </Link>
        </li>
        <li onClick={handleClickLink}>
          <Link to={'/base-notation'}>
            {intl.formatMessage({ id: 'i18n_footer_law' })}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Footer;
