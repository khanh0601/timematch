import EventRequest from '@/services/eventRequest.js';
import UserRequest from '@/services/userRequest.js';
import moment from 'moment';
import { TYPE_VOTE_RELATIONSHIP } from './../constant';
import { deepCopyData, notify } from '@/commons/function';

const initState = {
  loading: false,
  created: false,
  sync: false,
  urlZoom: null,
  urlMeet: null,
  validated: true,
  relationshipType: null,
  isOneTime: 0,
  isClone: 0,
  scheduleSetting: {
    default_start_time: null,
    default_end_time: null,
    relax_time: null,
    period: null,
    reception_start_time: null,
    reception_end_time: null,
    lunch_break_start_time: null,
    lunch_break_end_time: null,
    reservation_number: null,
    min_vote: null,
  },
  timeSetting: [],
  messageSetting: {
    calendar_create_comment: null,
    calendar_confirm_comment: null,
  },
  freeTimes: [],
  userEdit: null,
  checkAccountMicroSoft: {
    isChecked: false,
    isCallApi: false,
  },
};

export default {
  namespace: 'CALENDAR_CREATION',
  state: deepCopyData(initState),
  reducers: {
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    setScheduleSetting(state, { payload }) {
      const {
        min_vote_number,
        min_vote,
        default_start_time,
        default_end_time,
        relax_time,
        period,
        reception_start_time,
        reception_end_time,
        lunch_break_start_time,
        lunch_break_end_time,
        reservation_number,
      } = payload;
      return {
        ...state,
        scheduleSetting: {
          default_start_time: default_start_time,
          default_end_time: default_end_time,
          relax_time: relax_time,
          period: period,
          reception_start_time: reception_start_time,
          reception_end_time: reception_end_time,
          lunch_break_start_time: lunch_break_start_time,
          lunch_break_end_time: lunch_break_end_time,
          reservation_number: reservation_number,
          min_vote: min_vote_number ? min_vote_number : min_vote,
        },
      };
    },
    setTimeSetting(state, { payload }) {
      return {
        ...state,
        timeSetting: payload ? payload : [],
      };
    },
    setMessageSetting(state, { payload }) {
      return {
        ...state,
        messageSetting: {
          calendar_create_comment: payload.calendar_create_comment,
          calendar_confirm_comment: payload.calendar_confirm_comment,
        },
      };
    },
    setFreeTimesState(state, { payload }) {
      return {
        ...state,
        freeTimes: payload,
      };
    },
    // sync
    setSync(state, { payload }) {
      return {
        ...state,
        sync: payload,
      };
    },
    setUrlZoom(state, { payload }) {
      return {
        ...state,
        urlZoom: payload.urlZoom,
        urlMeet: payload.urlMeet,
      };
    },
    // reset
    reset() {
      return deepCopyData(initState);
    },
    setValidated(state, { payload }) {
      return {
        ...state,
        loading: false,
        validated: payload,
      };
    },
    setRelationshipType(state, { payload }) {
      return {
        ...state,
        relationshipType: payload,
      };
    },
    setReceptionStartTime(state, { payload }) {
      state.scheduleSetting.reception_start_time = payload;
      return {
        ...state,
        scheduleSetting: { ...state.scheduleSetting },
      };
    },
    setIsOneTime(state, { payload }) {
      return {
        ...state,
        isOneTime: payload,
      };
    },
    setIsClone(state, { payload }) {
      return {
        ...state,
        isClone: payload,
      };
    },
    setAccountMicrosoft(state, { payload }) {
      const { isChecked } = payload;
      return {
        ...state,
        checkAccountMicroSoft: { ...payload },
      };
    },
    setUserIdCreate(state, { payload }) {
      return {
        ...state,
        userEdit: { ...payload },
      };
    },
  },
  effects: {
    *checkAccountMicrosoft(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield EventRequest.checkAccountMicrosoft();
      const { code } = res.body;
      const payload = {
        isCallApi: true,
        isChecked: code === 1101,
      };
      yield put({ type: 'setAccountMicrosoft', payload });
      yield put({ type: 'setLoading', payload: false });
    },
    *setFreeTimes({ payload = [] }, { put }) {
      const headers = [];
      const current = moment();
      for (let index = 0; index < 7; index++) {
        const result = payload.find(
          e => e.day_of_week === current.isoWeekday(),
        );

        headers.push({
          date: current.format('YYYY-MM-DD'),
          status: !!result && !!result.status,
          origin: !!result && !!result.status,
          weekDay: current.isoWeekday(),
        });

        current.add(1, 'days');
      }

      yield put({ type: 'setFreeTimesState', payload });
      yield put({
        type: 'AVAILABLE_TIME/setCalendarHeaders',
        payload: headers,
      });
    },
    *syncCalendar({ profile }, { put, call }) {
      try {
        yield call(UserRequest.syncUser);
      } catch (error) {
        console.log(error);
      } finally {
        yield put({ type: 'setSync', payload: true });
      }
    },
    *getURL(action, { put }) {
      try {
        const payload = {};
        const zoomRes = yield EventRequest.getZoomURL();
        payload.urlZoom = zoomRes.body.data.url;

        const googleRes = yield EventRequest.getGoogleMeetURL();
        payload.urlMeet = googleRes.body.data.url;

        yield put({ type: 'setUrlZoom', payload });
      } catch {}
    },
    *loadingData(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      const {
        teamId,
        memberId,
        eventId,
        profile,
        isClone,
        timeAsync,
      } = action.payload;
      yield put({ type: 'getURL' });

      // only get team if not clone
      if (eventId && !isClone) {
        yield put({
          type: 'EVENT/getFreeTime',
          payload: { event_id: eventId },
        });
      } else if (teamId && !isClone) {
        yield put({
          type: 'EVENT/getFreeTime',
          payload: { team_id: teamId },
        });
      } else if (memberId && !isClone) {
        yield put({
          type: 'EVENT/getFreeTime',
          payload: { member_id: memberId },
        });
      } else {
        yield put({
          type: 'EVENT/getFreeTime',
          payload: {},
        });
      }

      yield put({ type: 'EVENT/getListEventLocations', payload: {} });
      yield put({ type: 'EVENT/getListEventCategories', payload: {} });
      yield put({ type: 'EVENT/getListEventBlockTime', payload: {} });
      yield put({ type: 'EVENT/getListEventMoveTime', payload: {} });

      let members = [];
      if (eventId) {
        members = yield put.resolve({
          type: 'EVENT/getDetailEventType',
          payload: { eventTypeId: eventId, isClone },
        });
      }

      yield put.resolve({
        type: 'AVAILABLE_TIME/getMemberListMobile',
        payload: {
          teamId,
          profile,
          memberId,
          members,
          eventId,
          isClone,
          timeAsync,
        },
      });

      yield put({ type: 'setLoading', payload: false });
    },
    *saveAdvencedSetting({ payload }, { put }) {
      const { scheduleSetting, messageSetting, timeSetting } = payload;

      yield put({ type: 'setScheduleSetting', payload: scheduleSetting });
      yield put({ type: 'setMessageSetting', payload: messageSetting });
      yield put({ type: 'setTimeSetting', payload: timeSetting });
      yield put({ type: 'AVAILABLE_TIME/setAutoVoteEvents', payload: [] });
      yield put({ type: 'AVAILABLE_TIME/setAutoEvents', payload: [] });
    },
    // main
    *reset(action, { put }) {
      yield put({ type: 'BASIC_SETTING/reset' });
      yield put({ type: 'AVAILABLE_TIME/reset' });
      yield put({ type: 'SCHEDULE_SETTING/reset' });
      yield put({ type: 'MESSAGE_SETTING/reset' });
      yield put({ type: 'TIME_SETTING/reset' });
    },
    *update(action, { put }) {
      yield put({ type: 'setLoading', payload: true });

      yield put({ type: 'EVENT/updateEventType', payload: action.payload });
      yield put({ type: 'setLoading', payload: false });
      yield put({ type: 'reset' });
    },
    *create(action, { put }) {
      yield put({ type: 'setLoading', payload: true });

      yield put({ type: 'EVENT/createEventType', payload: action.payload });
      yield put({ type: 'setLoading', payload: false });
      yield put({ type: 'reset' });
    },
    *showError(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      notify(action.payload);
      yield put({ type: 'setLoading', payload: false });
    },
    *settingForFirstLoad(action, { put }) {
      yield put({
        type: 'setIsClone',
        payload: action.payload.isClone,
      });
      yield put({
        type: 'setRelationshipType',
        payload: action.payload.relationshipType,
      });
      yield put({
        type: 'setIsOneTime',
        payload: action.payload.isOneTime,
      });
      yield put({
        type: 'BASIC_SETTING/setBasicSettingManual',
        payload: action.payload.isManual,
      });
      yield put({
        type: 'AVAILABLE_TIME/setRelationshipType',
        payload: action.payload.relationshipType,
      });
      //  set default setReceptionStartTime for vote type
      if (action.payload.relationshipType == TYPE_VOTE_RELATIONSHIP) {
        yield put({
          type: 'setReceptionStartTime',
          payload: 24 * 60,
        });

        yield put({
          type: 'SCHEDULE_SETTING/setReceptionStartTime',
          payload: 24 * 60,
        });
      }
    },
    *setEventTemplate({ payload }, { put }) {
      yield put({ type: 'setLoading', payload: true });

      yield put.resolve({
        type: 'EVENT/setEventTemplate',
        payload: { requestBody: payload },
      });

      yield put({ type: 'setLoading', payload: false });
    },
    *loadingDataMobile(action, { put }) {
      yield put({ type: 'setLoading', payload: true });
      const {
        teamId,
        memberId,
        eventId,
        profile,
        isEdit,
        isClone,
        timeAsync,
      } = action.payload;
      // yield put({ type: 'getURL' });

      // only get team if not clone
      if (eventId && !isClone) {
        yield put({
          type: 'EVENT/getFreeTime',
          payload: { event_id: eventId },
        });
      } else if (teamId && !isClone) {
        yield put({
          type: 'EVENT/getFreeTime',
          payload: { team_id: teamId },
        });
      } else if (memberId && !isClone) {
        yield put({
          type: 'EVENT/getFreeTime',
          payload: { member_id: memberId },
        });
      } else {
        yield put({
          type: 'EVENT/getFreeTime',
          payload: {},
        });
      }

      let members = [];
      if (eventId) {
        members = yield put.resolve({
          type: 'EVENT/getDetailEventTypeMobile',
          payload: { eventTypeId: eventId, isEdit, isClone },
        });
      }

      yield put.resolve({
        type: 'AVAILABLE_TIME/getMemberListMobile',
        payload: {
          teamId,
          profile,
          memberId,
          members,
          eventId,
          isEdit,
          isClone,
          timeAsync,
        },
      });

      yield put({ type: 'setLoading', payload: false });
    },
  },
};
