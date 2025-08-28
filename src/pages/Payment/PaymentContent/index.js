import React, { useCallback, useEffect } from 'react';
import styles from '../styles.less';
import { useIntl, withRouter } from 'umi';
import { Radio, Select } from 'antd';
import { connect } from 'dva';
import { CONTRACT_BY_YEAR } from '@/constant';
import StripeForm from './stripeForm';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/commons/stripePromise';
import Footer from '@/components/Footer';
const { Option } = Select;

function PaymentContent(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { location } = props;
  const { query } = location;
  const { setIsOpenReviewPayment, dispatch, paymentStore } = props;
  const { contracts, paymentInfo } = paymentStore;

  const handleChangeValue = event => {
    const { name, value } = event.target;
    const payload = {
      [name]: value,
    };
    dispatch({ type: 'PAYMENT/updatePaymentInfo', payload });
  };

  const getContracts = useCallback(() => {
    dispatch({ type: 'PAYMENT/getContracts' });
  }, [dispatch]);

  const handleChangeQuantity = value => {
    const payload = {
      quantity: value,
    };
    dispatch({ type: 'PAYMENT/updatePaymentInfo', payload });
  };

  useEffect(() => {
    getContracts();
  }, [getContracts]);

  const renderOptionValue = () => {
    const result = [];
    for (let i = 1; i < 20; i++) {
      result.push(
        <Option key={i} value={i}>
          {i}
        </Option>,
      );
    }
    return result;
  };

  return (
    <div>
      <div className={styles.tab1}>
        {!query.changePayment && (
          <>
            <div className={styles.numberAccount}>
              <div className={styles.numberAccountContent}>
                <div className={styles.numberAccountBorder}></div>
                <div className={styles.numberAccountTitle}>
                  {formatMessage({ id: 'i18n_added_account' })}
                </div>
              </div>
              <Select
                dropdownClassName={styles.dropdownSelectQuantity}
                onChange={handleChangeQuantity}
                value={paymentInfo.quantity}
              >
                {renderOptionValue()}
              </Select>
            </div>
            <div className={styles.contractType}>
              <div className={styles.numberAccountContent}>
                <div className={styles.numberAccountBorder}></div>
                <div className={styles.numberAccountTitle}>
                  {formatMessage({ id: 'i18n_contract_type' })}
                </div>
              </div>
              <Radio.Group
                value={paymentInfo.contractId}
                className={styles.contractRadio}
                onChange={handleChangeValue}
                name="contractId"
              >
                {contracts.map(contract => (
                  <Radio key={contract.id} value={contract.id}>
                    {contract.id === CONTRACT_BY_YEAR ? (
                      <span className={styles.contractRadioLabel}>
                        {formatMessage(
                          { id: 'i18n_contract_by_year' },
                          { price: contract.price / 12 },
                        )}
                        <br />
                        <span className={styles.contractRadioSmall}>
                          {formatMessage(
                            { id: 'i18n_contract_endow_note' },
                            {
                              lowPrice:
                                contracts[1].price * 12 - contracts[0].price,
                            },
                          )}
                        </span>
                      </span>
                    ) : (
                      <span className={styles.contractRadioLabel}>
                        {formatMessage(
                          { id: 'i18n_contract_by_month' },
                          { price: contract.price },
                        )}
                      </span>
                    )}
                  </Radio>
                ))}
              </Radio.Group>
              <div className={styles.contractDescript}>
                {formatMessage({ id: 'i18n_contract_descript' })}
              </div>
            </div>
          </>
        )}
        <div className={styles.card}>
          <div className={styles.numberAccountContent}>
            <div className={styles.numberAccountBorder}></div>
            <div className={styles.numberAccountTitle}>
              {formatMessage({ id: 'i18n_credit_cart' })}
            </div>
          </div>
          <Elements stripe={stripePromise}>
            <StripeForm setIsOpenReviewPayment={setIsOpenReviewPayment} />
          </Elements>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default connect(({ PAYMENT }) => ({ paymentStore: PAYMENT }))(
  withRouter(PaymentContent),
);
