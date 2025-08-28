export const addEvent = (info, basicSetting) => {
  return {
    type: 'AVAILABLE_TIME/addEvent',
    payload: { info, basicSetting },
  };
};

export const deleteEvent = (event, isManualSetting) => {
  return {
    type: 'AVAILABLE_TIME/deleteEvent',
    payload: {
      ...event,
      isManualSetting,
    },
  };
};

export const resizeEvent = info => {
  return {
    type: 'AVAILABLE_TIME/resizeEvent',
    payload: info,
  };
};

export const dropEvent = info => {
  return {
    type: 'AVAILABLE_TIME/dropEvent',
    payload: info,
  };
};

export const switchChange = (day, isAuto) => {
  return {
    type: 'AVAILABLE_TIME/switchChange',
    payload: { day, isAuto },
  };
};

export const nextWeek = step => {
  return {
    type: 'AVAILABLE_TIME/nextWeek',
    payload: step,
  };
};

export const prevWeek = step => {
  return {
    type: 'AVAILABLE_TIME/prevWeek',
    payload: step,
  };
};

export const setCalendarRef = ref => {
  return {
    type: 'AVAILABLE_TIME/setCalendarRef',
    payload: ref,
  };
};

export const autoGenerateEvent = calendarStore => {
  return {
    type: 'AVAILABLE_TIME/autoGenerateEvent',
    payload: calendarStore,
  };
};

export const customizeGenerateEvent = () => {
  return {
    type: 'AVAILABLE_TIME/customizeGenerateEvent',
  };
};

export const deleteAllEvent = () => {
  return {
    type: 'AVAILABLE_TIME/deleteAllEvent',
  };
};

export const memberChecked = payload => {
  return {
    type: 'AVAILABLE_TIME/memberChecked',
    payload,
  };
};

export const sendAddMemberEmail = (provider, email) => {
  return {
    type: 'AVAILABLE_TIME/sendAddMemberEmail',
    payload: { provider, email },
  };
};
