import React from 'react';
import styles from './styles.less';
import { useIntl } from 'umi';
import iconGoogle from '@/assets/images/i-google.png';
import iconOffice from '@/assets/images/i-office.png';
import { Button, Checkbox } from 'antd';
import Footer from '@/components/Footer';

function Signup() {
  const intl = useIntl();
  const { formatMessage } = intl;
  return (
    <div>
      <div className={styles.signup}>
        <div className={styles.signupHeader}>
          <div className={styles.eventTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon}></div>
              <div className={styles.normalColIcon}></div>
            </div>
            <h2>{formatMessage({ id: 'i18n_register_title' })}</h2>
          </div>
          <div className={styles.signupHeaderRight}>
            <div className={styles.signupHeaderRightGreen}>
              {formatMessage({ id: 'i18n_free_trial' })}
            </div>
            <div className={styles.signupHeaderRightText}>
              {formatMessage({ id: 'i18n_signup_charge_descript' })}
            </div>
          </div>
        </div>
        <div className={styles.signupOtherText}>
          {formatMessage({ id: 'i18n_signup_other_method' })} <br />
          {formatMessage({ id: 'i18n_signup_other_method_2' })}
        </div>
        <div className={styles.signupCheckbox}>
          <Checkbox.Group>
            <div className={styles.signupCheckboxItem}>
              <Checkbox
                value="sunday"
                className={styles.checkboxCustom}
              ></Checkbox>
              <div className={styles.checkboxContent}>
                <div className={styles.labelCheckbox}>
                  <a href="#">{formatMessage({ id: 'i18n_signup_term' })}</a>
                  {formatMessage({ id: 'i18n_signup_accept_text' })}
                </div>
              </div>
            </div>
          </Checkbox.Group>
          {/* <input type="checkbox" id="policy" className={styles.inputCheckbox} />
          <label htmlFor="policy" className={styles.labelCheckbox}>
            <a href="#">{formatMessage({ id: 'i18n_signup_term' })}</a>
            {formatMessage({ id: 'i18n_signup_accept_text' })}
          </label> */}
        </div>
        <Button className={`${styles.btnGoogle} ${styles.btnOther}`}>
          <img src={iconGoogle} />
          {formatMessage({ id: 'i18n_signup_google' })}
        </Button>
        <Button className={`${styles.btnOffice} ${styles.btnOther}`}>
          <img src={iconOffice} />
          {formatMessage({ id: 'i18n_signup_office' })}
        </Button>
        <div className={styles.signupLinkOther}>
          {formatMessage({ id: 'i18n_signup_link_login' })}
        </div>
        <Button className={styles.btnLogin}>
          {formatMessage({ id: 'i18n_btn_login' })}
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
