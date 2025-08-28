import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import styles from './styles.less';
import Footer from '../../components/Footer';

const columns = [
  {
    title: '名前',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
  },
  {
    title: 'メールアドレス',
    dataIndex: 'email',
    width: '30%',
    sorter: true,
  },
  {
    title: '電話番号',
    dataIndex: 'phone',
    width: '15%',
    sorter: true,
  },
  {
    title: '会社名',
    dataIndex: 'company',
    width: '25%',
    sorter: true,
  },
  {
    title: '登録日',
    dataIndex: 'dateSend',
    width: '10%',
  },
];

function ViewAnswers(props) {
  const [pagination, setPagination] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    dispatch({
      type: 'SETTING_TEMPLATE/getAnswers',
      payload: {
        data: {
          page: current,
        },
      },
    });
  };

  const { dispatch } = props;

  useEffect(() => {
    dispatch({
      type: 'SETTING_TEMPLATE/getAnswers',
      payload: {
        // id: 4,
        data: {
          // pagination,
        },
      },
    });
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <span>顧客管理</span>
        </div>
        <Table
          rowKey={record => record.id}
          className={styles.table}
          columns={columns}
          dataSource={props.items || []}
          pagination={{ ...pagination, pageSize: 20, total: props.totalCount }}
          loading={props.isLoadingTemplate}
          onChange={handleTableChange}
          bordered
          rowClassName={(record, index) => {
            if (index % 2 === 0) {
              return styles.rowEven;
            }
            return styles.rowOdd;
          }}
        />
      </div>
      <Footer />
    </>
  );
}

export default connect(({ SETTING_TEMPLATE }) => ({
  items: SETTING_TEMPLATE.listAnswers,
  currentPage: SETTING_TEMPLATE.currentPage,
  lastPage: SETTING_TEMPLATE.lastPage,
  isLoadingTemplate: SETTING_TEMPLATE.isLoadingTemplate,
  totalCount: SETTING_TEMPLATE.totalCount,
}))(ViewAnswers);
