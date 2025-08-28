import AccountRequest from '../services/accountRequest.js';
import {
  CONTRACT_BY_MONTH,
  CONTRACT_BY_YEAR,
  ROLE_MANAGER,
  ROLE_MEMBER,
  ACTIVE_ACCOUNT,
  INACTIVE_ACCOUNT,
} from '@/constant';
import { history } from 'umi';
import { notify } from '@/commons/function';

export default {
  namespace: 'ACCOUNT',
  state: {
    accountOverview: {},
    listConnection: [],
    slotsAvailable: [],
    activeAccounts: [],
    checkingAccounts: [],
    checkTrial: '',
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
      };
    },
    getUserConnectionsSuccess(state, action) {
      const listConnection = [];
      const slotsAvailable = [];
      const checkingAccounts = [];
      const activeAccounts = [];
      for (const item of action.payload.data) {
        if (item.user_connection) {
          listConnection.push(item);
          if (item.user_connection.status === ACTIVE_ACCOUNT) {
            activeAccounts.push(item);
          } else {
            checkingAccounts.push(item);
          }
        }
        if (
          !item.user_connection ||
          item.user_connection.status === INACTIVE_ACCOUNT
        ) {
          slotsAvailable.push(item);
        }
      }
      return {
        ...state,
        listConnection,
        slotsAvailable,
        activeAccounts,
        checkingAccounts,
        checkTrial: action.payload.status,
      };
    },
    deleteUserConnectionSuccess(state, action) {
      let updatedList = [...state.listConnection];
      const updatedOverview = { ...state.accountOverview };
      let updatedCheckingAccounts = [...state.checkingAccounts];
      let updatedActiveAccounts = [...state.activeAccounts];
      const { id, statusAccount } = action.payload;
      const index = updatedList.findIndex(
        item => item.user_connection.id === id,
      );
      updatedCheckingAccounts = updatedCheckingAccounts.filter(
        item => item.user_connection.id !== id,
      );
      updatedActiveAccounts = updatedActiveAccounts.filter(
        item => item.user_connection.id !== id,
      );
      if (statusAccount === ACTIVE_ACCOUNT) {
        updatedOverview.countUserContractUseds -= 1;
        if (updatedList[index].m_contract_id === CONTRACT_BY_MONTH) {
          updatedOverview.countUserContractMonthUseds -= 1;
        }
        if (updatedList[index].m_contract_id === CONTRACT_BY_YEAR) {
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
      const index = updatedList.findIndex(
        item => item.user_connection.id === id,
      );
      const indexChecking = updatedCheckingAccount.findIndex(
        item => item.user_connection.id === id,
      );
      const indexActive = updatedActiveAccount.findIndex(
        item => item.user_connection.id === id,
      );

      const contractType = reqBody.contract_type;
      const roleType = reqBody.role_type;

      if (roleType === ROLE_MEMBER || roleType === ROLE_MANAGER) {
        updatedList[index].user_connection.role_type = roleType;
        if (indexChecking !== -1)
          updatedCheckingAccount[
            indexChecking
          ].user_connection.role_type = roleType;
        if (indexActive !== -1)
          updatedActiveAccount[
            indexActive
          ].user_connection.role_type = roleType;
      } else {
        if (contractType === CONTRACT_BY_YEAR) {
          countUserContractYearlyUseds += 1;
          countUserContractMonthUseds -= 1;
        } else {
          countUserContractYearlyUseds -= 1;
          countUserContractMonthUseds += 1;
        }
        updatedList[index].m_contract_id = contractType;
        if (indexChecking !== -1)
          updatedCheckingAccount[indexChecking].m_contract_id = contractType;
        if (indexActive !== -1)
          updatedActiveAccount[indexActive].m_contract_id = contractType;
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
  },
  effects: {
    *getUserConnectionPlans(action, { put }) {
      const { body } = yield AccountRequest.getUserConnectionPlans(
        action.payload,
      );
      if (body && body.status) {
        yield put({ type: 'getAccountOverviewSuccess', payload: body.data });
      }
    },
    *createConnections(action, { put }) {
      const {
        connections,
        loadingFunc,
        createSuccessFunc,
        setErrorMessage,
        setListAccount,
        listAccount,
        formatMessage,
      } = action.payload;
      loadingFunc(true);
      try {
        const { body } = yield AccountRequest.createConnections({
          connections,
        });
        const { status, data } = body;
        if (status) {
          createSuccessFunc(status);
        } else {
          const dataError = {};
          const emailErrors = {};
          const updatedList = [...listAccount];

          for (const item of data) {
            const uId = item.user_contract_id;
            if (emailErrors[item.error_code]) {
              emailErrors[item.error_code] += ', ' + item.member_email;
            } else {
              emailErrors[item.error_code] = item.member_email;
            }
            dataError[uId] = item.error_code;
          }

          for (const item of updatedList) {
            const uId = item.userContractId;
            if (dataError[uId]) {
              item.isValid = false;
            }
          }

          for (const key in emailErrors) {
            emailErrors[key] = formatMessage(
              {
                id: `i18n_email_error_${key}`,
              },
              { listEmail: emailErrors[key] },
            );
          }
          setListAccount(updatedList);
          setErrorMessage(emailErrors);
        }
      } catch (error) {}
      loadingFunc(false);
    },
    *getUserConnections(action, { put }) {
      try {
        const { body } = yield AccountRequest.getUserConnections(
          action.payload,
        );
        if (body.status) {
          yield put({
            type: 'getUserConnectionsSuccess',
            payload: body,
          });
        }
      } catch (error) {}
    },
    *deleteUserConnection(action, { put }) {
      const { id, message, formatMessage, statusAccount } = action.payload;
      try {
        const { status } = yield AccountRequest.deleteUserConnection(id);
        if (status) {
          message.success(formatMessage({ id: 'i18n_delete_account_success' }));
          yield put({
            type: 'deleteUserConnectionSuccess',
            payload: { id, statusAccount },
          });
        } else {
          notify(formatMessage({ id: 'i18n_cannot_delete_owner' }));
        }
      } catch (error) {
        notify(formatMessage({ id: 'i18n_cannot_delete_owner' }));
      }
    },
    *updateUserConnection(action, { put }) {
      const { id, reqBody, showMessage, formatMessage, name } = action.payload;
      try {
        const { status } = yield AccountRequest.updateUserConnection(
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
        if (name === 'm_contract_id') {
          history.push('/payment?addPlan=creditCard');
          notify(formatMessage({ id: 'i18n_not_enough_slots' }));
        } else if (name === 'role_type') {
          notify(formatMessage({ id: 'i18n_cannot_delete_owner' }));
        }
      }
    },
    *sendEmailInvitations(action, { put }) {
      const {
        invitees,
        showMessage,
        formatMessage,
        setLoadingSendMessage,
        checkValidBackEnd,
      } = action.payload;
      setLoadingSendMessage(true);
      try {
        const { body } = yield AccountRequest.sendEmailInvitations({
          type: 0,
          invitees,
        });
        const { status, data } = body;
        if (status) {
          showMessage.success(
            formatMessage({ id: 'i18n_send_email_invitation_success' }),
          );
        } else {
          let listEmailError = [];
          for (let i = 0; i < data.length; i++) {
            listEmailError.push({
              email: data[i].email,
              errorMessage: data[i].error_message,
            });
          }
          checkValidBackEnd(listEmailError);
        }
      } catch (error) {
        const { body, status } = error.response;
        const { message } = body;
        if (status === 422) {
          notify(formatMessage({ id: 'i18n_error_email_invite' }));
        } else {
          notify(message);
        }
      }
      setLoadingSendMessage(false);
    },
    *changePassword(action, { put }) {
      try {
        const { body } = yield AccountRequest.changePassword(action.payload);
        notify('Change password success!');
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
    },
  },
};
