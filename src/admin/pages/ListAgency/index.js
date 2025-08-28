import React, { useCallback, useEffect, useState } from 'react';
import { Table, Pagination, Modal, Button } from 'antd';
import { useIntl } from 'umi';
import { connect } from 'dva';
import styles from './styles.less';
import { PAGE_SIZE_LIMIT } from '@/constant';
import AgencyForm from '@/admin/components/AgencyForm';

function ManageAccount(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { dispatch, adminStore } = props;
  const { listAgency, totalRow } = adminStore;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [currentAgency, setCurrentAgency] = useState({});

  const getListAgency = useCallback(() => {
    const reqBody = {
      page: currentPage,
      pageSize: PAGE_SIZE_LIMIT,
    };
    dispatch({
      type: 'ADMIN/getListAgency',
      payload: { reqBody, setLoading },
    });
  }, [dispatch, currentPage]);

  useEffect(() => {
    getListAgency();
  }, [getListAgency]);

  const columns = [
    {
      title: formatMessage({ id: 'i18n_company_name' }),
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: formatMessage({ id: 'i18n_personal_in_charge' }),
      align: 'center',
      dataIndex: 'owner_name',
    },
    {
      title: formatMessage({ id: 'i18n_email' }),
      align: 'center',
      dataIndex: 'email',
    },
    // {
    //   title: formatMessage({ id: 'i18n_business_flow' }),
    //   align: 'center',
    //   dataIndex: 'business_flow',
    //   render: (_, record) =>
    //     record.commercial_distribution === DIRECT_SALES
    //       ? formatMessage({ id: 'i18n_direct_sales' })
    //       : formatMessage({ id: 'i18n_agency_sales' }),
    // },
    {
      title: formatMessage({ id: 'i18n_street_address' }),
      align: 'center',
      dataIndex: 'address',
    },
    {
      title: formatMessage({ id: 'i18n_phone_number' }),
      align: 'center',
      dataIndex: 'phone',
    },
    {
      title: formatMessage({ id: 'i18n_secondary_agency' }),
      align: 'center',
      dataIndex: 'secondary_agency',
    },
    {
      title: formatMessage({ id: 'i18n_agent_selling_price' }),
      align: 'center',
      dataIndex: 'agent_selling_price',
    },
    {
      title: formatMessage({ id: 'i18n_wholesale_price' }),
      align: 'center',
      dataIndex: 'wholesale_price',
    },
    {
      title: '',
      align: 'center',
      dataIndex: 'action',
      render: (_, record) => (
        <a
          onClick={() => {
            setCurrentAgency(record);
            setVisibleModal(true);
          }}
        >
          {formatMessage({ id: 'i18n_update_agency' })}
        </a>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pageTitle}>
        {formatMessage({ id: 'i18n_list_of_agencies' })}
      </div>
      <Table
        loading={loading}
        locale={{
          emptyText: formatMessage({ id: 'i18n_empty_data' }),
        }}
        dataSource={listAgency}
        className={styles.agencyTable}
        bordered
        pagination={false}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1600, y: 1000 }}
      />
      {/* <Pagination
        total={totalRow}
        current={currentPage}
        pageSize={10}
        hideOnSinglePage
        showSizeChanger={false}
        onChange={current => setCurrentPage(current)}
      /> */}
      <Modal
        visible={visibleModal}
        onCancel={() => {
          setVisibleModal(false);
        }}
        footer={null}
        title={formatMessage({ id: 'i18n_update_agency_title' })}
      >
        <AgencyForm
          formLayout="vertical"
          agencyProp={currentAgency}
          agencyClassName={styles.modalUpdateAgency}
          inModal={true}
          onClose={() => setVisibleModal(false)}
          renderButton={() => (
            <Button
              className={`btn btn-small ${styles.customButton}`}
              onClick={() => setVisibleModal(false)}
            >
              {formatMessage({ id: 'i18n_cancel' })}
            </Button>
          )}
        />
      </Modal>
    </div>
  );
}

export default connect(({ ADMIN }) => ({ adminStore: ADMIN }))(ManageAccount);
