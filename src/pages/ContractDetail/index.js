import React, { useCallback, useEffect, useState } from 'react';
import { Button, Spin, Table } from 'antd';
import styles from './styles.less';
import { useIntl, useHistory } from 'umi';
import { connect } from 'dva';
import PaymentTable from './paymentTable';
import Footer from '@/components/Footer';
import { CONTRACT_BY_MONTH, TYPE_INVOICE } from '@/constant';
import { TYPE_CREDIT } from '../../constant';

function ContractDetail(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const history = useHistory();
  const { dispatch, paymentStore, accountStore } = props;
  const { contractDetail } = paymentStore;
  const { accountOverview } = accountStore;
  const { countUserContracts } = accountOverview;
  const {
    card,
    contract_type,
    transactionExtend,
    transactions,
    type_payment,
  } = contractDetail;
  const [loading, setLoading] = useState(true);

  const getOverviewConnections = useCallback(() => {
    dispatch({ type: 'ACCOUNT/getUserConnectionPlans' });
  }, [dispatch]);

  const getContractDetail = useCallback(() => {
    dispatch({ type: 'PAYMENT/getContractDetail', payload: { setLoading } });
  }, [dispatch]);

  useEffect(() => {
    getContractDetail();
    getOverviewConnections();
  }, [getContractDetail, getOverviewConnections]);

  const columns = [
    {
      title: '',
      dataIndex: 'bilingDate',
      key: 'bilingDate',
      width: '55%',
      render: () => (
        <div>
          {formatMessage({ id: 'i18n_credit_card' })}
          <Button
            className={`${styles.btnChangeCard} ${styles.customButton} ${styles.btnFs16}`}
            onClick={() => history.push('/update-card')}
          >
            {formatMessage({ id: 'i18n_change_card' })}
          </Button>
        </div>
      ),
    },
    {
      title: formatMessage({ id: 'i18n_card_number' }),
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      render: (_, record) =>
        record && (
          <div className={styles.wrapperCard}>
            <span className={styles.dot}>******</span>
            {record.last4}
            &emsp;
            {record.brand.toUpperCase()}
          </div>
        ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin className="loading-page" size="large" />
      ) : (
        <div className={styles.contractDetail}>
          <div>
            <div className={styles.headTitle}>
              <div className={styles.bolderIcon}></div>
              <div className={styles.titleIcon}></div>
              <span>{formatMessage({ id: 'i18n_contract_detail' })}</span>
            </div>
            <div className={styles.boxContent}>
              <div className={styles.accountData}>
                <div className={styles.dataBadge}>
                  <p className={styles.amount}>
                    {formatMessage({ id: 'i18n_status' })}
                  </p>
                  <div className={styles.deviderLine}></div>
                  <p className={styles.contract}>
                    {formatMessage({ id: 'i18n_this_account' })}
                  </p>
                </div>
                <div className={styles.dataBadge}>
                  <p className={styles.amount}>
                    {formatMessage({ id: 'i18n_contract_type' })}
                  </p>
                  <div className={styles.deviderLine}></div>
                  <p className={styles.contract}>
                    {contract_type === CONTRACT_BY_MONTH
                      ? formatMessage({ id: 'i18n_monthly_contract' })
                      : formatMessage({ id: 'i18n_annual_contract' })}
                  </p>
                  <Button
                    className={`${styles.customButton} ${styles.btnChangeTop}`}
                    onClick={() => {
                      type_payment === TYPE_INVOICE
                        ? history.push('/payment?sendContact=invoice')
                        : type_payment === TYPE_CREDIT
                        ? history.push('/payment?changePlan=creditCard')
                        : history.push('/payment?addPlan=creditCard');
                    }}
                  >
                    {formatMessage({ id: 'i18n_change' })}
                  </Button>
                </div>
                <div className={styles.dataBadge}>
                  <p className={styles.amount}>
                    {formatMessage({ id: 'i18n_number_of_accounts' })}
                  </p>
                  <div className={styles.deviderLine}></div>
                  <p className={styles.contract}>{countUserContracts}</p>
                  <Button
                    className={`${styles.customButton} ${styles.btnChangeTop}`}
                    onClick={() => {
                      type_payment === TYPE_INVOICE
                        ? history.push('/payment?sendContact=invoice')
                        : type_payment === TYPE_CREDIT
                        ? history.push('/payment?addPlan=creditCard')
                        : history.push('/payment?addPlan=creditCard');
                    }}
                  >
                    {formatMessage({ id: 'i18n_change' })}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.headTitle}>
              <div className={styles.bolderIcon}></div>
              <div className={styles.titleIcon}></div>
              <span>{formatMessage({ id: 'i18n_next_billing' })}</span>
            </div>
            <div className={styles.boxContent}>
              <PaymentTable
                data={
                  transactionExtend
                    ? [
                        {
                          ...transactionExtend.transaction,
                          stripe_payment_at: transactionExtend.time,
                        },
                      ]
                    : []
                }
              />
            </div>
          </div>

          <div>
            <div className={styles.headTitle}>
              <div className={styles.bolderIcon}></div>
              <div className={styles.titleIcon}></div>
              <span>{formatMessage({ id: 'i18n_payment_method' })}</span>
              <Button
                className={`${styles.customButton} ${styles.btnFs16}`}
                onClick={() => {
                  type_payment === TYPE_INVOICE
                    ? history.push('/payment?changePayment=creditCard')
                    : type_payment === TYPE_CREDIT
                    ? history.push('/payment?changePayment=invoice')
                    : history.push('/payment?addPlan=creditCard');
                }}
              >
                {formatMessage({ id: 'i18n_change' })}
              </Button>
            </div>
            <div className={`${styles.boxContent} ${styles.tableCard}`}>
              <Table
                locale={{
                  emptyText: formatMessage({ id: 'i18n_empty_data_table' }),
                }}
                columns={columns}
                dataSource={[card]}
                pagination={false}
                rowKey={record => record}
                scroll={{ x: 900 }}
              />
            </div>
          </div>

          <div>
            <div className={styles.headTitle}>
              <div className={styles.bolderIcon}></div>
              <div className={styles.titleIcon}></div>
              <span>{formatMessage({ id: 'i18n_payment_history' })}</span>
            </div>
            <div className={styles.boxContent}>
              <PaymentTable data={transactions ? [...transactions.data] : []} />
            </div>
          </div>
        </div>
      )}
      <div className={styles.wrapperFooter}>
        <Footer />
      </div>
    </div>
  );
}

export default connect(({ PAYMENT, ACCOUNT }) => ({
  paymentStore: PAYMENT,
  accountStore: ACCOUNT,
}))(ContractDetail);
