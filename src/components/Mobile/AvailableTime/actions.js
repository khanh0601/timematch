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

export const dropEventMobile = info => {
  return {
    type: 'AVAILABLE_TIME/dropEventMobile',
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

export const autoGenerateEventMobile = calendarStore => {
  return {
    type: 'AVAILABLE_TIME/autoGenerateEventMobile',
    payload: calendarStore,
  };
};

export const customizeGenerateEventMobile = () => {
  return {
    type: 'AVAILABLE_TIME/customizeGenerateEventMobile',
  };
};

export const deleteAllEvent = () => {
  return {
    type: 'AVAILABLE_TIME/deleteAllEvent',
  };
};

export const memberCheckedMobile = payload => {
  return {
    type: 'AVAILABLE_TIME/memberCheckedMobile',
    payload,
  };
};

export const sendAddMemberEmail = (provider, email) => {
  return {
    type: 'AVAILABLE_TIME/sendAddMemberEmail',
    payload: { provider, email },
  };
};

export const addEventMobile = (info, block_number) => {
  return {
    type: 'AVAILABLE_TIME/addEventMobile',
    payload: { info, block_number },
  };
};

export const deleteEventMobile = (event, isManualSetting) => {
  return {
    type: 'AVAILABLE_TIME/deleteEventMobile',
    payload: {
      ...event,
      isManualSetting,
    },
  };
};

export const deleteEventPC = payload => {
  return {
    type: 'AVAILABLE_TIME/deleteCheckedGenerateBlockCalendar',
    payload,
  };
};

export const resizeEventMobile = info => {
  return {
    type: 'AVAILABLE_TIME/resizeEventMobile',
    payload: info,
  };
};

export const setCheckedGenerateBlockCalendar = event => {
  return {
    type: 'AVAILABLE_TIME/setCheckedGenerateBlockCalendar',
    payload: event,
  };
};

export const toggleBlockCalendar = event => {
  return {
    type: 'AVAILABLE_TIME/toggleBlockCalendar',
    payload: event,
  };
};

export const setDataEventMobile = event => {
  return {
    type: 'AVAILABLE_TIME/setDataEventMobile',
    payload: event,
  };
};

export const setBlockCalendar = (block, clicked) => {
  return {
    type: 'AVAILABLE_TIME/setBlockCalendar',
    payload: { time: block, clicked },
  };
};

export const setViewEventCalendar = view => {
  return {
    type: 'AVAILABLE_TIME/setViewEventCalendar',
    payload: view,
  };
};

export const setCurrentStartDate = date => {
  return {
    type: 'AVAILABLE_TIME/setCurrentStartDate',
    payload: date,
  };
};

export const dropBlockCalendar = payload => {
  return {
    type: 'AVAILABLE_TIME/dropBlockCalendar',
    payload,
  };
};
export const dragStopBlockCalendar = payload => {
  return {
    type: 'AVAILABLE_TIME/dragStopBlockCalendar',
    payload,
  };
};
