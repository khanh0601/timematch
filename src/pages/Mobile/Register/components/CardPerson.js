import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useIntl, history } from 'umi';
import iconGoogle from '@/assets/images/google.png';
import iconOffice from '@/assets/images/microsoft.png';
import styles from '../styles.less';

function CardCompany({
  acceptTerm,
  setRemindAcceptTerm,
  microsoftLogin,
  googleLogin,
}) {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div className={styles.card}>
      <div className={styles.grid}>
        {/* Google */}
        <div
          className={styles.checkTerm}
          onClick={() => (!acceptTerm ? setRemindAcceptTerm(true) : null)}
        >
          <div className={!acceptTerm ? styles.preventClickCover : ''}>
            <Button
              onClick={googleLogin}
              className={`${styles.loginButton} ${styles.borderMediumGray}`}
            >
              <img src={iconGoogle} alt={'Google'} />
              <span className={styles.textDarkGray}>
                {formatMessage({ id: 'i18n_signup_google' })}
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
              <img src={iconOffice} alt={'Microsoft'} />
              <span>{formatMessage({ id: 'i18n_signup_office' })}</span>
            </Button>
          </div>
        </div>
        {/* End Microsoft */}
      </div>
    </div>
  );
}

export default CardCompany;
