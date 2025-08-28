const initState = {
  calendar_create_comment: null,
  calendar_confirm_comment: null,
};

export default {
  namespace: 'MESSAGE_SETTING',
  state: initState,
  reducers: {
    setCalendarCreateComment(state, { payload }) {
      return {
        ...state,
        calendar_create_comment: payload,
      };
    },
    setCalendarConfirmComment(state, { payload }) {
      return {
        ...state,
        calendar_confirm_comment: payload,
      };
    },
    setState(state, { payload }) {
      return {
        ...state,
        calendar_create_comment: payload.calendar_create_comment,
        calendar_confirm_comment: payload.calendar_confirm_comment,
      };
    },
    reset() {
      return initState;
    },
  },
  effects: {},
};
