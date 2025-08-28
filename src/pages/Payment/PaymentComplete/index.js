import React from 'react';
import styles from './styles.less';
import { useIntl, useHistory } from 'umi';
import { Button } from 'antd';
import Footer from '@/components/Footer';

function PaymentComplete() {
  const intl = useIntl();
  const { formatMessage } = intl;
  const history = useHistory();

  return (
    <div className={styles.complete}>
      <div className={styles.paymentComplete}>
        <div className={styles.paymentTitle}>
          <div className={styles.titleIcon}>
            <div className={styles.bolderColIcon}></div>
            <div className={styles.normalColIcon}></div>
          </div>
          <div className={styles.paymentTitleText}>
            {formatMessage({ id: 'i18n_payment_complete' })}
          </div>
        </div>
        <div className={styles.paymentDescription}>
          <div>{formatMessage({ id: 'i18n_payment_thanks' })}</div>
          <div>
            {formatMessage({ id: 'i18n_payment_redirect_add_account' })}
          </div>
        </div>
        <div className={styles.paymentBtnGroup}>
          <Button
            className={`btn btn-white__shadow btn-custom-height`}
            onClick={() => history.push('/')}
          >
            {formatMessage({ id: 'i18n_turn_back' })}
          </Button>
          <Button
            className={`btn btnGreen btn-custom-height`}
            onClick={() => history.push('/add-member')}
          >
            {formatMessage({ id: 'i18n_confirm' })}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentComplete;
