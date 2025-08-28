import React from 'react';
import { Table } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';
import {
  FORMAT_DATE_TEXT,
  CONTRACT_BY_MONTH,
  CONTRACT_MONTH_PRICE,
  CONTRACT_YEAR_PRICE,
  PAYMENT_TAX,
} from '@/constant';
import { formatCurrency } from '@/commons/function';

function PaymentTable(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { data } = props;

  const columns = [
    {
      title: formatMessage({ id: 'i18n_expect_billing_date' }),
      dataIndex: 'bilingDate',
      render: (_, record) =>
        moment.unix(record.stripe_payment_at).format(FORMAT_DATE_TEXT),
    },
    {
      title: formatMessage({ id: 'i18n_contract_type' }),
      dataIndex: 'contractType',
      render: (_, record) =>
        record.m_contract_id === CONTRACT_BY_MONTH
          ? formatMessage({ id: 'i18n_monthly_contract' })
          : formatMessage({ id: 'i18n_annual_contract' }),
    },
    {
      title: formatMessage({ id: 'i18n_fee' }),
      dataIndex: 'fee',
      render: (_, record) =>
        record.m_contract_id === CONTRACT_BY_MONTH
          ? formatCurrency(CONTRACT_MONTH_PRICE)
          : formatCurrency(CONTRACT_YEAR_PRICE),
    },
    {
      align: 'center',
      title: formatMessage({ id: 'i18n_number_of_accounts' }),
      dataIndex: 'numberAccounts',
      render: (_, record) => record.count,
    },
    {
      title: formatMessage({ id: 'i18n_amount_include_tax' }),
      dataIndex: 'amount',
      render: (_, record) => formatCurrency(record.price * record.count),
    },
  ];

  return (
    <Table
      className={`${data && data.length ? 'showNoteTable' : ''}`}
      pagination={{
        hideOnSinglePage: true,
        pageSize: 10,
        total: data.length,
        showSizeChanger: false,
      }}
      locale={{
        emptyText: formatMessage({ id: 'i18n_empty_data_table' }),
      }}
      columns={columns}
      dataSource={data}
      footer={() => (
        <div>{formatMessage({ id: 'i18n_note_table_transactions' })}</div>
      )}
      rowKey={record => record.stripe_payment_at}
      scroll={{ x: 900 }}
    />
  );
}

export default PaymentTable;
