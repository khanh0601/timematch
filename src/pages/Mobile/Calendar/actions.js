export const syncCalendar = profile => {
  return {
    type: 'CALENDAR_CREATION/syncCalendar',
    profile,
  };
};

export const loadingData = (
  teamId,
  memberId,
  eventId,
  profile,
  isClone,
  timeAsync,
) => {
  return {
    type: 'CALENDAR_CREATION/loadingDataMobile',
    payload: { teamId, memberId, eventId, profile, isClone, timeAsync },
  };
};
