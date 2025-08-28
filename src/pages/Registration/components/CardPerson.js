import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useIntl, history } from 'umi';
import iconGoogle from '@/assets/images/i-google-32x32.png';
import iconOffice from '@/assets/images/i-office1-32x32.png';
import iconUser from '@/assets/images/user.png';

import styles from '../styles.less';
import TermVerify from './TermVerify';
import useWindowDimensions from '@/commons/useWindowDimensions';

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
  const { width } = useWindowDimensions();

  return (
    <div className={styles.card}>
      <div className={styles.grid}>
        <div className={styles.title}>
          <img src={iconUser} />
          <h1>{formatMessage({ id: 'i18n_click_individual' })}</h1>
        </div>
        <div className={styles.loginHeaderRight}>
          <div className={styles.triangle}></div>
          <div className={styles.loginHeaderRightGreen}>
            {formatMessage({ id: 'i18n_all_function_free' })}
          </div>
          <div className={styles.loginHeaderRightText}>
            {width > 832 ? (
              <>
                <span>
                  {formatMessage({ id: 'i18n_signup_charge_descript_1' })}
                </span>
                <br />
                <span style={{ marginLeft: '-73px' }}>
                  {formatMessage({ id: 'i18n_signup_charge_descript' })}
                </span>
              </>
            ) : (
              <>
                <span style={{ marginLeft: '-35px' }}>
                  {formatMessage({
                    id: 'i18n_signup_charge_descript_1_mobile_1',
                  })}
                </span>
                <br />
                <span style={{ marginLeft: '-108px' }}>
                  {formatMessage({
                    id: 'i18n_signup_charge_descript_1_mobile_2',
                  })}
                </span>
                <br />
                <span>
                  {formatMessage({ id: 'i18n_signup_charge_descript' })}
                </span>
              </>
            )}
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
                {formatMessage({ id: 'i18n_individual' })}
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
                {formatMessage({ id: 'i18n_individual' })}
              </span>
            </Button>
          </div>
        </div>
        {/* End Microsoft */}
        {/* Google/Office365 */}
        <div
          className={styles.checkTerm}
          onClick={() => (!acceptTerm ? setRemindAcceptTerm(true) : null)}
        >
          <div className={!acceptTerm ? styles.preventClickCover : ''}>
            <Button
              className={styles.loginButton}
              onClick={() => history.push('/smooth-login')}
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
                    right: width > 832 ? '27px' : '19px',
                  }}
                >
                  {formatMessage({ id: 'i18n_individual' })}
                </span>
              </div>
              <span>{formatMessage({ id: 'i18n_signup' })}</span>
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
