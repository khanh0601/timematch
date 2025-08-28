import React, { useState } from 'react';
import styles from './styles.less';
import Footer from '@/components/Footer';
import { useIntl, withRouter } from 'umi';
import { Button } from 'antd';
import { connect } from 'dva';
import {
  FORMAT_DATE_TEXT,
  CONTRACT_BY_YEAR,
  PAYMENT_TAX,
  TYPE_CREDIT,
} from '@/constant';
import moment from 'moment';
import { formatCurrency } from '@/commons/function';
import PaymentComplete from '../Payment/PaymentComplete';

function ConfirmContractDetail(props) {
  const { setIsOpenReviewPayment, paymentStore, dispatch, location } = props;
  const { query } = location;
  const { paymentInfo, contracts } = paymentStore;
  const { lastDigit, contractId, quantity, token } = paymentInfo;
  const intl = useIntl();
  const { formatMessage } = intl;
  const price = contracts.find(item => item.id === contractId).price;
  const [createTransSuccess, setCreateTransSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickConfirm = () => {
    const subId = localStorage.getItem('subId');
    const reqBody = {
      stripe_token: token,
    };
    if (query.changePayment === 'creditCard') {
      reqBody.type_payment = TYPE_CREDIT;
      dispatch({
        type: 'PAYMENT/changeTypePayment',
        payload: {
          reqBody,
          setLoading,
          changePaymentSuccess: setCreateTransSuccess,
        },
      });
    } else {
      reqBody.quantity = quantity;
      reqBody.contract_id = contractId;
      if (query.changePlan === 'creditCard') {
        reqBody.subscription_old = subId;
        dispatch({
          type: 'PAYMENT/changePlanCreditCard',
          payload: {
            reqBody,
            setLoading,
            createTransFunc: setCreateTransSuccess,
          },
        });
      } else {
        dispatch({
          type: 'PAYMENT/createTransaction',
          payload: {
            reqBody,
            loadingFunc: setLoading,
            createTransFunc: setCreateTransSuccess,
          },
        });
      }
    }
  };

  return (
    <div>
      {createTransSuccess ? (
        <PaymentComplete />
      ) : (
        <div className={styles.confirmContractDetail}>
          <div className={styles.paymentTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon}></div>
              <div className={styles.normalColIcon}></div>
            </div>
            <div
              className={`${styles.paymentTitleText} ${styles.confirmContractTitle}`}
            >
              {formatMessage({ id: 'i18n_confirm_contract_detail' })}
            </div>
          </div>
          <div
            className={`${styles.description} ${styles.confirmContractDescript}`}
          >
            {formatMessage({ id: 'i18n_contract_detail_confirm_reminder' })}
          </div>
          <div className={styles.table}>
            <div className={styles.tbody}>
              {!query.changePayment && (
                <>
                  <div className={`${styles.tr} ${styles.confirmContractTr}`}>
                    <div className={`${styles.td}`}>
                      {formatMessage({ id: 'i18n_contract_term' })}
                    </div>
                    <div className={`${styles.td}`}>
                      {contractId === CONTRACT_BY_YEAR
                        ? `${moment().format(FORMAT_DATE_TEXT)}～${moment()
                            .add(1, 'year')
                            .format(FORMAT_DATE_TEXT)}`
                        : `${moment().format(FORMAT_DATE_TEXT)}～${moment()
                            .add(1, 'month')
                            .format(FORMAT_DATE_TEXT)}`}
                    </div>
                  </div>
                  <div className={`${styles.tr} ${styles.confirmContractTr}`}>
                    <div className={`${styles.td}`}>
                      {formatMessage({ id: 'i18n_added_account' })}
                    </div>
                    <div className={`${styles.td}`}>{quantity}</div>
                  </div>
                  <div className={`${styles.tr} ${styles.confirmContractTr}`}>
                    <div className={`${styles.td}`}>
                      {formatMessage({ id: 'i18n_contract_type' })}
                    </div>
                    <div className={`${styles.td}`}>
                      {contractId === CONTRACT_BY_YEAR
                        ? formatMessage({ id: 'i18n_by_year' })
                        : formatMessage({ id: 'i18n_by_month' })}
                    </div>
                  </div>
                  <div className={`${styles.tr} ${styles.confirmContractTr}`}>
                    <div className={`${styles.td}`}>
                      {formatMessage({
                        id: 'i18n_used_money_not_included_tax',
                      })}
                    </div>
                    <div className={`${styles.td}`}>
                      {formatCurrency(price * quantity)}
                    </div>
                  </div>
                  <div className={`${styles.tr} ${styles.confirmContractTr}`}>
                    <div className={`${styles.td}`}>
                      {formatMessage({ id: 'i18n_used_money_included_tax' })}
                    </div>
                    <div className={`${styles.td}`}>
                      {formatCurrency((price + price * PAYMENT_TAX) * quantity)}
                    </div>
                  </div>
                </>
              )}
              <div
                className={`${styles.tr} ${styles.confirmContractTr} ${styles.confirmContractTrOther}`}
              >
                <div className={`${styles.td}`}>
                  {formatMessage({ id: 'i18n_credit_card' })}
                </div>
                <div className={`${styles.td} ${styles.backButton}`}>
                  <span className={styles.cardAsterisk}>******* </span>
                  {lastDigit}
                  <Button
                    disabled={loading}
                    onClick={() => setIsOpenReviewPayment(false)}
                    className={styles.changeBtn}
                  >
                    {formatMessage({ id: 'i18n_change' })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.btnGroup}>
            <Button
              disabled={loading}
              className={`btn btn-white__shadow btn-custom-height`}
              onClick={() => setIsOpenReviewPayment(false)}
            >
              {formatMessage({ id: 'i18n_turn_back' })}
            </Button>
            <Button
              loading={loading}
              className={`btn btnGreen btn-custom-height`}
              onClick={handleClickConfirm}
            >
              {formatMessage({ id: 'i18n_payment_confirm' })}
            </Button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default connect(({ PAYMENT }) => ({ paymentStore: PAYMENT }))(
  withRouter(ConfirmContractDetail),
);
