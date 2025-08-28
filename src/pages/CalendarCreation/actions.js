import {
  TYPE_EVENT_RELATIONSHIP,
  TYPE_VOTE_RELATIONSHIP,
  YYYYMMDD,
} from './../../constant';

import moment from 'moment';

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
  isClone,
  timeAsync,
) => {
  return {
    type: 'CALENDAR_CREATION/loadingData',
    payload: { teamId, memberId, eventId, profile, isClone, timeAsync },
  };
};

export const setLoading = payload => {
  return {
    type: 'CALENDAR_CREATION/setLoading',
    payload,
  };
};

export const getTeam = (teams, teamId) => {
  if (teams && teams.length > 0) {
    return teams.find(team => team.id == teamId);
  }

  return null;
};

export const reset = () => {
  return {
    type: 'CALENDAR_CREATION/reset',
  };
};

export const saveAdvencedSetting = (
  scheduleSetting,
  messageSetting,
  timeSetting,
) => {
  return {
    type: 'CALENDAR_CREATION/saveAdvencedSetting',
    payload: { scheduleSetting, messageSetting, timeSetting },
  };
};

export const create = ({
  event_id,
  member_id,
  team_id,
  relationshipType,
  basicSetting,
  scheduleSetting,
  timeSetting,
  messageSetting,
  customEvents,
  manualEvents,
  customizeDayOnOff,
  members,
  autoVoteEvents,
  isOneTime,
  isClone,
}) => {
  const {
    name,
    m_category_id,
    m_location_id,
    m_block_time_id,
    m_move_time_id,
    location_name,
    move_number,
    block_name,
    block_number,
    is_manual_setting,
    move_name,
  } = basicSetting;

  // validate
  if (!m_category_id || !m_location_id || !m_block_time_id) {
    window.scrollTo(0, 0);
    return {
      type: 'CALENDAR_CREATION/setValidated',
      payload: false,
    };
  }

  let event_datetimes = [];

  if (relationshipType == TYPE_EVENT_RELATIONSHIP) {
    event_datetimes = is_manual_setting
      ? manualEvents.filter(e => !!e.status) // only save which is active
      : customEvents;
    event_datetimes = event_datetimes.map(event => ({
      custom_type: event.custom_type,
      day_of_week: event.day_of_week,
      end_time: event.end_time,
      start_time: event.start_time,
      status: event.status ? 1 : 0,
    }));
  }

  if (relationshipType == TYPE_VOTE_RELATIONSHIP) {
    event_datetimes = is_manual_setting
      ? manualEvents.filter(e => !!e.status) // only save which is active
      : [...autoVoteEvents, ...customEvents];

    event_datetimes = event_datetimes.map(event => ({
      custom_type: event.custom_type,
      day_of_week: event.day_of_week,
      end_time: event.end_time,
      start_time: event.start_time,
      status: event.status ? 1 : 0,
    }));
  }

  const priority_times =
    timeSetting && timeSetting.length
      ? timeSetting.filter(e => e.priority_start_time && e.priority_end_time)
      : [];

  const client = members.map(member => {
    return {
      email: member.email,
      type: member.type,
      status: member.checked ? 1 : 0,
    };
  });

  // hard code if vote is manual
  let is_manual_setting_custom = is_manual_setting;
  if (relationshipType === TYPE_VOTE_RELATIONSHIP) {
    is_manual_setting_custom = true;
  }

  if (
    event_datetimes &&
    event_datetimes.length <= 0 &&
    is_manual_setting_custom
  ) {
    return {
      type: 'CALENDAR_CREATION/showError',
      payload: '候補日程ブロックは最低1つ作成する必要があります。',
    };
  }

  // handle status field
  customizeDayOnOff.map(e => {
    e.status = e.status ? 1 : 0;
    return e;
  });

  // customize day on off if is manual setting
  if (is_manual_setting_custom && event_datetimes.length >= 0) {
    event_datetimes.forEach(e => {
      const exits = customizeDayOnOff.find(c => {
        return moment(c.date).isSame(moment(e.start_time), 'day');
      });

      if (!exits) {
        customizeDayOnOff.push({
          date: moment(e.start_time).format(YYYYMMDD),
          status: 1,
        });
      }
    });
  }

  const payload = {
    team_id,
    member_id,
    // status: 1,
    relationship_type: relationshipType,
    name,
    m_category_id: m_category_id === 2 && !m_move_time_id ? 3 : m_category_id,
    m_location_id: m_location_id,
    m_block_time_id: m_block_time_id,
    m_move_time_id: m_move_time_id ? m_move_time_id : undefined,
    location_name: location_name,
    move_name: move_name,
    move_number: move_number,
    block_name: block_name,
    block_number: block_number,
    is_manual_setting: is_manual_setting_custom,
    event_datetimes,
    is_disposable: isOneTime,
    customize_on_off: customizeDayOnOff,
    priority_times: priority_times,
    default_end_time: scheduleSetting.default_end_time,
    default_start_time: scheduleSetting.default_start_time,
    lunch_break_end_time: scheduleSetting.lunch_break_end_time,
    lunch_break_start_time: scheduleSetting.lunch_break_start_time,
    relax_time: scheduleSetting.relax_time,
    period: scheduleSetting.period,
    reservation_number: scheduleSetting.reservation_number,
    reception_start_time: scheduleSetting.reception_start_time,
    reception_end_time: scheduleSetting.reception_end_time,
    calendar_create_comment: messageSetting.calendar_create_comment,
    calendar_confirm_comment: messageSetting.calendar_confirm_comment,
    client,
    min_vote_number: scheduleSetting.min_vote, // only use for vote
  };
  if (!location_name && m_category_id !== 1) {
    payload.location_name = '指定なし';
  }
  if (event_id && !isClone) {
    payload.eventTypeId = event_id;
    return {
      type: 'CALENDAR_CREATION/update',
      payload,
    };
  }

  // only status  1 when create
  payload.status = 1;
  return {
    type: 'CALENDAR_CREATION/create',
    payload,
  };
};

export const resetCalendarHeader = () => {
  return {
    type: 'AVAILABLE_TIME/resetCalendarHeader',
  };
};

export const settingForFirstLoad = (relationshipType, isOneTime, isClone) => {
  let isManual = relationshipType !== TYPE_EVENT_RELATIONSHIP;
  isOneTime = relationshipType === TYPE_VOTE_RELATIONSHIP ? 0 : isOneTime;

  if (isOneTime) {
    isManual = true;
  }

  return {
    type: 'CALENDAR_CREATION/settingForFirstLoad',
    payload: {
      isManual,
      relationshipType,
      isOneTime,
      isClone,
    },
  };
};

export const setEventTemplate = ({
  type_template,
  basicSetting,
  scheduleSetting,
  timeSetting,
  messageSetting,
}) => {
  // validate
  if (
    !basicSetting.m_category_id ||
    !basicSetting.m_location_id ||
    !basicSetting.m_block_time_id ||
    (basicSetting.m_category_id == 2 && !basicSetting.m_move_time_id)
  ) {
    window.scrollTo(0, 0);
    return {
      type: 'CALENDAR_CREATION/setValidated',
      payload: false,
    };
  }

  const payload = {
    type_template,
    ...basicSetting,
    ...scheduleSetting,
    ...timeSetting,
    ...messageSetting,
  };

  return {
    type: 'CALENDAR_CREATION/setEventTemplate',
    payload,
  };
};
