import React from 'react';
import { useIntl } from 'umi';
import styles from './styles.less';
import Footer from '@/components/Footer';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/commons/stripePromise';
import StripeForm from './stripeForm';

function UpdateCard() {
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div>
      <div className={styles.updateCard}>
        <div className={styles.headTitle}>
          <div className={styles.bolderIcon}></div>
          <div className={styles.titleIcon}></div>
          <span>{formatMessage({ id: 'i18n_update_card_title' })}</span>
        </div>
        <div className={styles.updateCard_description}>
          {formatMessage({ id: 'i18n_update_card_description' })}
        </div>
        <Elements stripe={stripePromise}>
          <StripeForm />
        </Elements>
      </div>
      <Footer />
    </div>
  );
}

export default UpdateCard;
