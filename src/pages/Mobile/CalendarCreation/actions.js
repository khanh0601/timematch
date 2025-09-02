export const syncCalendar = profile => {
  return {
    type: 'CALENDAR_CREATION/syncCalendar',
    profile,
  };
};

export const setSync = payload => {
  return {
    type: 'CALENDAR_CREATION/setSync',
    payload,
  };
};

export const loadingData = (
  teamId,
  memberId,
  eventId,
  profile,
  isEdit,
  isClone,
  timeAsync,
) => {
  return {
    type: 'CALENDAR_CREATION/loadingDataMobile',
    payload: { teamId, memberId, eventId, profile, isEdit, isClone, timeAsync },
  };
};
