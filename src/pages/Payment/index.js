import React, { useCallback, useState, useEffect } from 'react';
import styles from './styles.less';
import PaymentContent from './PaymentContent';
import Invoice from './Invoice';
import { useIntl, withRouter } from 'umi';
import { Tabs, Spin } from 'antd';
import ConfirmContract from '../ConfirmContractDetail';
import InvoiceSuccess from './Invoice/InvoiceComplete';
import { connect } from 'dva';

const { TabPane } = Tabs;
function Payment(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { location, dispatch, paymentStore } = props;
  const { contractDetail } = paymentStore;
  const { type_payment } = contractDetail;
  const [isOpenReviewPayment, setIsOpenReviewPayment] = useState(false);
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);
  const [currentTab, setCurrentTab] = useState('creditCard');
  const [loading, setLoading] = useState(false);
  const { query } = location;

  const getContractDetail = useCallback(() => {
    dispatch({ type: 'PAYMENT/getContractDetail', payload: { setLoading } });
  }, [dispatch]);

  useEffect(() => {
    if (query.changePayment) {
      setCurrentTab(query.changePayment);
    }
    if (query.sendContact) {
      setCurrentTab(query.sendContact);
    }
    getContractDetail();
  }, [getContractDetail]);

  if (invoiceSuccess) {
    return <InvoiceSuccess />;
  }
  return (
    <div className={styles.paymentContainer}>
      {isOpenReviewPayment ? (
        <ConfirmContract setIsOpenReviewPayment={setIsOpenReviewPayment} />
      ) : (
        <div className={styles.payment}>
          <div className={styles.paymentTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon}></div>
              <div className={styles.normalColIcon}></div>
            </div>
            <div className={styles.paymentTitleText}>
              {formatMessage({ id: 'i18n_payment' })}
            </div>
          </div>
          <Spin spinning={loading} size="large">
            <Tabs
              activeKey={currentTab}
              onChange={setCurrentTab}
              className={styles.paymentTabs}
            >
              {(!type_payment ||
                query.changePayment === 'creditCard' ||
                query.changePlan === 'creditCard' ||
                query.addPlan === 'creditCard') && (
                <TabPane
                  tab={formatMessage({ id: 'i18n_payment_credit_card' })}
                  key="creditCard"
                >
                  <PaymentContent
                    subId={query.subId}
                    setIsOpenReviewPayment={setIsOpenReviewPayment}
                  />
                </TabPane>
              )}

              {
                <TabPane
                  tab={formatMessage({ id: 'i18n_payment_invoice' })}
                  key="invoice"
                >
                  <Invoice setInvoiceSuccess={setInvoiceSuccess} />
                </TabPane>
              }
            </Tabs>
          </Spin>
        </div>
      )}
    </div>
  );
}

export default connect(({ PAYMENT }) => ({ paymentStore: PAYMENT }))(
  withRouter(Payment),
);
