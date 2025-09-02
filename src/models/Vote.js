import voteRequest from '../services/voteRequest';
import { message } from 'antd';
import { history, formatMessage } from 'umi';
import { getLocation, handleError, notify } from './../commons/function';

export default {
  namespace: 'VOTE',
  state: {
    voteLoading: false,
    sendEmailLoading: false,
    informationVote: null,
    eventDateTimeGuest: [],
    voteGuest: [],
    eventDateTimeUser: [],
    voteUser: [],
    event: null,
  },
  reducers: {
    setLoading(state, action) {
      return {
        ...state,
        voteLoading: action.payload,
      };
    },
    setSendEmailLoading(state, action) {
      return {
        ...state,
        sendEmailLoading: action.payload,
      };
    },
    setInformationVote(state, action) {
      return {
        ...state,
        informationVote: action.payload,
      };
    },
    setEventDateTimeGuest(state, action) {
      return {
        ...state,
        eventDateTimeGuest: action.payload,
      };
    },
    setEventDateTimeGuestDESC(state, action) {
      const temEventDateTimeGuest = state.eventDateTimeGuest.sort((a, b) =>
        a.choices_count > b.choices_count ? -1 : 1,
      );
      return {
        ...state,
        eventDateTimeGuest: [...temEventDateTimeGuest],
      };
    },
    setVoteGuest(state, action) {
      return {
        ...state,
        voteGuest: action.payload,
      };
    },
    setEventDateTimeUser(state, action) {
      const temEventDateTimeGuest = action.payload.sort((a, b) =>
        a.choices_count > b.choices_count ? -1 : 1,
      );

      return {
        ...state,
        eventDateTimeUser: [...temEventDateTimeGuest],
      };
    },
    setEventDateTimeUserDESC(state, action) {
      const temEventDateTimeGuest = state.eventDateTimeUser.sort((a, b) =>
        a.choices_count > b.choices_count ? -1 : 1,
      );
      return {
        ...state,
        eventDateTimeUser: [...temEventDateTimeGuest],
      };
    },
    setVoteUser(state, action) {
      return {
        ...state,
        voteUser: action.payload,
      };
    },
    setEvent(state, action) {
      return {
        ...state,
        event: action.payload,
      };
    },
    setInformationUserVote(state, action) {
      return {
        ...state,
        informationUserVote: action.payload,
      };
    },
  },
  effects: {
    *getVoteShow(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield voteRequest.getVoteShow(
          action.payload,
        );

        if (statusCode === 200)
          if (
            window.location.pathname === '/appointment-selection' &&
            body.result.result.vote.is_finished
          ) {
            history.push('/invalid-url');
            return;
          }

        yield put({
          type: 'setInformationVote',
          payload: body.result.result,
        });
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        history.push({ pathname: 'invalid-url' });
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *postVoteGuestConfirm(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield voteRequest.postVoteGuestConfirm(
          action.payload,
        );

        yield put({ type: 'setLoading', payload: false });
        return body;
      } catch (error) {
        handleError(error);
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getVoteGuestSummary(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield voteRequest.getVoteGuestSummary(
          action.payload,
        );
        if (statusCode === 200) {
          yield put({
            type: 'setEventDateTimeGuest',
            payload: body.result.event_datetimes,
          });
          yield put({ type: 'setVoteGuest', payload: body.result.voters });
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getVoteUserShow(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield voteRequest.getVoteUserShow(
          action.payload,
        );
        if (statusCode === 200) {
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *postVoteUserSendEmail(action, { put }) {
      yield put({ type: 'setSendEmailLoading', payload: true });
      try {
        const { statusCode, body } = yield voteRequest.postVoteUserSendEmail(
          action.payload,
        );
        if (statusCode === 200) {
          message.success(formatMessage({ id: 'i18n_success_email_invite' }));
        }
      } catch (error) {
        const { body, status } = error.response;
        const errorMsg = body.message;
        if (status === 422) {
          notify(formatMessage({ id: 'i18n_error_email_invite' }));
        } else {
          notify(errorMsg);
        }
      }
      yield put({ type: 'setSendEmailLoading', payload: false });
    },
    *getVoteUserSummary(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield voteRequest.getVoteUserSummary(
          action.payload,
        );
        if (statusCode === 200) {
          yield put({
            type: 'setEventDateTimeUser',
            payload: body.result.event_datetimes,
          });
          yield put({ type: 'setVoteUser', payload: body.result.voters });
          yield put({ type: 'setEvent', payload: body.result.event });
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *postUserVote(action, { put }) {
      yield put({ type: 'setSendEmailLoading', payload: true });

      const location = getLocation();

      try {
        const { statusCode, body } = yield voteRequest.postUserVote(
          action.payload,
        );
        if (statusCode === 200) {
          yield put({ type: 'setSendEmailLoading', payload: false });
          return 1;
        }
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      } finally {
        yield put({ type: 'setSendEmailLoading', payload: false });
      }
    },
    *getUserVoteShow(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield voteRequest.getUserVoteShow(
          action.payload,
        );

        if (statusCode === 200)
          if (
            window.location.pathname === '/appointment-selection' &&
            body.result.result.vote.is_finished
          ) {
            history.push('/invalid-url');
            return;
          }

        yield put({
          type: 'setInformationUserVote',
          payload: body.result.result,
        });
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        history.push({ pathname: 'invalid-url' });
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *postVoteUserConfirm(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield voteRequest.postVoteUserConfirm(
          action.payload,
        );

        yield put({ type: 'setLoading', payload: false });
        return body;
      } catch (error) {
        handleError(error);
      }
      yield put({ type: 'setLoading', payload: false });
    },
  },
};
