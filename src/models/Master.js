import UserRequest from '../services/userRequest.js';
import userConnectionsRequest from '../services/userConnectionsRequest';
import { message } from 'antd';
import { notify, setCookie } from '@/commons/function.js';
import { history, formatMessage } from 'umi';
import { deleteLocalInfo, handleError } from '../commons/function';
import { ACCOUNT_TYPE_BUSINESS } from '@/constant';

export default {
  namespace: 'MASTER',
  state: {
    linkUrl: [],
    accessToken: null,
    profile: {},
    timeDefault: [],
    loginLoading: false,
    errorRegister: false,
    isScrollToProfilePage: false,
    isScrollToScheduleSetting: false,
    defaultActiveKey: '1',
    historyInvitation: [],
  },
  reducers: {
    googleLoginSuccess(state, action) {
      return {
        ...state,
        accessToken: action.payload,
      };
    },
    getProfileSuccess(state, action) {
      return {
        ...state,
        linkUrl: action.payload,
        profile: action.payload,
      };
    },
    updateLinkUrlSuccess(state, action) {
      return {
        ...state,
        linkUrl: action.payload,
      };
    },
    microsoftLoginSuccess(state, action) {
      return {
        ...state,
        accessToken: action.payload,
      };
    },
    updateProfileSuccess(state, action) {
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };
    },
    setLoginLoading(state, action) {
      return {
        ...state,
        loginLoading: action.payload,
      };
    },
    setErrorRegister(state, action) {
      return {
        ...state,
        errorRegister: action.payload,
      };
    },
    setIsScrollToScheduleSetting(state, action) {
      return {
        ...state,
        isScrollToScheduleSetting: action.payload,
      };
    },
    setDefaultActiveKey(state, action) {
      return {
        ...state,
        defaultActiveKey: action.payload,
      };
    },
    setHistoryInvitation(state, action) {
      return {
        ...state,
        historyInvitation: action.payload,
      };
    },
  },
  effects: {
    *googleLogin(action, { call, put }) {
      try {
        yield put({ type: 'setLoginLoading', payload: true });
        const res = yield UserRequest.googleLogin(action.payload);
        console.log(res);
        if (res.status === 201) {
          const {
            token,
            account_type,
            is_expired,
            is_first_set_up,
          } = res.body.data;
          setCookie('token', token, 7);
          setCookie('is_expired', is_expired);
          setCookie('accountType', account_type);
          if (account_type == ACCOUNT_TYPE_BUSINESS && is_expired) {
            history.push('/expired-free');
          } else {
            yield put({
              type: 'googleLoginSuccess',
              payload: token,
            });

            // if (is_first_set_up) {
            //   history.push('/setting-url');
            // } else {
            yield put({ type: 'getProfile' });
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

          yield put({ type: 'setLoginLoading', payload: false });
          return;
        }
        yield put({ type: 'setLoginLoading', payload: false });
      } catch (error) {
        yield put({ type: 'setLoginLoading', payload: false });
        if (error.response.body.message === 'The given data was invalid.') {
          localStorage.removeItem('checkLogin');
          notify(error.response.body.message);
          return;
        }
        notify(formatMessage({ id: 'i18n_account_is_not_existed' }));
      }
    },

    *googleReLogin(action, { call, put }) {
      try {
        yield put({ type: 'setLoginLoading', payload: true });
        const res = yield UserRequest.googleLogin(action.payload.data);
        if (res.status === 201) {
          const { token, account_type, is_expired } = res.body.data;
          setCookie('token', token, 7);
          setCookie('is_expired', is_expired);
          setCookie('accountType', account_type);

          if (account_type == ACCOUNT_TYPE_BUSINESS && is_expired) {
            history.push('/expired-free');
          } else {
            yield put({
              type: 'googleLoginSuccess',
              payload: token,
            });
          }
          yield action.payload.setSyncCalendar;
          yield action.payload.closeModal;
          yield put({ type: 'setLoginLoading', payload: false });
          return;
        }
        yield put({ type: 'setLoginLoading', payload: false });
      } catch (error) {
        yield put({ type: 'setLoginLoading', payload: false });
        notify(formatMessage({ id: 'i18n_account_is_not_existed' }));
        yield deleteLocalInfo();
        history.push('/login');
      }
    },

    *googleSignUp(action, { call, put }) {
      try {
        yield put({ type: 'setLoginLoading', payload: true });
        const res = yield UserRequest.googleSignUp(action.payload);
        if (res.status === 201) {
          const {
            token,
            account_type,
            is_first_set_up,
            is_expired,
          } = res.body.data;
          setCookie('token', token, 7);
          setCookie('is_expired', is_expired);
          setCookie('accountType', account_type);

          if (account_type == ACCOUNT_TYPE_BUSINESS && is_expired) {
            history.push('/expired-free');
          } else {
            yield put({
              type: 'googleLoginSuccess',
              payload: token,
            });

            history.push('/');
            yield put({ type: 'getProfile' });
            // is_first_set_up
            //   ? history.push('/setting-url')
            //   : history.push('/event');
          }

          yield put({ type: 'setLoginLoading', payload: false });
          return;
        }
        yield put({ type: 'setLoginLoading', payload: false });
      } catch (error) {
        yield put({ type: 'setLoginLoading', payload: false });
        notify(formatMessage({ id: 'i18n_email_already_existed' }));
      }
    },

    *getProfile(action, { call, put }) {
      const res = yield UserRequest.getProfile(action.payload);
      if (res.status === 200) {
        const user = res.body.data;
        localStorage.setItem('profile', JSON.stringify(user));
        setCookie('accountType', user.account_type);
        yield put({
          type: 'getProfileSuccess',
          payload: user,
        });
      }

      return res.body.data;
    },
    *cancelPlan(action, { put }) {
      const {
        loadingFunc,
        showMessage,
        formatMessage,
        setDisableCancelPlan,
      } = action.payload;
      loadingFunc(true);
      try {
        const { body } = yield UserRequest.cancelPlan();

        showMessage.success(body.message);
        loadingFunc(false);
        setDisableCancelPlan(true);
      } catch (error) {
        const { body } = error.response;
        const { message } = body;
        notify(message);
      }
      loadingFunc(false);
    },
    *checkSlotStatus(action, { put }) {
      const { showMessage, setDisableCancelPlan } = action.payload;
      try {
        const { body } = yield UserRequest.checkSlotStatus();

        if (body.result.result.has_fee_slot_not_cancel === true) {
          setDisableCancelPlan(false);
        } else {
          setDisableCancelPlan(true);
        }
      } catch (error) {
        const { body } = error.response;
        const { message } = body;
        notify(message);
      }
    },
    *deleteProfile(action, { put }) {
      const { loadingFunc, showMessage, formatMessage } = action.payload;
      try {
        loadingFunc(true);
        const { body } = yield UserRequest.deleteProfile();
        if (body.status) {
          deleteLocalInfo();
          history.push('/home');
        }
      } catch (error) {
        console.log(error);
        if (
          error &&
          error.response &&
          error.response.body &&
          error.response.body.code == 3000
        ) {
          notify(formatMessage({ id: 'i18n_cannot_delete_owner' }));
        }
      } finally {
        loadingFunc(false);
      }
    },
    *updateLinkUrl(action, { call, put }) {
      try {
        const res = yield UserRequest.updateLinkUrl(action.payload);
        if (res.status == 200) {
          yield put({
            type: 'updateLinkUrlSuccess',
            payload: res.body,
          });
          history.push('/setting-time');
        }
      } catch (error) {
        notify('このURLは使用できません');
      }
    },
    *skipSettingUrl(action, { call, put }) {
      try {
        const res = yield UserRequest.updateLinkUrl(action.payload);
        if (res.status === 200) {
          history.push('/event');
        }
      } catch (error) {
        notify('このURLは使用できません');
      }
    },
    *updateTimeDefault(action, { call, post, put }) {
      try {
        const res = yield UserRequest.updateTimeDefault(action.payload);
        if (res.status === 200) {
          yield put({
            type: 'MASTER/getProfile',
            payload: {},
          });
          history.push('/event');
        }
      } catch (error) {
        notify('自由時間を選択してください');
      }
    },
    *microsoftLogin(action, { call, put }) {
      try {
        yield put({ type: 'setLoginLoading', payload: true });
        const res = yield UserRequest.microsoftLogin(action.payload);
        if (res.status === 201) {
          const {
            token,
            account_type,
            is_first_set_up,
            is_expired,
          } = res.body.data;
          setCookie('token', token, 7);
          setCookie('is_expired', is_expired);
          setCookie('accountType', account_type);

          if (account_type == ACCOUNT_TYPE_BUSINESS && is_expired) {
            history.push('/expired-free');
          } else {
            yield put({
              type: 'microsoftLoginSuccess',
              payload: token,
            });

            // if (is_first_set_up) {
            //   history.push('/setting-url');
            // } else {
            yield put({ type: 'getProfile' });
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
          yield put({ type: 'setLoginLoading', payload: false });
          return;
        }
        yield put({ type: 'setLoginLoading', payload: false });
      } catch (error) {
        if (error.response.body.message === 'The given data was invalid.') {
          localStorage.removeItem('checkLogin');
          notify(error.response.body.message);
          return;
        }
        try {
          yield action.payload.msal.logout();
        } catch {}
        yield put({ type: 'setLoginLoading', payload: false });
        localStorage.removeItem('loginMS');
        notify(formatMessage({ id: 'i18n_account_is_not_existed' }));
        // history.push('/register');
      }
    },

    *microsoftReLogin(action, { call, put }) {
      try {
        yield put({ type: 'setLoginLoading', payload: true });
        const res = yield UserRequest.microsoftLogin(action.payload.data);
        if (res.status === 201) {
          const { token, account_type, is_expired } = res.body.data;
          setCookie('token', token, 7);
          setCookie('is_expired', is_expired);
          setCookie('accountType', account_type);

          if (account_type == ACCOUNT_TYPE_BUSINESS && is_expired) {
            history.push('/expired-free');
          } else {
            yield put({
              type: 'microsoftLoginSuccess',
              payload: token,
            });
          }
          yield action.payload.setSyncCalendar;
          yield action.payload.closeModal;
          yield put({ type: 'setLoginLoading', payload: false });
          return;
        }
        yield put({ type: 'setLoginLoading', payload: false });
      } catch (error) {
        yield put({ type: 'setLoginLoading', payload: false });
        notify(formatMessage({ id: 'i18n_account_is_not_existed' }));
        yield deleteLocalInfo();
        history.push('/login');
      }
    },

    *microsoftSignUp(action, { call, put }) {
      try {
        yield put({ type: 'setLoginLoading', payload: true });
        const res = yield UserRequest.microsoftSignUp(action.payload);
        if (res.status === 201) {
          const {
            token,
            account_type,
            is_first_set_up,
            is_expired,
          } = res.body.data;
          setCookie('token', token, 7);
          setCookie('is_expired', is_expired);
          setCookie('accountType', account_type);

          if (account_type == ACCOUNT_TYPE_BUSINESS && is_expired) {
            history.push('/expired-free');
          } else {
            yield put({
              type: 'microsoftLoginSuccess',
              payload: token,
            });

            history.push('/');
            yield put({ type: 'getProfile' });
            // is_first_set_up
            //   ? history.push('/setting-url')
            //   : history.push('/event');
          }
          yield put({ type: 'setErrorRegister', payload: false });
          yield put({ type: 'setLoginLoading', payload: false });
          return;
        }
        yield put({ type: 'setLoginLoading', payload: false });
      } catch (error) {
        yield put({ type: 'setErrorRegister', payload: true });
        yield put({ type: 'setLoginLoading', payload: false });
        localStorage.removeItem('loginMS');
        notify(formatMessage({ id: 'i18n_email_already_existed' }));
      }
    },
    *zoomLogin(action, { call, post }) {
      try {
        const res = yield UserRequest.zoomLogin(action.payload);
        const profile = yield UserRequest.getProfile(action.payload);
        yield put({
          type: 'getProfileSuccess',
          payload: profile.body.data,
        });
        return res;
      } catch (error) {
        return error.response;
      }
    },
    *googleMeetLogin(action, { call, post }) {
      try {
        const res = yield UserRequest.googleMeetLogin(action.payload);
        const profile = yield UserRequest.getProfile(action.payload);
        yield put({
          type: 'getProfileSuccess',
          payload: profile.body.data,
        });
        return res;
      } catch (error) {
        return error.response;
      }
    },

    *checkFirstSetup(action, { call, put }) {
      const res = yield UserRequest.getProfile(action.payload);
      yield put({
        type: 'getProfileSuccess',
        payload: res.body.data,
      });
      if (!res.body.data.is_first_set_up) {
        history.push('/event');
        return res.body.data;
      }
      return res.body.data;
    },
    *updateProfileStore(action, { put }) {
      yield put({ type: 'updateProfileSuccess', payload: action.payload });
    },
    *updateProfile(action) {
      const {
        formData,
        message,
        formatMessage,
        setLoadingBtnSave,
        updateLocalStorage,
      } = action.payload;
      setLoadingBtnSave(true);
      try {
        const { body } = yield UserRequest.updateProfile(formData);
        const { status } = body;
        if (status) {
          message.success(formatMessage({ id: 'i18n_update_profile_success' }));
          updateLocalStorage();
        }
      } catch (error) {
        const { body } = error.response;
        const messageError = body.message;
        if (messageError === 'Code is exist') {
          notify(formatMessage({ id: 'i18n_url_not_available' }));
        } else {
          notify(messageError);
        }
      }
      setLoadingBtnSave(false);
    },
    *cancelAccountIntegrates(action) {
      const {
        showMessage,
        formatMessage,
        setDetailProfile,
        detailProfile,
        isMobile,
      } = action.payload;
      try {
        const { body } = yield UserRequest.cancelAccountIntegrates({
          account_type: action.payload.account_type,
        });
        const { status } = body;
        if (status) {
          const updatedProfile = {
            ...detailProfile,
            has_token: false,
          };
          setDetailProfile(updatedProfile);
          showMessage.success(
            formatMessage({ id: 'i18n_cancel_integrates_success' }),
          );
          if (!isMobile) {
            window.location.reload();
          }
          setTimeout(() => {
            window.location.href = '/profile/collaboration';
          }, 500);
        }
      } catch (error) {
        const { body } = error.response;
        const { message } = body;
        notify(message);
      }
    },
    *microsoftTeamLogin(action, { put }) {
      try {
        const res = yield UserRequest.microsoftTeamLogin(action.payload);
        const profile = yield UserRequest.getProfile(action.payload);
        yield put({
          type: 'getProfileSuccess',
          payload: profile.body.data,
        });
        return res;
      } catch (error) {
        return error.response;
      }
    },
    *microsoftConnect(action, { put }) {
      try {
        const res = yield UserRequest.microsoftConnect(action.payload);
        console.log(res);
        return 'MicrosoftTeamsと連携完了しました';
      } catch (error) {
        console.log(error);
        return 'MicrosoftTeamsと連携失敗しました';
      }
    },

    *shareMicrosoftCalendar(action, { put }) {
      try {
        yield UserRequest.shareMicrosoftCalendar(action.payload);
        return true;
      } catch (error) {
        handleError(error);
        return false;
      }
    },

    *shareGoogleCalendar(action, { put }) {
      try {
        yield UserRequest.shareGoogleCalendar(action.payload);
        return true;
      } catch (error) {
        handleError(error);
        return false;
      }
    },
    *getHistoryInvitation(action, { put }) {
      yield put({ type: 'setLoginLoading', payload: true });
      try {
        const { body } = yield UserRequest.getHistoryInvitation(action.payload);
        yield put({
          type: 'setHistoryInvitation',
          payload: body.data,
        });
      } catch (error) {
        handleError(error);
      } finally {
        yield put({ type: 'setLoginLoading', payload: false });
      }
    },
    *deleteHistoryInvitation(action, { put }) {
      try {
        yield UserRequest.deleteHistoryInvitation(action.payload);
        yield put({
          type: 'MASTER/getHistoryInvitation',
          payload: {
            pageSize: 20,
            page: 1,
          },
        });
        return true;
      } catch (error) {
        handleError(error);
        return false;
      }
    },
  },
};
