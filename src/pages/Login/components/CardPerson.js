import React, { useState } from 'react';
import { Button } from 'antd';
import { useIntl, history } from 'umi';

import iconOffice from '@/assets/images/i-office1-32x32.png';
import iconUser from '@/assets/images/user.png';
import iconGoogle from '@/assets/images/i-google-32x32.png';

import styles from '../styles.less';
import useWindowDimensions from '@/commons/useWindowDimensions';

function CardCompany({ microsoftLogin, googleLogin }) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { width } = useWindowDimensions();
  const [showHighLight, setShowHighLight] = useState(false);
  const showHighlight = () => {
    setShowHighLight(true);
  };
  const listCssBtn = () => {
    let listCss = styles.loginButton;
    if (showHighLight) {
      listCss += ' ' + styles.highlightBtn;
    }
    return listCss;
  };

  return (
    <div className={styles.card}>
      <div className={styles.grid}>
        <div className={styles.title}>
          <img src={iconUser} />
          <div>
            <h1 onClick={showHighlight}>
              {formatMessage({ id: 'i18n_click_individual' })}
            </h1>
            <p className={`${showHighLight && styles.highLightP}`}>
              下記ボタンをクリックください。
            </p>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div>
          <Button className={listCssBtn()} onClick={googleLogin}>
            <img src={iconGoogle} />
            <span>{formatMessage({ id: 'i18n_signin_google' })}</span>
            <span className={styles.rightSpan}>
              {formatMessage({ id: 'i18n_individual' })}
            </span>
          </Button>
        </div>
        {/* Microsoft */}
        <div>
          <Button className={listCssBtn()} onClick={microsoftLogin}>
            <img src={iconOffice} />
            <span>{formatMessage({ id: 'i18n_signin_office' })}</span>
            <span className={styles.rightSpan}>
              {formatMessage({ id: 'i18n_individual' })}
            </span>
          </Button>
        </div>
        {/* End Microsoft */}
        {/* Google/Office365 */}
        <div>
          <Button
            className={listCssBtn()}
            onClick={() => history.push('/smooth-login?login=true')}
            style={{ display: 'block' }}
          >
            <div style={{ display: 'flex' }}>
              <span style={{ marginLeft: '30.5%' }}>
                {formatMessage({ id: 'i18n_google_office365' })}
              </span>
              <span
                className={styles.rightSpan}
                style={{
                  top: width > 832 ? 'calc(50% - 12px)' : 'calc(50% - 7px)',
                  position: 'absolute',
                  right: width > 832 ? '16px' : '10px',
                }}
              >
                {formatMessage({ id: 'i18n_individual' })}
              </span>
            </div>
            <span>{formatMessage({ id: 'i18n_signin' })}</span>
          </Button>
        </div>
        {/* End Microsoft */}
      </div>
      <div className={styles.footer}>
        <div className={styles.loginLinkOther}>
          {formatMessage({ id: 'i18n_click_here_if_not_register' })}
        </div>
        <Button
          className={styles.registerBtn}
          onClick={() => {
            history.push('/registration');
            window.scrollTo(0, 0);
          }}
        >
          {formatMessage({ id: 'i18n_register_as_new_member' })}
        </Button>
      </div>
    </div>
  );
}

export default CardCompany;
