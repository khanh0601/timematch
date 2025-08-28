import accountTeamRequest from '../services/accountTeamRequest';
import tabRequest from '../services/tabRequest';
import { message } from 'antd';
import { deepCopyData, handleError, notify } from './../commons/function';

const initState = {
  tabLoading: false,
  listPaginateTeam: null,
  listPaginateTeamFull: null,
  listPaginateEvents: [],
  paginateEvents: null,
};

export default {
  namespace: 'ACCOUNT_TEAM',
  state: deepCopyData(initState),
  reducers: {
    setLoading(state, action) {
      return {
        ...state,
        tabLoading: action.payload,
      };
    },
    setListPaginateTeam(state, action) {
      return {
        ...state,
        listPaginateTeam: action.payload,
      };
    },
    setListPaginateEventsFull(state, action) {
      return {
        ...state,
        listPaginateTeamFull: action.payload,
      };
    },
    setFilterItemPaginateEventsFull(state, action) {
      const { listPaginateTeamFull } = state;
      const { id } = action;
      return {
        ...state,
        listPaginateTeamFull: {
          ...listPaginateTeamFull,
          data: listPaginateTeamFull.data.filter(item => item.id !== id),
        },
      };
    },
    setListPaginateEvents(state, action) {
      return {
        ...state,
        listPaginateEvents: action.payload,
      };
    },
    setOnePaginateEvents(state, action) {
      return {
        ...state,
        paginateEvents: action.payload,
      };
    },
    resetAccountTeam(state, action) {
      return deepCopyData(initState);
    },
  },
  effects: {
    *getOnePaginateEvents(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield accountTeamRequest.getUserEvents(
          action.payload,
        );
        if (statusCode === 200)
          yield put({
            type: 'setOnePaginateEvents',
            payload: {
              ...body.data,
              member_id: action.payload.user_id_of_member,
            },
          });
      } catch (error) {
        handleError(error, error.response.body.message);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *getPaginateMember(action, { put, all, call }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield accountTeamRequest.getAccountTeam(
          action.payload,
        );
        if (statusCode === 200)
          yield put({
            type: 'setListPaginateTeam',
            payload: body.result.result,
          });
        const listTemEvent = [];
        const resArr = yield all(
          body.result.result.data.map(member =>
            call(accountTeamRequest.getUserEvents, {
              user_id_of_member: member.id,
              page: 1,
              page_size: 2,
              relationship_type: 1,
            }),
          ),
        );

        resArr.forEach((res, index) => {
          if (res.statusCode === 200) {
            listTemEvent.push({
              ...res.body.data,
              member_id: Number(body.result.result.data[index].id),
            });
          }
        });

        yield put({
          type: 'setListPaginateEvents',
          payload: listTemEvent,
        });
      } catch (error) {
        handleError(error, error.response.body.message);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *getPaginateTeam(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield tabRequest.getPaginateTeam(
          action.payload,
        );
        if (statusCode === 200)
          yield put({
            type: 'setListPaginateTeam',
            payload: body.result.result,
          });
        const listTemEvent = [];
        for (let i = 0; i < body.result.result.data.length; i++) {
          const res = yield accountTeamRequest.getUserEvents({
            // user_id_of_member: member.id,
            page: 1,
            page_size: 2,
            relationship_type: 1,
            team_id: body.result.result.data[i].id,
          });
          if (res.statusCode === 200)
            listTemEvent.push({
              ...res.body.data,
              id: Number(body.result.result.data[i].id),
            });
        }
        yield put({
          type: 'setListPaginateEvents',
          payload: listTemEvent,
        });
      } catch (error) {
        handleError(error, error.response.body.message);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *getPaginateTeamFull(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield accountTeamRequest.getAccountTeam(
          action.payload,
        );
        if (statusCode === 200)
          yield put({
            type: 'setListPaginateEventsFull',
            payload: body.result.result,
          });
      } catch (error) {
        handleError(error, error.response.body.message);
      }
      yield put({ type: 'setLoading', payload: false });
    },
    *getListPagePaginateEvents(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const listTemEvent = [];
        for (let i = 0; i < action.payload.length; i++) {
          const temPayload = action.payload[i].team_id
            ? {
                page: action.payload[i].pageIndexEvent,
                page_size: 2,
                relationship_type: 1,
                team_id: action.payload[i].team_id,
              }
            : {
                user_id_of_member: action.payload[i].user_id_of_member,
                page: action.payload[i].pageIndexEvent,
                page_size: 2,
                relationship_type: 1,
              };
          const res = yield accountTeamRequest.getUserEvents(temPayload);
          if (res.statusCode === 200)
            listTemEvent.push({
              ...res.body.data,
              team_id: Number(action.payload[i].team_id) || null,
            });
        }
        yield put({
          type: 'setListPaginateEvents',
          payload: listTemEvent,
        });
      } catch (error) {
        handleError(error, error.response.body.message);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *getPagePaginateEvents(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield accountTeamRequest.getUserEvents(action.payload);
        if (res.statusCode === 200)
          yield put({
            type: 'setOnePaginateEvents',
            payload: {
              ...res.body.data,
              member_id: Number(action.payload.user_id_of_member),
            },
          });
      } catch (error) {
        handleError(error, error.response.body.message);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *deletePaginateTeam(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield accountTeamRequest.deletePaginateTeam({
          team_id: action.payload.team_id,
        });

        if (res.body.result.result) {
          message.success('チームを削除しました');
        } else {
          notify('チームの削除は失敗しました．管理者へご連絡ください');
        }
      } catch (error) {
        notify('チームの削除は失敗しました．管理者へご連絡ください');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },
};
