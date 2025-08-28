import React from 'react';
import styles from './styles.less';
import { useIntl, useHistory } from 'umi';
import { Button } from 'antd';
import Footer from '@/components/Footer';

function AddMemberComplete() {
  const intl = useIntl();
  const { formatMessage } = intl;
  const history = useHistory();
  return (
    <div>
      <div className={styles.addMemberComplete}>
        <div className={styles.paymentTitle}>
          <div className={styles.titleIcon}>
            <div className={styles.bolderColIcon}></div>
            <div className={styles.normalColIcon}></div>
          </div>
          <div className={styles.paymentTitleText}>
            {formatMessage({ id: 'i18n_invitation_email_sent' })}
          </div>
        </div>
        <div className={styles.description}>
          <div>{formatMessage({ id: 'i18n_invitation_email_sent_1' })}</div>
          <div>{formatMessage({ id: 'i18n_invitation_email_sent_2' })}</div>
        </div>
        <div className={styles.btnGroup}>
          <Button onClick={() => history.push('/')} className={`btn btnGreen`}>
            {formatMessage({ id: 'i18n_redirect_user_page' })}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddMemberComplete;
