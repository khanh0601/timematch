import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Checkbox,
  ConfigProvider,
  Modal,
} from 'antd';
import {
  ExclamationCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import styles from './styles.less';
import {
  PAGE_SIZE_LIMIT,
  FORMAT_DATE_TEXT,
  ROLE_MEMBER,
  ROLE_MANAGER,
  CONTRACT_BY_TRIAL,
  CONTRACT_BY_MONTH,
  CONTRACT_BY_YEAR,
  TYPE_CREDIT,
  TYPE_INVOICE,
  DIRECT_SALES,
  AGENCY_SALES,
  SUSPENSE_ACCOUNT,
  ACTIVE_ACCOUNT,
  FORMAT_DATE_TEXT_PAID_DATE,
  TYPE_ADMIN,
} from '@/constant';
import dayjs from 'dayjs';
import { CSVLink } from 'react-csv';
import jaJP from 'antd/lib/locale/ja_JP';
import EditUserModal from './EditUserModalV2';
import UpdateFormModal from './UpdateFormModal';

const { confirm } = Modal;

const convertData = data => {
  return data.map(item => ({
    name: item.name,
    address: item.address,
    phone: item.phone,
    trial_start_at: item.trial_start_at,
    trial_end_at: item.trial_end_at,
    price: item.price,
    type_payment: item.type_payment,
    contract_type: item.contract_type,
    role_type: item.role_type,
    start_time: item.start_time,
    end_time: item.end_time,
    commercial_distribution: item.commercial_distribution,
    status: item.status,
    agency_id: item.agency_id || null,
    id: item.id,
    company: item.company || null,
  }));
};

function ManageAccount(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { dispatch, adminStore } = props;
  const { listUser, csvDowload } = adminStore;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [listSelected, setListSelected] = useState({});
  const [searchText, setSearchText] = useState(undefined);
  const [searchTextStamp, setSearchTextStamp] = useState(undefined);
  const [loadingTable, setLoadingTable] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [visibleUpdateFormModal, setVisibleUpdateFormModal] = useState(false);
  const [recordUpdate, setRecordUpdate] = useState({});
  const [recordEdit, setRecordEdit] = useState({});
  const [filterTable, setFilterTable] = useState({});
  const [checkAll, setCheckAll] = useState(false);
  const [csvCheck, setCsvCheck] = useState(false);
  const csvInstance = useRef();

  useEffect(() => {
    if (csvCheck && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click();
        setCsvCheck(false);
      });
    }
  }, [csvDowload]);

  const getListAccount = useCallback(() => {
    const reqBody = {
      page: currentPage,
      pageSize: PAGE_SIZE_LIMIT,
    };
    if (searchText) {
      reqBody.keyword = searchText;
    }
    for (const key in filterTable) {
      if (filterTable[key]) {
        reqBody[key] = filterTable[key];
      }
    }

    dispatch({
      type: 'ADMIN/getListUser',
      payload: { reqBody, setLoadingTable, formatMessage },
    });
  }, [dispatch, currentPage, searchText, filterTable]);

  useEffect(() => {
    getListAccount();
  }, [getListAccount]);

  const getListAgency = useCallback(() => {
    const reqBody = {
      page: 1,
      pageSize: PAGE_SIZE_LIMIT,
    };
    dispatch({
      type: 'ADMIN/getListAgency',
      payload: { reqBody, setLoading: () => {} },
    });
  }, [dispatch]);

  useEffect(() => {
    getListAgency();
  }, [getListAgency]);

  useEffect(() => {
    setData([...listUser]);
  }, [listUser]);

  const edit = record => {
    setRecordEdit(record);
    setVisibleEditModal(true);
  };

  const handleUpdateExpireForm = record => {
    setRecordUpdate(record);
    setVisibleUpdateFormModal(true);
  };

  const handleDeleteRow = record => {
    confirm({
      title: formatMessage({ id: 'i18n_confirm_delete_account' }),
      icon: <ExclamationCircleOutlined />,
      cancelText: formatMessage({ id: 'i18n_cancel_text' }),
      className: 'suspenseConfirm',
      onOk: () => {
        dispatch({
          type: 'ADMIN/deleteUser',
          payload: { id: record.id, formatMessage, setLoadingTable },
        });
      },
    });
  };

  const handleSuspenseUser = record => {
    const arrayReq = convertData([{ ...record, status: SUSPENSE_ACCOUNT }]);
    confirm({
      title: formatMessage({ id: 'i18n_confirm_suspense_account' }),
      icon: <ExclamationCircleOutlined />,
      cancelText: formatMessage({ id: 'i18n_cancel_text' }),
      className: 'suspenseConfirm',
      onOk: () => {
        const reqBody = {
          users: arrayReq,
        };
        dispatch({
          type: 'ADMIN/suspenseUser',
          payload: {
            reqBody,
            setLoadingTable,
            formatMessage,
            id: record.id,
          },
        });
      },
    });
  };

  const handleActiveUser = record => {
    const arrayReq = convertData([{ ...record, status: ACTIVE_ACCOUNT }]);
    const reqBody = { users: arrayReq };
    dispatch({
      type: 'ADMIN/activeUser',
      payload: {
        reqBody,
        setLoadingTable,
        setListSelected,
        formatMessage,
      },
    });
  };

  const handleClickCheckbox = (event, record) => {
    const { checked } = event.target;
    const newList = { ...listSelected };
    newList[record.id] = checked;
    setListSelected(newList);
  };

  const handleDownloadInvoice = (url, filename) => {
    const element = document.createElement('a');
    element.download = filename;
    element.href = url;
    element.click();
  };

  const exportInvoice = async record => {
    await dispatch({
      type: 'ADMIN/getInvoice',
      payload: {
        user_id: record.id,
        handleDownloadInvoice,
      },
    });
  };

  const handleSortTable = name => {
    const updatedFilter = {};
    setListSelected({});
    setCheckAll(false);
    if (!filterTable[name]) {
      updatedFilter[name] = 'asc';
    } else if (filterTable[name] === 'asc') {
      updatedFilter[name] = 'desc';
    } else {
      updatedFilter[name] = undefined;
    }

    setFilterTable(updatedFilter);
  };

  const handleCheckAll = event => {
    const { checked } = event.target;
    const newList = {};

    if (checked) {
      for (const item of data) {
        if (!item.deleted_at) {
          newList[item.id] = checked;
        }
      }
    }
    setListSelected(newList);
    setCheckAll(checked);
  };

  const columns = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      fixed: 'left',
      width: '80px',
    },
    {
      title: (
        <div>
          {formatMessage({ id: 'i18n_check' })}
          <Checkbox disabled checked={checkAll} onChange={handleCheckAll} />
        </div>
      ),
      align: 'center',
      width: '100px',
      render: (_, record) => (
        <Checkbox
          disabled
          checked={listSelected[record.id]}
          className={styles.customCheckbox}
          onChange={event => handleClickCheckbox(event, record)}
        />
      ),
      fixed: 'left',
    },
    {
      title: (
        <div
          onClick={() => handleSortTable('company')}
          className={styles.title}
        >
          <span>{formatMessage({ id: 'i18n_company_name' })}</span>
          <span className={styles.groupCaret}>
            <CaretUpOutlined
              className={`${styles.titleIcon} ${
                filterTable.company === 'asc' ? styles.titleIconActive : ''
              }`}
            />
            <CaretDownOutlined
              className={`${styles.titleIcon} ${
                filterTable.company === 'desc' ? styles.titleIconActive : ''
              }`}
            />
          </span>
        </div>
      ),
      align: 'center',
      dataIndex: 'company',
      width: '200px',
      fixed: 'left',
    },
    {
      title: (
        <div onClick={() => handleSortTable('name')} className={styles.title}>
          <span>{formatMessage({ id: 'i18n_employee_name' })}</span>
          <span className={styles.groupCaret}>
            <CaretUpOutlined
              className={`${styles.titleIcon} ${
                filterTable.name === 'asc' ? styles.titleIconActive : ''
              }`}
            />
            <CaretDownOutlined
              className={`${styles.titleIcon} ${
                filterTable.name === 'desc' ? styles.titleIconActive : ''
              }`}
            />
          </span>
        </div>
      ),
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: formatMessage({ id: 'i18n_payment_method' }),
      align: 'center',
      dataIndex: 'type_payment',
      render: (_, record) =>
        record.type_payment === TYPE_INVOICE
          ? formatMessage({ id: 'i18n_invoice' })
          : record.type_payment === TYPE_CREDIT
          ? formatMessage({ id: 'i18n_credit_card' })
          : '',
    },
    {
      title: (
        <div onClick={() => handleSortTable('email')} className={styles.title}>
          <span>{formatMessage({ id: 'i18n_email' })}</span>
          <span className={styles.groupCaret}>
            <CaretUpOutlined
              className={`${styles.titleIcon} ${
                filterTable.email === 'asc' ? styles.titleIconActive : ''
              }`}
            />
            <CaretDownOutlined
              className={`${styles.titleIcon} ${
                filterTable.email === 'desc' ? styles.titleIconActive : ''
              }`}
            />
          </span>
        </div>
      ),
      align: 'center',
      dataIndex: 'email',
      render: (_, record) =>
        record.email || record.google_email || record.microsoft_email,
    },
    {
      title: (
        <div
          onClick={() => handleSortTable('start_time')}
          className={styles.title}
        >
          <span>{formatMessage({ id: 'i18n_paid_membership_period' })}</span>
          <span className={styles.groupCaret}>
            <CaretUpOutlined
              className={`${styles.titleIcon} ${
                filterTable.start_time === 'asc' ? styles.titleIconActive : ''
              }`}
            />
            <CaretDownOutlined
              className={`${styles.titleIcon} ${
                filterTable.start_time === 'desc' ? styles.titleIconActive : ''
              }`}
            />
          </span>
        </div>
      ),
      align: 'center',
      dataIndex: 'member_period',
      width: '170px',
      render: (_, record) => {
        return record.start_time &&
          record.end_time &&
          record.deleted_at &&
          dayjs(record.deleted_at).valueOf() >
            dayjs.unix(record.start_time).valueOf() &&
          dayjs(record.deleted_at).valueOf() <
            dayjs.unix(record.end_time).valueOf()
          ? `${dayjs
              .unix(record.start_time)
              .format(FORMAT_DATE_TEXT)} | ${dayjs(record.deleted_at).format(
              FORMAT_DATE_TEXT,
            )}`
          : record.start_time && record.end_time
          ? `${dayjs
              .unix(record.start_time)
              .format(FORMAT_DATE_TEXT)} | ${dayjs
              .unix(record.end_time)
              .format(FORMAT_DATE_TEXT)}`
          : '';
      },
    },
    {
      title: formatMessage({ id: 'i18n_paid_date' }),
      align: 'center',
      dataIndex: 'role_type',
      render: (_, record) =>
        record.end_time
          ? dayjs
              .unix(record.start_time)
              .add(1, 'month')
              .format(FORMAT_DATE_TEXT_PAID_DATE)
          : '',
    },
    {
      title: (
        <div
          onClick={() => handleSortTable('role_type')}
          className={styles.title}
        >
          <span>
            <div>{formatMessage({ id: 'i18n_authority_type' })}</div>
            <div>{formatMessage({ id: 'i18n_authority_type_line_2' })}</div>
          </span>
          <span className={styles.groupCaret}>
            <CaretUpOutlined
              className={`${styles.titleIcon} ${
                filterTable.role_type === 'asc' ? styles.titleIconActive : ''
              }`}
            />
            <CaretDownOutlined
              className={`${styles.titleIcon} ${
                filterTable.role_type === 'desc' ? styles.titleIconActive : ''
              }`}
            />
          </span>
        </div>
      ),
      align: 'center',
      dataIndex: 'role_type',
      render: (_, record) =>
        record.role_type === ROLE_MEMBER
          ? formatMessage({ id: 'i18n_member' })
          : record.role_type === ROLE_MANAGER
          ? formatMessage({ id: 'i18n_manager' })
          : '',
    },
    {
      title: (
        <div
          onClick={() => handleSortTable('contract_type')}
          className={styles.title}
        >
          <span>
            <div>{formatMessage({ id: 'i18n_contract_type' })}</div>
            <div>{formatMessage({ id: 'i18n_contract_type_line_2' })}</div>
          </span>
          <span className={styles.groupCaret}>
            <CaretUpOutlined
              className={`${styles.titleIcon} ${
                filterTable.contract_type === 'asc'
                  ? styles.titleIconActive
                  : ''
              }`}
            />
            <CaretDownOutlined
              className={`${styles.titleIcon} ${
                filterTable.contract_type === 'desc'
                  ? styles.titleIconActive
                  : ''
              }`}
            />
          </span>
        </div>
      ),
      align: 'center',
      dataIndex: 'contract_type',
      render: (_, record) =>
        record.contract_type === CONTRACT_BY_TRIAL
          ? formatMessage({ id: 'i18n_by_trial' })
          : record.contract_type === CONTRACT_BY_MONTH
          ? formatMessage({ id: 'i18n_by_month' })
          : record.contract_type === CONTRACT_BY_YEAR
          ? formatMessage({ id: 'i18n_by_year' })
          : '',
    },
    {
      title: formatMessage({ id: 'i18n_amount' }),
      align: 'center',
      dataIndex: 'price',
      render: (_, record) =>
        record.price ? record.price / record.quantity + '円' : '',
    },
    {
      title: formatMessage({ id: 'i18n_free_period_start' }),
      align: 'center',
      dataIndex: 'trial_start_at',
      render: (_, record) =>
        record.trial_start_at &&
        dayjs(record.trial_start_at).format(FORMAT_DATE_TEXT),
    },
    {
      title: formatMessage({ id: 'i18n_free_period_end' }),
      align: 'center',
      dataIndex: 'trial_end_at',
      render: (_, record) =>
        record.trial_start_at &&
        record.trial_end_at &&
        record.deleted_at &&
        dayjs(record.deleted_at).valueOf() >
          dayjs(record.trial_start_at).valueOf() &&
        dayjs(record.deleted_at).valueOf() <
          dayjs(record.trial_end_at).valueOf()
          ? dayjs(record.deleted_at).format(FORMAT_DATE_TEXT)
          : record.trial_end_at &&
            dayjs(record.trial_end_at).format(FORMAT_DATE_TEXT),
    },
    {
      title: formatMessage({ id: 'i18n_status_status' }),
      align: 'center',
      dataIndex: 'status',
      render: (_, record) => {
        if (record.status === SUSPENSE_ACCOUNT) {
          return formatMessage({ id: 'i18n_suspense_of_use' });
        } else if (
          record.start_time &&
          record.end_time &&
          record.deleted_at &&
          dayjs().valueOf() > dayjs.unix(record.start_time).valueOf() &&
          dayjs().valueOf() < dayjs.unix(record.end_time).valueOf()
        ) {
          return formatMessage({ id: 'i18n_cancellation' });
        } else if (
          record.trial_start_at &&
          record.trial_end_at &&
          record.deleted_at &&
          dayjs().valueOf() > dayjs(record.trial_start_at).valueOf() &&
          dayjs().valueOf() < dayjs(record.trial_end_at).valueOf()
        ) {
          return formatMessage({ id: 'i18n_suspense_of_use_status' });
        } else if (
          record.trial_end_at &&
          dayjs().valueOf() < dayjs(record.trial_end_at).valueOf()
        ) {
          return formatMessage({ id: 'i18n_free_registration' });
        } else {
          return record.end_time &&
            dayjs.unix(record.end_time).valueOf() < dayjs().valueOf()
            ? formatMessage({ id: 'i18n_termination_contract' })
            : record.contract_type === CONTRACT_BY_MONTH
            ? formatMessage({ id: 'i18n_state_by_month' })
            : record.contract_type === CONTRACT_BY_YEAR
            ? formatMessage({ id: 'i18n_state_by_year' })
            : record.trial_end_at &&
              dayjs().valueOf() > dayjs(record.trial_end_at).valueOf()
            ? formatMessage({ id: 'i18n_end_free_membership_registration' })
            : '';
        }
      },
    },
    {
      title: formatMessage({ id: 'i18n_business_flow' }),
      align: 'center',
      dataIndex: 'commercial_distribution',
      width: '200px',
      render: (_, record) =>
        record.commercial_distribution === DIRECT_SALES
          ? formatMessage({ id: 'i18n_direct_sales' })
          : record.commercial_distribution === AGENCY_SALES
          ? formatMessage({ id: 'i18n_agency_sales' })
          : '',
    },
    {
      title: formatMessage({ id: 'i18n_agency_in_case' }),
      align: 'center',
      dataIndex: 'agency_name',
    },
    {
      title: 'フォームの開始日',
      align: 'center',
      dataIndex: 'form_start_time',
      render: (_, record) =>
        record.form_start_time &&
        dayjs(record.form_start_time).format(FORMAT_DATE_TEXT),
    },
    {
      title: 'フォーム終了日',
      align: 'center',
      dataIndex: 'form_end_time',
      render: (_, record) =>
        record.form_end_time &&
        dayjs(record.form_end_time).format(FORMAT_DATE_TEXT),
    },
    {
      title: formatMessage({ id: 'i18n_action' }),
      align: 'center',
      dataIndex: 'action',
      width: '200px',
      render: (_, record) => {
        return (
          <div className={styles.groupAction}>
            <div>
              <a
                className={
                  record.deleted_at || record.status === SUSPENSE_ACCOUNT
                    ? 'deleted'
                    : undefined
                }
                onClick={() => edit(record)}
              >
                {formatMessage({ id: 'i18n_update_information' })}
              </a>
            </div>
            <div>
              <a
                className={
                  record.deleted_at || record.status === SUSPENSE_ACCOUNT
                    ? 'deleted'
                    : undefined
                }
                onClick={() =>
                  handleUpdateExpireForm({
                    contract_id: record.contract_id,
                    form_start_time: record.form_start_time,
                    form_end_time: record.form_end_time,
                  })
                }
              >
                {formatMessage({ id: 'i18n_update_expire_form' })}
              </a>
            </div>
            <div>
              <a
                className={
                  !(
                    record.role_type === TYPE_ADMIN &&
                    record.type_payment === TYPE_INVOICE
                  )
                    ? 'deleted'
                    : undefined
                }
                onClick={() => exportInvoice(record)}
              >
                {formatMessage({ id: 'i18n_invoicing' })}
              </a>
            </div>
            <div>
              {record.status === SUSPENSE_ACCOUNT ? (
                <a
                  className={record.deleted_at ? 'deleted' : undefined}
                  onClick={() => handleActiveUser(record)}
                >
                  {formatMessage({ id: 'i18n_activation' })}
                </a>
              ) : (
                <a
                  className={record.deleted_at ? 'deleted' : undefined}
                  onClick={() => handleSuspenseUser(record)}
                >
                  {formatMessage({ id: 'i18n_suspense_of_use' })}
                </a>
              )}
            </div>
            <div>
              <a
                className={record.deleted_at ? 'deleted' : undefined}
                onClick={() => handleDeleteRow(record)}
              >
                {formatMessage({ id: 'i18n_delete_row_user' })}
              </a>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <div
          onClick={() => handleSortTable('address')}
          className={styles.title}
        >
          <span>{formatMessage({ id: 'i18n_street_address' })}</span>
          <span className={styles.groupCaret}>
            <CaretUpOutlined
              className={`${styles.titleIcon} ${
                filterTable.address === 'asc' ? styles.titleIconActive : ''
              }`}
            />
            <CaretDownOutlined
              className={`${styles.titleIcon} ${
                filterTable.address === 'desc' ? styles.titleIconActive : ''
              }`}
            />
          </span>
        </div>
      ),
      align: 'center',
      dataIndex: 'address',
    },
    {
      title: (
        <div onClick={() => handleSortTable('phone')} className={styles.title}>
          <span>{formatMessage({ id: 'i18n_phone_number' })}</span>
          <span className={styles.groupCaret}>
            <CaretUpOutlined
              className={`${styles.titleIcon} ${
                filterTable.phone === 'asc' ? styles.titleIconActive : ''
              }`}
            />
            <CaretDownOutlined
              className={`${styles.titleIcon} ${
                filterTable.phone === 'desc' ? styles.titleIconActive : ''
              }`}
            />
          </span>
        </div>
      ),
      align: 'center',
      dataIndex: 'phone',
    },
  ];

  const headers = [
    { label: 'ID', key: 'id' },
    { label: '会社名', key: 'company' },
    { label: '社員名', key: 'name' },
    { label: 'お支払い方法', key: 'type_payment' },
    { label: 'メールアドレス', key: 'email' },
    { label: '有料会員期間', key: 'member_period' },
    { label: '権限種類※管理者かメンバー', key: 'role_type' },
    { label: '契約種別※月か年', key: 'contract_type' },
    { label: '金額', key: 'price' },
    { label: '無料期間開始', key: 'trial_start_at' },
    { label: '無料期間終了', key: 'trial_end_at' },
    { label: 'ステータス状況', key: 'status' },
    { label: '商流', key: 'commercial_distribution' },
    { label: '代理店の場合、代理店名', key: 'agency_name' },
    { label: 'フォームの開始日', key: 'form_start_time' },
    { label: 'フォーム終了日', key: 'form_end_time' },
    { label: '住所', key: 'address' },
    { label: '電話番号', key: 'phone' },
  ];

  const csvReport = {
    data: csvDowload,
    headers: headers,
    filename: 'Smoooth.csv',
  };

  const onUpdateUsers = (rowUpdate, dataUpdate, isUpdateAll) => {
    let arrayReq = [rowUpdate];
    if (isUpdateAll) {
      const arrayUser = data.filter(item => listSelected[item.id]);
      for (const item of arrayUser) {
        if (item.id !== rowUpdate.id) {
          const newItem = { ...item, ...dataUpdate };
          if (!newItem.type_payment) {
            newItem.type_payment = TYPE_INVOICE;
          }
          arrayReq.push(newItem);
        }
      }
    }
    arrayReq = convertData(arrayReq);
    const reqBody = { users: arrayReq };
    dispatch({
      type: 'ADMIN/updateUsers',
      payload: {
        reqBody,
        setLoadingTable,
        formatMessage,
      },
    });
  };

  const onPressSearchButton = () => {
    const text = searchTextStamp ? searchTextStamp.trim() : searchTextStamp;
    setSearchText(text);
    setCurrentPage(1);
  };

  const handleClickDownload = () => {
    const reqBody = {
      page: currentPage,
      pageSize: PAGE_SIZE_LIMIT,
    };

    dispatch({
      type: 'ADMIN/getAllUsers',
      payload: { reqBody, formatMessage, setCsvCheck },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.groupHeaderInput}>
        <Row gutter={16}>
          <Col span={14}>
            <Input
              value={searchTextStamp}
              onChange={event => setSearchTextStamp(event.target.value)}
              onPressEnter={onPressSearchButton}
              placeholder={formatMessage({ id: 'i18n_search_by_keyword' })}
            />
          </Col>
          <Col span={10}>
            <div className={styles.groupBtn}>
              <Button
                onClick={onPressSearchButton}
                className="btn btnGreen btn-small btn-small-width"
              >
                {formatMessage({ id: 'i18n_search' })}
              </Button>
              <Button
                onClick={() => history.push('/admin/add-new-account')}
                className="btn btnGreenOutline btn-small"
              >
                {formatMessage({ id: 'i18n_add_new' })}
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      <Table
        loading={loadingTable}
        locale={{
          emptyText: formatMessage({ id: 'i18n_empty_data' }),
        }}
        dataSource={data}
        className={styles.accountTable}
        bordered
        pagination={false}
        columns={columns}
        scroll={{ x: 3600, y: 700 }}
        rowKey="id"
      />
      <div className={styles.groupBottom}>
        <div>
          {formatMessage({ id: 'i18n_csv_download' })}:
          <span className={styles.hereButton} onClick={handleClickDownload}>
            {formatMessage({ id: 'i18n_here' })}
          </span>
          <CSVLink {...csvReport} ref={csvInstance} />
        </div>
        {/* <Pagination
          total={totalRowUser}
          current={currentPage}
          pageSize={10}
          hideOnSinglePage
          showSizeChanger={false}
          onChange={current => {
            setCheckAll(false);
            setListSelected({});
            setCurrentPage(current);
          }}
        /> */}
      </div>
      <ConfigProvider locale={jaJP}>
        <EditUserModal
          visible={visibleEditModal}
          onCancel={() => setVisibleEditModal(false)}
          record={recordEdit}
          formatMessage={formatMessage}
          onUpdateUsers={onUpdateUsers}
        />
        <UpdateFormModal
          visible={visibleUpdateFormModal}
          record={recordUpdate}
          onCancel={() => setVisibleUpdateFormModal(false)}
          formatMessage={formatMessage}
        />
      </ConfigProvider>
    </div>
  );
}

export default connect(({ ADMIN }) => ({ adminStore: ADMIN }))(ManageAccount);
