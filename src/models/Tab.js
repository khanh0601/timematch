import tabRequest from '../services/tabRequest';
import accountTeamRequest from '../services/accountTeamRequest';
import { message } from 'antd';
import { history, formatMessage } from 'umi';
import { ACTIVE_ACCOUNT, INACTIVE_ACCOUNT } from '@/constant';
import { handleError, notify } from './../commons/function';

export default {
  namespace: 'TAB',
  state: {
    tabLoading: false,
    listPaginateTeam: null,
    listPaginateEvents: [],
    paginateEvents: null,
    allEvents: null,
    adjustingEvents: null,
    adjustedEvents: null,
  },
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
    setAllEvents(state, action) {
      return {
        ...state,
        allEvents: action.payload,
      };
    },
    setAdjustingEvents(state, action) {
      return {
        ...state,
        adjustingEvents: action.payload,
      };
    },
    setAdjustedEvents(state, action) {
      return {
        ...state,
        adjustedEvents: action.payload,
      };
    },
  },
  effects: {
    *getOnePaginateEvents(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield tabRequest.getPaginateEvents(
          action.payload,
        );
        if (statusCode === 200)
          yield put({
            type: 'setOnePaginateEvents',
            payload: { ...body.result.result, team_id: action.payload.team_id },
          });
      } catch (error) {
        handleError(error, error.response.body.message);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *getOnePaginateEventsMember(action, { put }) {
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
    *getOnePaginateAllEventsMember(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield accountTeamRequest.getUserEvents({
          ...action.payload,
          relationship_type: 3,
        });
        if (statusCode === 200)
          yield put({
            type: 'setAllEvents',
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

    *getOnePaginateAdjustingEventsMember(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield accountTeamRequest.getUserEvents({
          ...action.payload,
          relationship_type: 3,
        });
        if (statusCode === 200)
          yield put({
            type: 'setAdjustingEvents',
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
    *getOnePaginateAdjustedEventsMember(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield accountTeamRequest.getUserEvents({
          ...action.payload,
          relationship_type: 3,
        });
        if (statusCode === 200)
          yield put({
            type: 'setAdjustedEvents',
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
    *postTeamEvents(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { statusCode, body } = yield tabRequest.postTeamEvents(
          action.payload,
        );
        if (statusCode === 200) history.push({ pathname: '/' });
      } catch (error) {
        const { body } = error.response;
        const errorMsg = body.message;
        notify(errorMsg);
      }
      yield put({ type: 'setLoading', payload: false });
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
          const res = yield tabRequest.getPaginateEvents({
            team_id: body.result.result.data[i].id,
            page: 1,
            relationship_type: 3,
          });
          if (res.statusCode === 200)
            listTemEvent.push({
              ...res.body.result.result,
              team_id: Number(body.result.result.data[i].id),
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
              relationship_type: 3,
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
    *getListPagePaginateEvents(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const listTemEvent = [];
        for (let i = 0; i < action.payload.length; i++) {
          const res = yield tabRequest.getPaginateEvents({
            team_id: action.payload[i].team_id,
            page: action.payload[i].pageIndexEvent,
            relationship_type: 3,
          });
          if (res.statusCode === 200)
            listTemEvent.push({
              ...res.body.result.result,
              team_id: Number(action.payload[i].team_id),
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
    *getListPagePaginateEventsMember(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const listTemEvent = [];
        for (let i = 0; i < action.payload.length; i++) {
          const temPayload = {
            user_id_of_member: action.payload[i].user_id_of_member,
            page: action.payload[i].pageIndexEvent,
            page_size: 2,
            relationship_type: 3,
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
        const res = yield tabRequest.getPaginateEvents({
          team_id: action.payload.team_id,
          page: action.payload.pageIndexEvent,
          relationship_type: 3,
        });
        if (res.statusCode === 200)
          yield put({
            type: 'setOnePaginateEvents',
            payload: {
              ...res.body.result.result,
              team_id: Number(action.payload.team_id),
            },
          });
      } catch (error) {
        handleError(error, error.response.body.message);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *getPagePaginateEventsMember(action, { put }) {
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
        const res = yield tabRequest.deletePaginateTeam({
          team_id: action.payload.team_id,
        });

        if (res.body.result.result) {
          message.success('チームを削除しました');
        } else {
          notify('チームの削除は失敗しました．管理者へご連絡ください');
        }
      } catch (error) {
        notify('チームの削除は失敗しました．管理者へご連絡ください');
      }
      yield put({ type: 'setLoading', payload: false });
    },
  },
};
