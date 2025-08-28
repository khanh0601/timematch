import { history } from 'umi';
import EventRequest from '@/services/eventRequest.js';

const initState = {};

export default {
  namespace: 'PREVIEW',
  state: initState,
  reducers: {},
  effects: {
    *loadingData({ payload }, { put, call }) {
      const {
        event_code,
        user_code,
        typeTemplate,
        profile,
        timeAsync,
      } = payload;
      yield put({ type: 'CALENDAR_CREATION/setLoading', payload: true });
      if (event_code) {
        const res = yield put.resolve({
          type: 'EVENT/checkEventCode',
          payload,
        });

        if (res.body.status) {
          const { id, team_id, user_id, relationship_type } = res.body.data;
          yield put({
            type: 'EVENT/getFreeTime',
            payload: { event_id: id },
          });

          const members = yield put.resolve({
            type: 'EVENT/getDetailEventType',
            payload: { eventTypeId: id },
          });

          yield put({
            type: 'AVAILABLE_TIME/getMemberList',
            payload: {
              teamId: team_id,
              profile: {},
              memberId: user_id,
              members,
              eventId: id,
              isClone: false,
              timeAsync,
            },
          });

          yield put({
            type: 'CALENDAR_CREATION/setRelationshipType',
            payload: relationship_type,
          });
        }

        yield put({ type: 'EVENT/getUserByCode', payload: { user_code } });
      } else if (typeTemplate) {
        const res = yield call(EventRequest.getEventTemplate);
        const { status, data } = res.body;
        if (status) {
          const template = data.find(t => t.type_template == typeTemplate);
          yield put({
            type: 'EVENT/getFreeTime',
            payload: {},
          });

          yield put({
            type: 'CALENDAR_CREATION/setScheduleSetting',
            payload: template,
          });
          yield put({
            type: 'CALENDAR_CREATION/setTimeSetting',
            payload: template.m_priority_times,
          });
          yield put({
            type: 'CALENDAR_CREATION/setMessageSetting',
            payload: template,
          });
          yield put.resolve({
            type: 'BASIC_SETTING/setBasicSetting',
            payload: template,
          });
        }

        const { team_id, member_id } = history.location.query;
        yield put.resolve({
          type: 'AVAILABLE_TIME/getMemberList',
          payload: {
            teamId: team_id,
            profile,
            memberId: member_id,
            members: [],
            eventId: undefined,
            isClone: false,
            timeAsync,
          },
        });

        yield put({
          type: 'CALENDAR_CREATION/setRelationshipType',
          payload: 1,
        });
      }

      yield put({ type: 'CALENDAR_CREATION/setLoading', payload: false });
    },
  },
};
