import React from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import Footer from '@/components/Footer';
import { Button } from 'antd';
import expiredImage from '@/assets/images/expired-free.png';

function ExpiredFree() {
  const { formatMessage } = useIntl();
  const { code } = history.location.query;

  return (
    <div className={styles.expiredFree}>
      {/* <Header/> */}
      <div className={styles.expiredFreeContainer}>
        <div className={styles.eventTitle}>
          <div className={styles.titleIcon}>
            <div className={styles.bolderColIcon}></div>
            <div className={styles.normalColIcon}></div>
          </div>
          <h2>{formatMessage({ id: 'i18n_expired_free_title' })}</h2>
        </div>
        {code == 800 && <MemberDescript formatMessage={formatMessage} />}
        {code == 801 && <AdminSlotDescript formatMessage={formatMessage} />}
        {code == 802 && <AdminUpdateDescript formatMessage={formatMessage} />}
        {!code && <DefaultDescript formatMessage={formatMessage} />}
        <div className={styles.btnGroup}>
          <Button
            className={`${styles.btnGreen} ${styles.btnCustom}`}
            onClick={() => history.push('/payment?addPlan=creditCard')}
          >
            {formatMessage({ id: 'i18n_register_for_fee' })}
          </Button>
          <Button
            className={`${styles.btnWhite} ${styles.btnCustom}`}
            onClick={() => history.push('/home')}
          >
            {formatMessage({ id: 'i18n_view_service_site' })}
          </Button>
        </div>
        <div className={styles.imgContent}>
          <img src={expiredImage} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

const DefaultDescript = ({ formatMessage }) => (
  <div className={styles.description}>
    <div>{formatMessage({ id: 'i18n_expired_free_text_1' })}</div>
    <div>{formatMessage({ id: 'i18n_expired_free_text_2' })}</div>
    <div>{formatMessage({ id: 'i18n_expired_free_text_3' })}</div>
  </div>
);

const MemberDescript = ({ formatMessage }) => (
  <div className={styles.description}>
    <div>{formatMessage({ id: 'i18n_expired_free_thank' })}</div>
    <br />
    <div>{formatMessage({ id: 'i18n_expired_free_member_1' })}</div>
    <div>{formatMessage({ id: 'i18n_expired_free_member_2' })}</div>
    <br />
    <div>{formatMessage({ id: 'i18n_expired_free_member_3' })}</div>
    <div>{formatMessage({ id: 'i18n_expired_free_member_4' })}</div>
    <br />
    <div>{formatMessage({ id: 'i18n_expired_free_member_5' })}</div>
  </div>
);

const AdminSlotDescript = ({ formatMessage }) => (
  <div className={styles.description}>
    <div>{formatMessage({ id: 'i18n_expired_free_thank' })}</div>
    <br />
    <div>{formatMessage({ id: 'i18n_expired_free_admin_slot_1' })}</div>
    <div>{formatMessage({ id: 'i18n_expired_free_admin_slot_2' })}</div>
    <br />
    <div>{formatMessage({ id: 'i18n_expired_free_admin_slot_3' })}</div>
  </div>
);

const AdminUpdateDescript = ({ formatMessage }) => (
  <div className={styles.description}>
    <div>{formatMessage({ id: 'i18n_expired_free_thank' })}</div>
    <br />
    <div>{formatMessage({ id: 'i18n_expired_free_admin_auto_1' })}</div>
    <div>{formatMessage({ id: 'i18n_expired_free_admin_auto_2' })}</div>
    <br />
    <div>{formatMessage({ id: 'i18n_expired_free_admin_auto_3' })}</div>
    <div>{formatMessage({ id: 'i18n_expired_free_admin_auto_4' })}</div>
    <br />
    <div>{formatMessage({ id: 'i18n_expired_free_admin_auto_5' })}</div>
    <div>{formatMessage({ id: 'i18n_expired_free_admin_auto_6' })}</div>
  </div>
);

export default ExpiredFree;
