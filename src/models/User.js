import UserRequest from '../services/userRequest.js';
import userConnectionsRequest from '../services/userConnectionsRequest';
import { message } from 'antd';
import { history, formatMessage } from 'umi';
import { notify, setCookie } from '@/commons/function.js';
import { ROLE_ADMIN } from '@/constant';
import config from '@/config';
import { handlePrepareAnswer } from '../commons/function.js';

export default {
  namespace: 'USER',
  state: {
    accessToken: null,
    verifySuccess: '',
  },
  reducers: {
    emailLoginSuccess(state, action) {
      return {
        ...state,
        accessToken: action.payload,
      };
    },
    setVerifySuccess(state, action) {
      return {
        ...state,
        verifySuccess: action.payload,
      };
    },
  },
  effects: {
    *registerEmail(action, { put }) {
      try {
        const { payload, formatMessage } = action.payload;
        const { body } = yield UserRequest.registerEmail(payload);
        const { status } = body;
        if (status) {
          history.push('/smooth-login?login=true');
          message.success(formatMessage({ id: 'i18n_register_email_success' }));
        }
      } catch (error) {
        if (error.response.status === 400) {
          notify(formatMessage({ id: 'i18n_account_already_existed' }));
        }
      }
    },
    *verifyRegister(action, { put }) {
      const res = yield UserRequest.verifyRegister(action.payload);
      if (res.status === 200) {
        message.success(formatMessage({ id: 'i18n_register_success' }));
        history.push('/smooth-login?login=true');
      }
    },
    *emailLogin(action, { put }) {
      const autoLogin = action.payload.autoLogin;
      delete action.payload.autoLogin;
      const tokenExpire = autoLogin ? 7 : 0;
      try {
        const { body, status } = yield UserRequest.emailLogin(action.payload);
        const { data } = body;
        if (status === 201) {
          setCookie('token', data.token, tokenExpire);
          if (data.role === ROLE_ADMIN) {
            setCookie('role', 'admin');
            history.push('/admin/accounts');
          } else {
            yield put({
              type: 'emailLoginSuccess',
              payload: data.token,
            });

            // if (data.is_first_set_up) {
            //   history.push('/setting-url');
            // } else {
            history.push('/');
            if (localStorage.getItem('checkLogin')) {
              const {
                status,
              } = yield userConnectionsRequest.verifiedLinkAccount(
                JSON.parse(localStorage.getItem('checkLogin')),
              );
              if (status === 200) {
                localStorage.removeItem('checkLogin');
                history.push('/account-status');
              }
            }
            // }
          }
          return;
        }
      } catch (error) {
        if (error.response.body.message === 'Email does not exist') {
          notify(formatMessage({ id: 'i18n_email_not_registered' }));
          return;
        }
        if (error.response.body.message === 'The given data was invalid.') {
          localStorage.removeItem('checkLogin');
          notify(error.response.body.message);
          return;
        }
        notify(formatMessage({ id: 'i18n_forgot_password_error' }));
      }
    },
    *sendMailResetPassword(action, { put }) {
      try {
        const res = yield UserRequest.sendMailResetPassword(
          action.payload.data,
        );
        if (res.status === 201) {
          action.payload.removeLoading();
          action.payload.showNotice();
        }
      } catch (error) {
        action.payload.removeLoading();
      }
    },
    *resetPassword(action, { put }) {
      try {
        const { isAdmin, ...reqBody } = action.payload;
        const res = yield UserRequest.resetPassword(reqBody);
        message.success(formatMessage({ id: 'i18n_change_password_success' }));
        if (isAdmin) {
          window.location.assign(`${config.ADMIN_DOMAIN}/admin/login`);
        } else {
          history.push('/smooth-login?login=true');
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
    },
    *getLinkConnectGGCalendar(action, { put }) {
      try {
        const newPayload = {
          ...action.payload,
          setUrlGGCalendar: setUrlGGCalendar,
        };
        const res = yield UserRequest.getLinkConnectGGCalendar(newPayload);
        const { setUrlGGCalendar } = action.payload;
        if (res.body.status) {
          setUrlGGCalendar(res.body.data.url);
        }
        return res.body.data;
      } catch (error) {
        return error;
      }
    },
    *getLinkConnectMicrosoft365(action, { put }) {
      try {
        const newPayload = {
          ...action.payload,
          setUrlOffice: setUrlOffice,
        };
        const res = yield UserRequest.getLinkConnectMicrosoft365(newPayload);
        const { setUrlOffice } = action.payload;
        if (res.body.status) {
          setUrlOffice(res.body.data.url);
        }
        return res.body.data;
      } catch (error) {
        return error;
      }
    },
    *syncGoogleCalendar(action, { put }) {
      try {
        const res = yield UserRequest.syncGoogleCalendar(action.payload);
        if (res.status === 200) {
          window.open(res.body.data.url);
        }
      } catch (error) {}
    },
    *syncMicrosoft365(action, { put }) {
      try {
        const res = yield UserRequest.syncMicrosoft365(action.payload);
        if (res.status === 200) {
          window.open(res.body.data.url);
        }
      } catch (error) {}
    },

    *updateTimeDefault(action) {
      const {
        formatMessage,
        setLoading,
        reqBody,
        updateTimesDefault,
      } = action.payload;
      setLoading(true);
      try {
        const { status } = yield UserRequest.updateTimeDefault(reqBody);
        if (status === 200) {
          message.success(
            formatMessage({ id: 'i18n_update_default_time_success' }),
          );
          updateTimesDefault();
        }
      } catch (error) {
        notify(formatMessage({ id: 'i18n_update_default_time_error' }));
      }
      setLoading(false);
    },

    *registerEmailApp(action, { put }) {
      try {
        const { body } = yield UserRequest.registerEmailApp(action.payload);
        const { status } = body;
        if (status) {
          history.push('/login');
          message.success(formatMessage({ id: 'i18n_register_email_success' }));
        }
      } catch (error) {
        if (error.response.status === 400) {
          notify(formatMessage({ id: 'i18n_account_already_existed' }));
        }
      }
    },
    *verifyRegisterApp(action, { put }) {
      try {
        const { body, status } = yield UserRequest.verifyRegisterApp(
          action.payload,
        );
        if (status === 200) {
          yield put({
            type: 'setVerifySuccess',
            payload: body.data,
          });
        }
      } catch (error) {
        if (error.response.status === 400) {
          notify(formatMessage({ id: 'i18n_token_invalid_or_expired' }));
          history.push('/register');
        }
      }
    },
    *registerPassword(action, { put }) {
      try {
        const { body, status } = yield UserRequest.registerPassword(
          action.payload,
        );
        if (status === 200) {
          message.success(formatMessage({ id: 'i18n_register_success' }));
          history.push('/login');
        }
      } catch (error) {
        notify(formatMessage({ id: 'i18n_register_error' }));
      }
    },
  },
};
