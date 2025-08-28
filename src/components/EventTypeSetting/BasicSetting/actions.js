export const setBasicSettingName = payload => {
  return {
    type: 'BASIC_SETTING/setBasicSettingName',
    payload: payload,
  };
};

export const setBasicSettingCategory = payload => {
  return {
    type: 'BASIC_SETTING/setBasicSettingCategory',
    payload: payload,
  };
};

export const setBasicSettingLocation = payload => {
  return {
    type: 'BASIC_SETTING/setBasicSettingLocation',
    payload: payload,
  };
};

export const setBasicSettingBlockTime = payload => {
  return {
    type: 'BASIC_SETTING/setBasicSettingBlockTime',
    payload: payload,
  };
};

export const setBasicSettingMoveTime = payload => {
  return {
    type: 'BASIC_SETTING/setBasicSettingMoveTime',
    payload: payload,
  };
};

export const setBasicSettingManual = payload => {
  return {
    type: 'BASIC_SETTING/setBasicSettingManual',
    payload: payload,
  };
};

export const setBasicSettingLocationName = payload => {
  return {
    type: 'BASIC_SETTING/setBasicSettingLocationName',
    payload: payload,
  };
};

export const setBasicSettingBlockNumber = payload => {
  return {
    type: 'BASIC_SETTING/setBasicSettingBlockNumber',
    payload: payload,
  };
};

export const setBasicSettingMoveNumber = payload => {
  return {
    type: 'BASIC_SETTING/setBasicSettingMoveNumber',
    payload: payload,
  };
};
export const onSetCheckAccountMicrosoft = payload => {
  return {
    type: 'CALENDAR_CREATION/setAccountMicrosoft',
    payload: payload,
  };
};

export const onReset = () => {
  return {
    type: 'BASIC_SETTING/reset',
  };
};
