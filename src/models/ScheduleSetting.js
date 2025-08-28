import { deepCopyData } from '@/commons/function';

const initState = {
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
};

export default {
  namespace: 'SCHEDULE_SETTING',
  state: deepCopyData(initState),
  reducers: {
    setDefaultEndTime(state, action) {
      return {
        ...state,
        default_end_time: action.payload,
      };
    },
    setDefaultStartTime(state, action) {
      return {
        ...state,
        default_start_time: action.payload,
      };
    },
    setLunchBreakEndTime(state, action) {
      return {
        ...state,
        lunch_break_end_time: action.payload,
      };
    },
    setLunchBreakStartTime(state, action) {
      return {
        ...state,
        lunch_break_start_time: action.payload,
      };
    },
    setRelaxTime(state, action) {
      return {
        ...state,
        relax_time: action.payload,
      };
    },
    setMinVote(state, action) {
      return {
        ...state,
        min_vote: action.payload,
      };
    },
    setPeriod(state, action) {
      return {
        ...state,
        period: action.payload,
      };
    },
    setReceptionEndTime(state, action) {
      return {
        ...state,
        reception_end_time: action.payload,
      };
    },
    setReceptionStartTime(state, action) {
      return {
        ...state,
        reception_start_time: action.payload,
      };
    },
    setReservationNumber(state, action) {
      return {
        ...state,
        reservation_number: action.payload,
      };
    },
    setState(state, { payload }) {
      const {
        min_vote_number,
        min_vote,
        default_start_time,
        default_end_time,
        relax_time,
        reception_start_time,
        period,
        reception_end_time,
        lunch_break_start_time,
        lunch_break_end_time,
        reservation_number,
      } = payload;

      return {
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
      };
    },
    reset() {
      return deepCopyData(initState);
    },
  },
  effects: {},
};
