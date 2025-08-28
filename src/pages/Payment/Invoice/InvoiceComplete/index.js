import React from 'react';
import styles from './styles.less';
import { useIntl, useHistory } from 'umi';
import { Button } from 'antd';
import Footer from '@/components/Footer';

function InvoiceComplete() {
  const intl = useIntl();
  const { formatMessage } = intl;
  const history = useHistory();

  return (
    <div>
      <div className={styles.createContractComplete}>
        <div className={styles.paymentTitle}>
          <div className={styles.titleIcon}>
            <div className={styles.bolderColIcon}></div>
            <div className={styles.normalColIcon}></div>
          </div>
          <div className={styles.paymentTitleText}>
            {formatMessage({ id: 'i18n_send_completely' })}
          </div>
        </div>
        <div className={styles.description}>
          <div>{formatMessage({ id: 'i18n_thanks_for_inquiry' })}</div>
          <div>{formatMessage({ id: 'i18n_thanks_for_inquiry_2' })}</div>
          <div>{formatMessage({ id: 'i18n_thanks_for_inquiry_3' })}</div>
        </div>
        <div className={styles.btnGroup}>
          <Button onClick={() => history.push('/')} className={`btn btnGreen`}>
            {formatMessage({ id: 'i18n_return_home' })}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default InvoiceComplete;
