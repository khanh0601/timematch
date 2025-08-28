import React, { useCallback, useEffect, useState } from 'react';
import {
  Tabs,
  Button,
  Table,
  Dropdown,
  Menu,
  Modal,
  Spin,
  message,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './styles.less';
import { useIntl, useHistory } from 'umi';
import pinion from '@/assets/images/i-pinion.svg';
import { connect } from 'dva';
import {
  ROLE_MANAGER,
  ROLE_MEMBER,
  CONTRACT_BY_MONTH,
  CONTRACT_BY_YEAR,
  TYPE_INVOICE,
  TYPE_CREDIT,
} from '@/constant';
import Footer from '@/components/Footer';
import { notify } from '../../commons/function';

const { TabPane } = Tabs;
function AccountStatus(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const {
    dispatch,
    accountStore,
    paymentStore,
    userConnectionsStore,
    masterStore,
  } = props;
  const { contractDetail } = paymentStore;
  const {
    accountOverview,
    listConnection,
    activeAccounts,
    checkingAccounts,
  } = userConnectionsStore;
  const { profile } = masterStore;
  const { type_payment } = contractDetail;
  const {
    countUserContracts,
    countUserContractMonthUseds,
    countUserContractUseds,
    countUserContractYearlyUseds,
    countYearContracts,
    countMonthContracts,
  } = accountOverview;
  const history = useHistory();
  const [isOpenContract, setIsOpenContract] = useState(false);
  const [isOpenRole, setIsOpenRole] = useState(false);
  const [loading, setLoading] = useState(true);

  const getPageData = useCallback(
    async profileID => {
      setLoading(true);

      await Promise.all([
        dispatch({ type: 'USERCONNECTIONS/getUserConnectionPlans' }),
        dispatch({
          type: 'PAYMENT/getContractDetail',
          payload: { setLoading: () => {} },
        }),
        dispatch({
          type: 'USERCONNECTIONS/getUserConnectionsByOwnerId',
          payload: {
            owner: profileID,
          },
        }),
      ]);

      setLoading(false);
    },
    [dispatch],
  );

  useEffect(() => {
    if (profile?.id) {
      getPageData(profile?.id);
    }
  }, [profile]);

  const confirmDeleteAccount = (record, listConnection) => {
    const { role_type, status, id, member_id } = record;
    let listManager = listConnection.filter(
      ele => ele.role_type === ROLE_MANAGER,
    );
    if (
      (role_type === ROLE_MANAGER && listManager.length >= 2) ||
      role_type === ROLE_MEMBER
    ) {
      Modal.confirm({
        title: formatMessage({ id: 'i18n_confirm_delete_account' }),
        icon: <ExclamationCircleOutlined />,
        okText: formatMessage({ id: 'i18n_confirm_delete' }),
        cancelText: formatMessage({ id: 'i18n_confirm_not_delete' }),
        onOk: () => {
          const payload = {
            id,
            message,
            formatMessage,
            statusAccount: status,
            member_id,
          };
          dispatch({ type: 'USERCONNECTIONS/deleteUserConnection', payload });
        },
      });
    } else {
      notify(formatMessage({ id: 'i18n_cannot_delete_owner' }));
    }
  };

  const handleUpdateConnection = (record, value, name) => {
    const prevContractType = record.contract_type;
    const prevRoleType = record.role_type;
    if (
      (name === 'contract_type' && prevContractType === value) ||
      (name === 'role_type' && prevRoleType === value)
    ) {
      return;
    } else {
      const reqBody = {
        _method: 'PUT',
      };

      if (name === 'contract_type') {
        reqBody.contract_type = value;
      } else if (name === 'role_type') {
        reqBody.role_type = value;
      }
      dispatch({
        type: 'USERCONNECTIONS/updateUserConnection',
        payload: {
          id: record.id,
          reqBody,
          showMessage: message,
          formatMessage,
          name,
        },
      });
    }
  };

  const onClickSubmenu = name => {
    if (name === 'contract') {
      setIsOpenContract(value => !value);
    } else {
      setIsOpenRole(value => !value);
    }
  };

  const actionMenu = record => (
    <Menu>
      <Menu.SubMenu
        title={formatMessage({ id: 'i18n_contract_type' })}
        icon=""
        className="menuTitle"
        key="0"
        onTitleClick={() => onClickSubmenu('contract')}
      />
      <Menu.Item
        className={!isOpenContract && 'hideContract'}
        onClick={() =>
          handleUpdateConnection(record, CONTRACT_BY_YEAR, 'contract_type')
        }
        key="1"
      >
        <span>{formatMessage({ id: 'i18n_annual_contract' })}</span>
      </Menu.Item>
      <Menu.Item
        className={!isOpenContract && 'hideContract'}
        onClick={() =>
          handleUpdateConnection(record, CONTRACT_BY_MONTH, 'contract_type')
        }
        key="2"
      >
        <span>{formatMessage({ id: 'i18n_monthly_contract' })}</span>
      </Menu.Item>
      <Menu.SubMenu
        title={formatMessage({ id: 'i18n_change_role' })}
        icon=""
        className="menuTitle"
        key="3"
        onTitleClick={() => onClickSubmenu('role')}
      />
      <Menu.Item
        className={!isOpenRole && 'hideContract'}
        onClick={() =>
          handleUpdateConnection(record, ROLE_MANAGER, 'role_type')
        }
        key="4"
      >
        <span>{formatMessage({ id: 'i18n_manager' })}</span>
      </Menu.Item>
      <Menu.Item
        className={!isOpenRole && 'hideContract'}
        onClick={() => handleUpdateConnection(record, ROLE_MEMBER, 'role_type')}
        key="5"
      >
        <span>{formatMessage({ id: 'i18n_member' })}</span>
      </Menu.Item>
      <Menu.Item
        className="menuTitle"
        onClick={() => confirmDeleteAccount(record, listConnection)}
        key="6"
      >
        <span>{formatMessage({ id: 'i18n_delete' })}</span>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: formatMessage({ id: 'i18n_name' }),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => record.user && record.user.name,
      width: '30%',
    },
    {
      title: formatMessage({ id: 'i18n_email' }),
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => record && record.member_email,
      width: '31%',
    },
    {
      title: formatMessage({ id: 'i18n_authority' }),
      dataIndex: 'authority',
      key: 'authority',
      render: (_, record) =>
        record && record.role_type === ROLE_MANAGER
          ? formatMessage({ id: 'i18n_manager' })
          : formatMessage({ id: 'i18n_member' }),
      width: '13%',
    },
    {
      title: formatMessage({ id: 'i18n_contract_type' }),
      dataIndex: 'contract_type',
      key: 'contract_type',
      render: (_, record) =>
        record.contract_type === CONTRACT_BY_MONTH
          ? formatMessage({ id: 'i18n_by_month' })
          : formatMessage({ id: 'i18n_by_year' }),
      width: '13%',
    },
    {
      title: formatMessage({ id: 'i18n_edit' }),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => {
        return (
          <div className={styles.actionBtn}>
            <Dropdown
              overlay={actionMenu(record)}
              trigger={['click']}
              placement={'bottomRight'}
              overlayClassName="dropdownAccountOptions"
              onVisibleChange={() => {
                setIsOpenContract(false);
                setIsOpenRole(false);
              }}
            >
              <img src={pinion} />
            </Dropdown>
          </div>
        );
      },
      width: '13%',
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin className="loading-page" size="large" />
      ) : (
        <div>
          <div className={styles.accountStatus}>
            <div className={styles.headTitle}>
              <div className={styles.bolderIcon}></div>
              <div className={styles.titleIcon}></div>
              <span>{formatMessage({ id: 'i18n_account_status' })}</span>
            </div>
            <div className={styles.accountData}>
              <div
                className={`${countUserContracts > 10 &&
                  styles.largerDataBadge} ${styles.dataBadge}`}
              >
                <p className={styles.amount}>
                  {formatMessage({ id: 'i18n_contract_account_amount' })}：
                  {countUserContracts}
                </p>
                <div className={styles.deviderLine} />
                <p className={styles.contract}>
                  {formatMessage({ id: 'i18n_monthly_contract' })}：
                  {countMonthContracts || 0}/
                  {formatMessage({ id: 'i18n_annual_contract' })}：
                  {countYearContracts || 0}
                </p>
                <Button
                  onClick={() => {
                    type_payment === TYPE_INVOICE
                      ? history.push('/payment?sendContact=invoice')
                      : type_payment === TYPE_CREDIT
                      ? history.push('/payment?addPlan=creditCard')
                      : history.push('/payment?addPlan=creditCard');
                  }}
                >
                  {formatMessage({ id: 'i18n_add_account' })}
                </Button>
              </div>
              <div className={styles.dataBadge}>
                <p className={styles.amount}>
                  {formatMessage({ id: 'i18n_active_times' })}：
                  {countUserContractUseds || 0}
                </p>
                <div className={styles.deviderLine} />
                <p className={styles.contract}>
                  {formatMessage({ id: 'i18n_monthly_contract' })}：
                  {countUserContractMonthUseds}/
                  {formatMessage({ id: 'i18n_annual_contract' })}：
                  {countUserContractYearlyUseds}
                </p>
              </div>
              <div className={styles.dataBadge}>
                <p className={styles.amount}>
                  {formatMessage({ id: 'i18n_available_amount' })}：
                  {countUserContracts - countUserContractUseds}
                </p>
                <div className={styles.deviderLine} />

                <p className={styles.contract}>
                  {formatMessage({ id: 'i18n_monthly_contract' })}：
                  {countMonthContracts - countUserContractMonthUseds || 0}/
                  {formatMessage({ id: 'i18n_annual_contract' })}：
                  {countYearContracts - countUserContractYearlyUseds || 0}
                </p>
                <Button onClick={() => history.push('/add-member')}>
                  {formatMessage({ id: 'i18n_member_invite' })}
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.bottomContentContainer}>
            <div className={styles.bottomContent}>
              <Tabs defaultActiveKey="1" className={styles.eventManageTabs}>
                <TabPane
                  tab={formatMessage({ id: 'i18n_all_account' })}
                  key="1"
                >
                  <div className={styles.memberTable}>
                    <Table
                      dataSource={listConnection}
                      columns={columns}
                      pagination={false}
                      rowKey="id"
                      locale={{
                        emptyText: formatMessage({ id: 'i18n_empty_data' }),
                      }}
                      scroll={{ x: 100 }}
                    />
                  </div>
                </TabPane>
                <TabPane tab={formatMessage({ id: 'i18n_activity' })} key="2">
                  <div className={styles.memberTable}>
                    <Table
                      dataSource={activeAccounts}
                      columns={columns}
                      pagination={false}
                      rowKey="id"
                      locale={{
                        emptyText: formatMessage({ id: 'i18n_empty_data' }),
                      }}
                      scroll={{ x: true }}
                    />
                  </div>
                </TabPane>
                <TabPane tab={formatMessage({ id: 'i18n_checking' })} key="3">
                  <div className={styles.memberTable}>
                    <Table
                      dataSource={checkingAccounts}
                      columns={columns}
                      pagination={false}
                      rowKey="id"
                      locale={{
                        emptyText: formatMessage({ id: 'i18n_empty_data' }),
                      }}
                      scroll={{ x: true }}
                    />
                  </div>
                </TabPane>
              </Tabs>
              <div className={styles.returnHomeBtn}>
                <Button onClick={() => history.push('/')}>
                  {formatMessage({ id: 'i18n_return_home' })}
                </Button>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(({ ACCOUNT, PAYMENT, USERCONNECTIONS, MASTER }) => ({
  accountStore: ACCOUNT,
  paymentStore: PAYMENT,
  userConnectionsStore: USERCONNECTIONS,
  masterStore: MASTER,
}))(AccountStatus);
