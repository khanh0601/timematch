import AdminRequest from '../services/adminRequest.js';
import { message } from 'antd';
import {
  ROLE_MEMBER,
  ROLE_MANAGER,
  CONTRACT_BY_MONTH,
  CONTRACT_BY_YEAR,
  TYPE_CREDIT,
  TYPE_INVOICE,
  DIRECT_SALES,
  AGENCY_SALES,
  FORMAT_DATE_TEXT,
  FORMAT_DATE_STANDARD,
  FULLCALENDAR_EVENT_DATE,
  PAYMENT_TAX,
  SUSPENSE_ACCOUNT,
} from '@/constant';
import dayjs from 'dayjs';
import { notify, setCookie } from '@/commons/function.js';
import { history } from 'umi';

export default {
  namespace: 'ADMIN',
  state: {
    listUser: [],
    listAgency: [],
    csvDowload: [],
    totalRow: 0,
    totalRowUser: 0,
  },
  reducers: {
    getListUserSuccess(state, action) {
      const { resData } = action.payload;
      const { data, total } = resData;
      const updated = data.map((item, index) => ({ ...item, index }));
      return {
        ...state,
        listUser: updated,
        totalRowUser: total,
      };
    },

    getAllUsersSuccess(state, action) {
      const { resData, formatMessage } = action.payload;
      const { data, total } = resData;
      let csvDowload = data;
      csvDowload.map(csv => {
        csv.email = csv.email || csv.google_email || csv.microsoft_email;
        csv.type_payment =
          csv.type_payment === TYPE_INVOICE
            ? formatMessage({ id: 'i18n_invoice' })
            : csv.type_payment === TYPE_CREDIT
            ? formatMessage({ id: 'i18n_credit_card' })
            : '';
        csv.role_type =
          csv.role_type === ROLE_MEMBER
            ? formatMessage({ id: 'i18n_member' })
            : csv.role_type === ROLE_MANAGER
            ? formatMessage({ id: 'i18n_manager' })
            : '';
        csv.status =
          csv.contract_type === CONTRACT_BY_MONTH
            ? formatMessage({ id: 'i18n_by_month' })
            : csv.contract_type === CONTRACT_BY_YEAR
            ? formatMessage({ id: 'i18n_by_year' })
            : formatMessage({ id: 'i18n_free_registration' });
        csv.contract_type =
          csv.contract_type === CONTRACT_BY_MONTH
            ? formatMessage({ id: 'i18n_by_month' })
            : csv.contract_type === CONTRACT_BY_YEAR
            ? formatMessage({ id: 'i18n_by_year' })
            : '';
        csv.commercial_distribution =
          csv.commercial_distribution === DIRECT_SALES
            ? formatMessage({ id: 'i18n_direct_sales' })
            : csv.commercial_distribution === AGENCY_SALES
            ? formatMessage({ id: 'i18n_agency_sales' })
            : '';
        csv.price = csv.price
          ? csv.price / csv.quantity +
            (csv.price / csv.quantity) * PAYMENT_TAX +
            '円'
          : '';
        csv.trial_start_at =
          csv.trial_start_at &&
          dayjs(csv.trial_start_at).format(FORMAT_DATE_STANDARD);
        csv.trial_end_at =
          csv.trial_end_at &&
          dayjs(csv.trial_end_at).format(FORMAT_DATE_STANDARD);
        csv.member_period =
          csv.start_time && csv.end_time
            ? `${dayjs
                .unix(csv.start_time)
                .format(FORMAT_DATE_TEXT)} | ${dayjs
                .unix(csv.end_time)
                .format(FORMAT_DATE_TEXT)}`
            : '';
      });
      return {
        ...state,
        csvDowload,
      };
    },
    getListAgencySuccess(state, action) {
      const { total, data } = action.payload;
      return {
        ...state,
        listAgency: data,
        totalRow: total,
      };
    },

    deleteUserSuccess(state, action) {
      const newListUser = [...state.listUser];
      const index = newListUser.findIndex(item => item.id === action.payload);
      newListUser[index].deleted_at = dayjs().format(FULLCALENDAR_EVENT_DATE);
      return {
        ...state,
        listUser: newListUser,
      };
    },

    suspenseUserSuccess(state, action) {
      const newListUser = [...state.listUser];
      const index = newListUser.findIndex(item => item.id === action.payload);
      newListUser[index].status = SUSPENSE_ACCOUNT;
      return {
        ...state,
        listUser: newListUser,
      };
    },

    updateListUserSuccess(state, action) {
      const newListUser = [...state.listUser];
      const updatedList = action.payload.users;
      for (let i = 0; i < newListUser.length; i++) {
        for (let j = 0; j < updatedList.length; j++) {
          if (newListUser[i].id === updatedList[j].id) {
            newListUser[i] = {
              ...newListUser[i],
              ...updatedList[j],
            };
          }
        }
      }
      return {
        ...state,
        listUser: newListUser,
      };
    },

    updateAgencySuccess(state, action) {
      const { id, data } = action.payload;
      const agencies = [...state.listAgency];
      const index = agencies.findIndex(item => item.id === id);
      agencies[index] = { ...agencies[index], ...data };
      return {
        ...state,
        listAgency: agencies,
      };
    },
  },
  effects: {
    *getListUser(action, { put }) {
      const { setLoadingTable, reqBody, formatMessage } = action.payload;
      setLoadingTable(true);
      try {
        const { body, status } = yield AdminRequest.getListUser(reqBody);
        const { data } = body;
        if (status === 200) {
          yield put({
            type: 'getListUserSuccess',
            payload: { resData: data, formatMessage },
          });
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      setLoadingTable(false);
    },

    *getAllUsers(action, { put }) {
      const { reqBody, setCsvCheck, formatMessage } = action.payload;
      try {
        const { body, status } = yield AdminRequest.getListUser(reqBody);
        const { data } = body;
        if (status === 200) {
          yield put({
            type: 'getAllUsersSuccess',
            payload: { resData: data, formatMessage },
          });
          setCsvCheck(true);
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
    },

    *deleteUser(action, { put }) {
      const { id, formatMessage, setLoadingTable } = action.payload;
      setLoadingTable(true);
      try {
        const { status } = yield AdminRequest.deleteUser(id);
        if (status === 200) {
          message.success(formatMessage({ id: 'i18n_delete_user_success' }));
          yield put({ type: 'deleteUserSuccess', payload: id });
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      setLoadingTable(false);
    },

    *suspenseUser(action, { put }) {
      const { setLoadingTable, reqBody, formatMessage, id } = action.payload;
      setLoadingTable(true);
      try {
        const { status } = yield AdminRequest.updateAccountStatus(reqBody);
        if (status === 200) {
          message.success(formatMessage({ id: 'i18n_update_users_success' }));
          yield put({ type: 'suspenseUserSuccess', payload: id });
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      setLoadingTable(false);
    },

    *updateUsers(action, { put }) {
      const { setLoadingTable, reqBody, formatMessage } = action.payload;
      try {
        setLoadingTable(true);
        const { status, body } = yield AdminRequest.updateUsers(reqBody);
        if (status === 200) {
          message.success(formatMessage({ id: 'i18n_update_users_success' }));
          yield put({
            type: 'updateListUserSuccess',
            payload: { users: body.data },
          });
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      } finally {
        setLoadingTable(false);
      }
    },

    *activeUser(action, { put }) {
      const { setLoadingTable, reqBody, formatMessage } = action.payload;
      try {
        setLoadingTable(true);
        const { status, body } = yield AdminRequest.updateAccountStatus(
          reqBody,
        );
        if (status === 200) {
          message.success(formatMessage({ id: 'i18n_update_users_success' }));
          yield put({
            type: 'updateListUserSuccess',
            payload: { users: reqBody.users },
          });
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      } finally {
        setLoadingTable(false);
      }
    },

    *getListAgency(action, { put }) {
      const { setLoading, reqBody } = action.payload;
      setLoading(true);
      try {
        const { body, status } = yield AdminRequest.getAgencies(reqBody);
        const { data } = body;
        if (status === 200) {
          yield put({
            type: 'getListAgencySuccess',
            payload: data,
          });
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      setLoading(false);
    },

    *createAgency(action) {
      const {
        setLoading,
        reqBody,
        formatMessage,
        resetFields,
      } = action.payload;
      setLoading(true);
      try {
        const { status } = yield AdminRequest.createAgency(reqBody);
        if (status === 200) {
          message.success(formatMessage({ id: 'i18n_create_agency_success' }));
          resetFields();
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      setLoading(false);
    },

    *updateAgency(action, { put }) {
      const {
        id,
        setLoading,
        reqBody,
        formatMessage,
        resetFields,
        onClose,
      } = action.payload;
      setLoading(true);
      try {
        const { status, body } = yield AdminRequest.updateAgency(reqBody, id);
        if (status === 200) {
          message.success(formatMessage({ id: 'i18n_update_agency_success' }));
          yield put({
            type: 'updateAgencySuccess',
            payload: { data: body.data, id },
          });
          resetFields();
          onClose();
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      setLoading(false);
    },

    *createAccount(action) {
      const {
        reqBody,
        setLoading,
        formatMessage,
        resetFields,
      } = action.payload;
      setLoading(true);
      try {
        const { status } = yield AdminRequest.createAccount(reqBody);
        if (status === 200) {
          message.success(formatMessage({ id: 'i18n_create_account_success' }));
          resetFields();
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      setLoading(false);
    },

    *bulkCreateAccount(action) {
      const {
        formatMessage,
        formData,
        setLoading,
        onCreateSuccess,
      } = action.payload;
      setLoading(true);
      try {
        const { status } = yield AdminRequest.bulkCreateAccount(formData);
        if (status === 200) {
          message.success(
            formatMessage({ id: 'i18n_upload_file_csv_success' }),
          );
          onCreateSuccess();
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      setLoading(false);
    },

    *getInvoice(action) {
      const { handleDownloadInvoice, ...reqBody } = action.payload;
      let result = {};
      try {
        const { status, body } = yield AdminRequest.exportInvoice({
          ...reqBody,
        });
        if (status === 200) {
          handleDownloadInvoice(body.data, 'invoice.xlsx');
        }
      } catch (error) {}
      return result;
    },

    *adminLogin(action, { put }) {
      const {
        formatMessage,
        setLoading,
        remember,
        ...reqBody
      } = action.payload;
      setLoading(true);
      const autoLogin = remember ? 7 : 0;
      try {
        const { body, status } = yield AdminRequest.adminLogin(reqBody);
        const { data } = body;
        if (status === 201) {
          setCookie('token', data.token, autoLogin);
          history.push('/admin/accounts');
        }
      } catch (error) {
        if (
          error.response &&
          error.response.body.message === 'Email does not exist'
        ) {
          notify(formatMessage({ id: 'i18n_email_not_registered' }));
        } else {
          notify(formatMessage({ id: 'i18n_forgot_password_error' }));
        }
      }
      setLoading(false);
    },

    *changePassword(action, { put }) {
      const {
        setLoading,
        reqBody,
        message,
        formatMessage,
        onClose,
        resetFields,
      } = action.payload;
      setLoading(true);
      try {
        const { status, body } = yield AdminRequest.changePassword(reqBody);
        if (status === 200) {
          resetFields();
          onClose();
          message.success(
            formatMessage({ id: 'i18n_update_admin_password_success' }),
          );
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      setLoading(false);
    },

    *checkContractExists(action, { put }) {
      const { reqBody } = action.payload;
      try {
        const res = yield AdminRequest.checkContractExists(reqBody);
        if (res.status === 200) {
          return res.body.data;
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
    },

    *updateExpireForm(action, { put }) {
      const { reqBody } = action.payload;
      try {
        const res = yield AdminRequest.updateExpireForm(reqBody);
        if (res.status === 200) {
          yield put({
            type: 'updateListUserSuccess',
            payload: { users: res.body.data },
          });
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
    },
  },
};
