import teamRequest from '../services/teamRequest';
import { message } from 'antd';
import { history, formatMessage } from 'umi';
import { getLocation, handleError, notify } from './../commons/function';

export default {
  namespace: 'TEAM',
  state: {
    loading: false,
    availableSlots: 0,
    metadata: null,
    users: null,
    listUsers: null,
    listTeam: null,
    informationTeam: null,
  },
  reducers: {
    setLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    setAvailableSlots(state, action) {
      return {
        ...state,
        availableSlots: action.payload,
      };
    },
    setMetadata(state, action) {
      return {
        ...state,
        metadata: action.payload,
      };
    },
    setUsers(state, action) {
      const listUsers = action.payload.filter(item => item);
      return {
        ...state,
        users: [...listUsers],
      };
    },
    setListUsers(state, action) {
      const listUsers = action.payload.filter(item => item);
      return {
        ...state,
        listUsers: [...listUsers],
      };
    },
    setListTeam(state, action) {
      return {
        ...state,
        listTeam: action.payload,
      };
    },
    setInformationTeam(state, action) {
      return {
        ...state,
        informationTeam: action.payload,
      };
    },
  },
  effects: {
    *getCreateTeam(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield teamRequest.getCreateTeam();
        if (statusCode === 200) {
          yield put({
            type: 'setAvailableSlots',
            payload: body.result.available_slots,
          });
          yield put({ type: 'setMetadata', payload: body.result.metadata });
          yield put({ type: 'setUsers', payload: body.result.users });
          yield put({ type: 'setListUsers', payload: body.result.users });
        }
      } catch (error) {
        handleError(error);
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *postCreateTeam(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      let location = getLocation();
      try {
        const res = yield teamRequest.postCreateTeam(action.payload);

        if (res.body && res.body.result && res.body.result.result) {
          const tab = history.location.query.tab || 1;
          const team_id = res.body.result.result.id;
          location = `/event?tab=${tab}&team_id=${team_id}`;
        }
      } catch (error) {
        handleError(error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
        history.push(location);
      }
    },
    *getTeam(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield teamRequest.getTeam();
        if (statusCode === 200)
          yield put({ type: 'setListTeam', payload: body.result });
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getTeamEdit(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield teamRequest.getTeamEdit(
          action.payload,
        );
        if (statusCode === 200)
          yield put({ type: 'setInformationTeam', payload: body.result });
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *postTeamEdit(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      const location = getLocation();
      try {
        yield teamRequest.postTeamEdit(action.payload);
      } catch (error) {
        handleError(error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
        history.push(location);
      }
    },
  },
};
