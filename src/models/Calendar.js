import CalendarRequest from '../services/calendarRequest.js';
import { notify } from '@/commons/function';

export default {
  namespace: 'CALENDAR',
  state: {
    listCalendar: [],
    listUpcomingCalendar: [],
    listPastCalendar: [],
    detailCalendar: {
      event: {},
    },
  },
  reducers: {
    getListCalendarSuccess(state, action) {
      return {
        ...state,
        listCalendar: action.payload,
      };
    },
    getListPastCalendarSuccess(state, action) {
      return {
        ...state,
        listPastCalendar: action.payload,
      };
    },
    getListUpcomingCalendarSuccess(state, action) {
      return {
        ...state,
        listUpcomingCalendar: action.payload,
      };
    },
    getDetailCalendarSuccess(state, action) {
      return {
        ...state,
        detailCalendar: action.payload,
      };
    },
    getDetailCalendarByGuessSuccess(state, action) {
      return {
        ...state,
        detailCalendar: action.payload,
      };
    },
  },
  effects: {
    *getListCalendar(action, { call, put }) {
      const res = yield CalendarRequest.getListCalendar(action.payload);
      yield put({
        type: 'getListCalendarSuccess',
        payload: res.body.data,
      });
    },
    *getListUpComingCalendar(action, { call, put }) {
      const res = yield CalendarRequest.getListCalendar(action.payload);
      yield put({
        type: 'getListUpcomingCalendarSuccess',
        payload: res.body.data,
      });
    },
    *getListPastCalendar(action, { call, put }) {
      const res = yield CalendarRequest.getListPastCalendar(action.payload);
      yield put({
        type: 'getListPastCalendarSuccess',
        payload: res.body.data,
      });
    },
    *cancelBooking(action, { call, put }) {
      console.log('action.payload', action.payload);
      try {
        const newPayload = {
          ...action.payload,
          setCancelSuccessState: undefined,
          setLoading: undefined,
        };
        console.log('newPayload', newPayload);
        const res = yield CalendarRequest.cancelBooking(newPayload);
        if (res.status === 200) {
          setCancelSuccessState(true);
        } else {
          notify('Something wrong!!!');
        }
      } catch (error) {
        notify('Something wrong!!!');
      }
    },
    *cancelBookingByGuest(action, { call, put }) {
      const { setCancelSuccessState, setLoading } = action.payload;
      setLoading(true);
      try {
        const newPayload = {
          ...action.payload,
          setCancelSuccessState: undefined,
          setLoading: undefined,
        };
        const res = yield CalendarRequest.cancelBookingByGuest(newPayload);
        if (res.status === 200) {
          setCancelSuccessState(true);
        } else {
          notify('Something wrong!!!');
        }
      } catch (error) {
        notify('Something wrong!!!');
      }
      setLoading(false);
    },
    *getDetailCalendar(action, { call, put }) {
      const res = yield CalendarRequest.getDetailCalendar(action.payload);
      yield put({
        type: 'getDetailCalendarSuccess',
        payload: res.body.data,
      });
    },
    *getDetailCalendarByGuess(action, { call, put }) {
      const res = yield CalendarRequest.getDetailCalendarByGuess(
        action.payload,
      );
      yield put({
        type: 'getDetailCalendarByGuessSuccess',
        payload: res.body.data,
      });
    },
  },
};
