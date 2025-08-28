import React, { useState } from 'react';
import { Button } from 'antd';
import { useIntl, history } from 'umi';
import iconOffice from '@/assets/images/i-office1-32x32.png';
import iconBuilding from '@/assets/images/i-buiding.png';
import iconGoogle from '@/assets/images/i-google-32x32.png';

import styles from '../styles.less';

function CardCompany({ microsoftLogin, googleLogin }) {
  const intl = useIntl();
  const { formatMessage } = intl;
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
          <img src={iconBuilding} />
          <div>
            <h1 onClick={showHighlight}>
              {formatMessage({ id: 'i18n_click_corporation' })}
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
              {formatMessage({ id: 'i18n_corporation' })}
            </span>
          </Button>
        </div>
        {/* End Google */}
        {/* Microsoft */}
        <div>
          <Button className={listCssBtn()} onClick={microsoftLogin}>
            <img src={iconOffice} />
            <span>{formatMessage({ id: 'i18n_signin_office' })}</span>
            <span className={styles.rightSpan}>
              {formatMessage({ id: 'i18n_corporation' })}
            </span>
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
