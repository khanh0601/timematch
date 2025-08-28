import { deepCopyData } from '@/commons/function';

const initState = [
  {
    status: 1,
    priority_start_time: null,
    priority_end_time: null,
    id: '',
    is_delete: false,
  },
  {
    status: 2,
    priority_start_time: null,
    priority_end_time: null,
    id: '',
    is_delete: false,
  },
  {
    status: 3,
    priority_start_time: null,
    priority_end_time: null,
    id: '',
    is_delete: false,
  },
  {
    status: 4,
    priority_start_time: null,
    priority_end_time: null,
    id: '',
    is_delete: false,
  },
  {
    status: 5,
    priority_start_time: null,
    priority_end_time: null,
    id: '',
    is_delete: false,
  },
];

export default {
  namespace: 'TIME_SETTING',
  state: deepCopyData(initState),
  reducers: {
    setPriorityStartTime(state, { payload }) {
      state[payload.index] = {
        ...state[payload.index],
        priority_start_time: payload.value,
      };
      return [...state];
    },
    setPriorityEndTime(state, { payload }) {
      state[payload.index] = {
        ...state[payload.index],
        priority_end_time: payload.value,
      };
      return [...state];
    },
    setPriorityError(state, { payload }) {
      state[payload.index] = {
        ...state[payload.index],
        hasError: payload.value,
      };
      return [...state];
    },
    setState(state, { payload }) {
      return state.map((time, id) =>
        payload && payload[id] ? payload[id] : time,
      );
    },
    reset() {
      return deepCopyData(initState);
    },
  },
  effects: {},
};
