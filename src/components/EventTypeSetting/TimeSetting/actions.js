export const setPriorityStartTime = (index, value) => {
  return {
    type: 'TIME_SETTING/setPriorityStartTime',
    payload: { index, value: value ? value.format('HH:mm') : null },
  };
};

export const setPriorityEndTime = (index, value) => {
  return {
    type: 'TIME_SETTING/setPriorityEndTime',
    payload: { index, value: value ? value.format('HH:mm') : null },
  };
};

export const setPriorityError = (index, value) => {
  return {
    type: 'TIME_SETTING/setPriorityError',
    payload: { index, value },
  };
};

export const setState = payload => {
  return {
    type: 'TIME_SETTING/setState',
    payload,
  };
};
