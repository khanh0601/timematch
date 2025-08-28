export const setCalendarCreateComment = payload => {
  return {
    type: 'MESSAGE_SETTING/setCalendarCreateComment',
    payload: payload,
  };
};

export const setCalendarConfirmComment = payload => {
  return {
    type: 'MESSAGE_SETTING/setCalendarConfirmComment',
    payload: payload,
  };
};
