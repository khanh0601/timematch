import React from 'react';
import { Button } from 'antd';
import { useIntl, history } from 'umi';
import MicrosoftLogin from 'react-microsoft-login';
import config from '@/config';
import iconGoogle from '@/assets/images/i-google-32x32.png';
import iconOffice from '@/assets/images/i-office1-32x32.png';
import iconBuilding from '@/assets/images/i-buiding.png';

import styles from '../styles.less';
import TermVerify from './TermVerify';

function CardCompany({
  acceptTerm,
  remindAcceptTerm,
  setRemindAcceptTerm,
  microsoftLogin,
  googleLogin,
  onCheck,
}) {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div className={styles.card}>
      <div className={styles.grid}>
        <div className={styles.title}>
          <img src={iconBuilding} />
          <h1>{formatMessage({ id: 'i18n_click_corporation' })}</h1>
        </div>
        <div className={styles.loginHeaderRight}>
          <div className={styles.triangle}></div>
          <div className={styles.loginHeaderRightGreen}>
            {formatMessage({ id: 'i18n_free_trial' })}
          </div>
          <div
            className={styles.loginHeaderRightText}
            style={{ textAlign: 'center' }}
          >
            {formatMessage({ id: 'i18n_signup_charge_descript' })}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <TermVerify
          acceptTerm={acceptTerm}
          remindAcceptTerm={remindAcceptTerm}
          onCheck={onCheck}
        />
        {/* Google */}
        <div
          className={styles.checkTerm}
          onClick={() => (!acceptTerm ? setRemindAcceptTerm(true) : null)}
        >
          <div className={!acceptTerm ? styles.preventClickCover : ''}>
            <Button className={styles.loginButton} onClick={googleLogin}>
              <img src={iconGoogle} />
              <span>{formatMessage({ id: 'i18n_signup_google' })}</span>
              <span className={styles.rightSpan}>
                {formatMessage({ id: 'i18n_corporation' })}
              </span>
            </Button>
          </div>
        </div>
        {/* End Google */}
        {/* Microsoft */}
        <div
          className={styles.checkTerm}
          onClick={() => (!acceptTerm ? setRemindAcceptTerm(true) : null)}
        >
          <div className={!acceptTerm ? styles.preventClickCover : ''}>
            <Button className={styles.loginButton} onClick={microsoftLogin}>
              <img src={iconOffice} />
              <span>{formatMessage({ id: 'i18n_signup_office' })}</span>
              <span className={styles.rightSpan}>
                {formatMessage({ id: 'i18n_corporation' })}
              </span>
            </Button>
          </div>
        </div>
        {/* End Microsoft */}
      </div>
      <div className={styles.footer}>
        <div className={styles.loginLinkOther}>
          {formatMessage({ id: 'i18n_signup_link_login' })}
        </div>
        <Button
          className={styles.registerBtn}
          onClick={() => {
            history.push('/login');
            window.scrollTo(0, 0);
          }}
        >
          {formatMessage({ id: 'i18n_btn_login' })}
        </Button>
      </div>
    </div>
  );
}

export default CardCompany;
