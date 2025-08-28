import React from 'react';
import styles from './styles.less';
import { useIntl, history, Link } from 'umi';
import logoImage from '@/assets/images/logo-black.svg';
import useWindowDimensions from '@/commons/useWindowDimensions';
import { connect } from 'dva';
import { getCookie } from '@/commons/function';

function Footer({ dispatch, footerSuccessVote }) {
  const handleClickLink = () => {
    dispatch({ type: 'FOOTER/setIsScroll', payload: true });
  };
  const intl = useIntl();
  const { width } = useWindowDimensions();
  const isLogin = getCookie('token');

  const footerCss = () => {
    let lisCss = styles.footer;
    if (footerSuccessVote) {
      lisCss += ' ' + styles.footerSuccessVote;
    }

    if (!isLogin) {
      lisCss += ' ' + styles.footerNotLogin;
    }

    return lisCss;
  };

  return (
    <div className={styles.wrapperFooter}>
      <div className={footerCss()}>
        {width > 894 ? (
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
              <Link to={'/privacy-policy'}>
                {intl.formatMessage({ id: 'i18n_footer_privacy' })}
              </Link>
            </li>
            <li onClick={handleClickLink}>
              <Link to={'/base-notation'}>
                {intl.formatMessage({ id: 'i18n_footer_law' })}
              </Link>
            </li>
          </ul>
        ) : (
          <ul className={styles.footerContentMobile}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <li onClick={handleClickLink}>
                <Link to={'/'}>
                  <img src={logoImage} className={styles.imgLogo} />
                </Link>
              </li>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <li onClick={handleClickLink}>
                <Link to={'/term-of-user'}>
                  {intl.formatMessage({ id: 'i18n_footer_service' })}
                </Link>
              </li>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <li onClick={handleClickLink}>
                <Link to={'/privacy-policy'}>
                  {intl.formatMessage({ id: 'i18n_footer_privacy' })}
                </Link>
              </li>
              <li onClick={handleClickLink}>
                <Link to={'/base-notation'}>
                  {intl.formatMessage({ id: 'i18n_footer_law' })}
                </Link>
              </li>
            </div>
          </ul>
        )}
      </div>
    </div>
  );
}

export default connect(({ FOOTER }) => ({
  footerStore: FOOTER,
}))(Footer);
