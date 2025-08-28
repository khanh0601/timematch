import { useIntl } from 'umi';

export const setDefaultEndTime = payload => {
  return {
    type: 'SCHEDULE_SETTING/setDefaultEndTime',
    payload: payload ? payload.format('HH:mm') : null,
  };
};

export const setDefaultStartTime = payload => {
  return {
    type: 'SCHEDULE_SETTING/setDefaultStartTime',
    payload: payload ? payload.format('HH:mm') : null,
  };
};

export const setLunchBreakEndTime = payload => {
  return {
    type: 'SCHEDULE_SETTING/setLunchBreakEndTime',
    payload: payload ? payload.format('HH:mm') : null,
  };
};

export const setLunchBreakStartTime = payload => {
  return {
    type: 'SCHEDULE_SETTING/setLunchBreakStartTime',
    payload: payload ? payload.format('HH:mm') : null,
  };
};

export const setMinVote = payload => {
  return {
    type: 'SCHEDULE_SETTING/setMinVote',
    payload,
  };
};

export const setPeriod = payload => {
  return {
    type: 'SCHEDULE_SETTING/setPeriod',
    payload,
  };
};

export const setReceptionEndTime = payload => {
  return {
    type: 'SCHEDULE_SETTING/setReceptionEndTime',
    payload,
  };
};

export const setReceptionStartTime = payload => {
  return {
    type: 'SCHEDULE_SETTING/setReceptionStartTime',
    payload,
  };
};

export const setReservationNumber = payload => {
  return {
    type: 'SCHEDULE_SETTING/setReservationNumber',
    payload,
  };
};

export const setRelaxTime = payload => {
  return {
    type: 'SCHEDULE_SETTING/setRelaxTime',
    payload,
  };
};

export const setState = payload => {
  return {
    type: 'SCHEDULE_SETTING/setState',
    payload,
  };
};

export const displayHourMinute = value => {
  const { formatMessage } = useIntl();

  if (value == 0) return `0${formatMessage({ id: 'i18n_minute' })}`;
  else if (!value) return null;

  const hour = Math.floor(value / 60);
  let message = '';
  if (hour > 0) {
    message += `${hour}${formatMessage({ id: 'i18n_hour' })}`;
  }

  const minute = value % 60;
  if (minute > 0) {
    message += `${minute}${formatMessage({ id: 'i18n_minute' })}`;
  }

  return message;
};
