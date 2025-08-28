import userConnectionsRequest from '../services/userConnectionsRequest';
import { message } from 'antd';
import { history } from 'umi';
import {
  ACTIVE_ACCOUNT,
  INACTIVE_ACCOUNT,
  ROLE_MANAGER,
  ROLE_MEMBER,
  CONTRACT_BY_MONTH,
  CONTRACT_BY_YEAR,
} from '@/constant';
import { notify } from '@/commons/function';

export default {
  namespace: 'USERCONNECTIONS',
  state: {
    loading: false,
    accountOverview: {},
    listConnection: [],
    slotsAvailable: [],
    activeAccounts: [],
    checkingAccounts: [],
  },
  reducers: {
    getAccountOverviewSuccess(state, action) {
      const data = { ...action.payload };
      const { userContracts } = data;
      for (const item of userContracts) {
        if (item.m_contract_id === CONTRACT_BY_MONTH) {
          data.countMonthContracts = item.count;
        }
        if (item.m_contract_id === CONTRACT_BY_YEAR) {
          data.countYearContracts = item.count;
        }
      }
      return {
        ...state,
        accountOverview: data,
        loading: false,
      };
    },
    setLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    getUserConnectionsByOwnerIdSuccess(state, action) {
      const listConnection = [];
      const slotsAvailable = [];
      const checkingAccounts = [];
      const activeAccounts = [];
      action.payload.forEach(item => {
        if (item) {
          listConnection.push(item);
          if (item.status === ACTIVE_ACCOUNT) {
            activeAccounts.push(item);
          } else {
            checkingAccounts.push(item);
          }
        }
        if (!item || item.status === INACTIVE_ACCOUNT) {
          slotsAvailable.push(item);
        }
      });
      return {
        ...state,
        listConnection,
        activeAccounts,
        checkingAccounts,
        slotsAvailable,
      };
    },

    updateUserConnectionSuccess(state, action) {
      const { id, reqBody } = action.payload;

      const {
        listConnection,
        accountOverview,
        checkingAccounts,
        activeAccounts,
      } = state;
      let {
        countUserContractMonthUseds,
        countUserContractYearlyUseds,
      } = accountOverview;
      const updatedList = [...listConnection];
      const updatedCheckingAccount = [...checkingAccounts];
      const updatedActiveAccount = [...activeAccounts];
      const index = updatedList.findIndex(item => item.id === id);
      const indexChecking = updatedCheckingAccount.findIndex(
        item => item.id === id,
      );
      const indexActive = updatedActiveAccount.findIndex(
        item => item.id === id,
      );

      const contractType = reqBody.contract_type;
      const roleType = reqBody.role_type;

      if (roleType === ROLE_MEMBER || roleType === ROLE_MANAGER) {
        updatedList[index].role_type = roleType;
        if (indexChecking !== -1)
          updatedCheckingAccount[indexChecking].role_type = roleType;
        if (indexActive !== -1)
          updatedActiveAccount[indexActive].role_type = roleType;
      } else {
        if (contractType === CONTRACT_BY_YEAR) {
          countUserContractMonthUseds -= 1;
          countUserContractYearlyUseds += 1;
        } else {
          countUserContractYearlyUseds -= 1;
          countUserContractMonthUseds += 1;
        }
        updatedList[index].contract_type = contractType;
        if (indexChecking !== -1)
          updatedCheckingAccount[indexChecking].contract_type = contractType;
        if (indexActive !== -1)
          updatedActiveAccount[indexActive].contract_type = contractType;
      }

      return {
        ...state,
        listConnection: updatedList,
        checkingAccounts: updatedCheckingAccount,
        activeAccounts: updatedActiveAccount,
        accountOverview: {
          ...state.accountOverview,
          countUserContractMonthUseds,
          countUserContractYearlyUseds,
        },
      };
    },
    deleteUserConnectionSuccess(state, { payload }) {
      let updatedList = [...state.listConnection];
      const updatedOverview = { ...state.accountOverview };
      let updatedCheckingAccounts = [...state.checkingAccounts];
      let updatedActiveAccounts = [...state.activeAccounts];
      const { id, statusAccount } = payload;
      const index = updatedList.findIndex(item => item.id === id);
      updatedCheckingAccounts = updatedCheckingAccounts.filter(
        item => item.id !== id,
      );
      updatedActiveAccounts = updatedActiveAccounts.filter(
        item => item.id !== id,
      );
      if (statusAccount === ACTIVE_ACCOUNT) {
        if (updatedOverview?.countUserContractUseds) {
          updatedOverview.countUserContractUseds -= 1;
        }
        if (
          updatedList[index].contract_type === CONTRACT_BY_MONTH &&
          updatedOverview?.countUserContractMonthUseds
        ) {
          updatedOverview.countUserContractMonthUseds -= 1;
        }
        if (
          updatedList[index].contract_type === CONTRACT_BY_YEAR &&
          updatedOverview?.countUserContractYearlyUseds
        ) {
          updatedOverview.countUserContractYearlyUseds -= 1;
        }
      }

      updatedList.splice(index, 1);
      return {
        ...state,
        listConnection: updatedList,
        accountOverview: updatedOverview,
        checkingAccounts: updatedCheckingAccounts,
        activeAccounts: updatedActiveAccounts,
      };
    },
  },
  effects: {
    *getUserConnectionPlans(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      const { body } = yield userConnectionsRequest.getUserConnectionPlans(
        action.payload,
      );
      if (body && body.status) {
        yield put({ type: 'getAccountOverviewSuccess', payload: body.data });
      }
    },
    *verifiedLinkAccount(action, { put, delay }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        localStorage.setItem('checkLogin', JSON.stringify(action.payload));
        const { status } = yield userConnectionsRequest.verifiedLinkAccount(
          action.payload,
        );
        if (status === 200) {
          localStorage.removeItem('checkLogin');
          history.push('/account-status');
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
        history.push('/');
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getUserConnectionsByOwnerId(action, { put }) {
      try {
        const {
          body,
        } = yield userConnectionsRequest.getUserConnectionsByOwnerId(
          action.payload,
        );
        if (body) {
          yield put({
            type: 'getUserConnectionsByOwnerIdSuccess',
            payload: body,
          });
        }
      } catch (error) {}
    },
    *updateUserConnection(action, { put }) {
      const { id, reqBody, showMessage, formatMessage, name } = action.payload;
      try {
        const { status } = yield userConnectionsRequest.updateUserConnection(
          id,
          reqBody,
        );
        if (status) {
          yield put({
            type: 'updateUserConnectionSuccess',
            payload: action.payload,
          });
          showMessage.success(
            formatMessage({ id: 'i18n_update_account_success' }),
          );
        }
      } catch (error) {
        if (name === 'contract_type') {
          history.push('/payment?addPlan=creditCard');
          notify(formatMessage({ id: 'i18n_not_enough_slots' }));
        } else if (name === 'role_type') {
          notify(error.response.body.message);
        }
      }
    },
    *deleteUserConnection(action, { put }) {
      const {
        id,
        message,
        formatMessage,
        statusAccount,
        member_id,
      } = action.payload;
      try {
        const res = yield userConnectionsRequest.deleteUserConnection(id);
        if (res && res.body && res.body.status) {
          message.success(formatMessage({ id: 'i18n_delete_account_success' }));
          yield put({
            type: 'deleteUserConnectionSuccess',
            payload: { id, statusAccount },
          });
          yield put({
            type: 'ACCOUNT_TEAM/setFilterItemPaginateEventsFull',
            id: member_id,
          });
        } else {
          notify(formatMessage({ id: 'i18n_cannot_delete_owner' }));
        }
      } catch (error) {
        notify(error.response.body.message);
      }
    },
  },
};
