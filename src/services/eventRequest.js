import rf from './baseRequests.js';
import moment from 'moment-timezone';

export default {
  checkAccountMicrosoft: () => {
    const url = '/api/user/events/check-microsoft-team';
    return rf.get(url);
  },
  createEventCodeCopy: (data = {}) => {
    const url = '/api/user/only_event_codes';
    return rf.post(url, data);
  },
  getListEventType: (data = {}) => {
    const url = '/api/user/events';
    return rf.get(url, data);
  },
  getListPersonalEventType: (data = {}) => {
    const url = `/api/user/events`;
    return rf.get(url, data);
  },
  getListEventLocations: (data = {}) => {
    const url = '/api/master/locations';
    return rf.get(url, data);
  },
  getListEventCategories: (data = {}) => {
    const url = '/api/master/categories';
    return rf.get(url, data);
  },
  getListEventBlockTime: (data = {}) => {
    const url = '/api/master/block_times';
    return rf.get(url, data);
  },
  getListEventMoveTime: (data = {}) => {
    const url = '/api/master/move_times';
    return rf.get(url, data);
  },
  getListSettingEvent: (data = {}) => {
    const url = '/api/user/setting_events';
    return rf.get(url, data);
  },
  updateEventType: (data = {}) => {
    const url = `/api/user/events/${data.eventTypeId}`;
    return rf.put(url, data);
  },
  generateOnceEventCode: (data = {}) => {
    const url = '/api/user/event_codes';
    return rf.post(url, data);
  },
  getFreeTime: (data = {}) => {
    const url = '/api/user/datetimes';
    return rf.get(url, data);
  },
  createEventType: (data = {}) => {
    const url = `/api/user/events`;
    return rf.post(url, data);
  },
  checkEventCode: (data = {}) => {
    const url = '/api/guest/event_codes';
    return rf.get(url, data);
  },
  getUserByCode: (data = {}) => {
    const url = '/api/guest/event/user_codes';
    return rf.get(url, data);
  },
  getListFreeDay: (data = {}) => {
    const url = '/api/guest/event_datetimes';
    return rf.get(url, data);
  },
  createSchedule: (data = {}) => {
    const url = '/api/guest/calendars';
    return rf.post(url, data);
  },
  getGuestCalendar: (data = {}) => {
    const url = '/api/guest/user_calendars';
    return rf.get(url, data);
  },
  deleteEventType: (data = {}) => {
    const url = `/api/user/events/${data.eventTypeId}`;
    return rf.delete(url, data);
  },
  getZoomURL: (data = {}) => {
    const url = '/api/auth/zoom/login_url';
    return rf.get(url, data);
  },
  getDetailEventType: (data = {}) => {
    const url = `/api/user/events/${data.eventTypeId}`;
    return rf.get(url, {});
  },
  getTimeAvailable: (data = {}) => {
    const url = `/api/user/event_datetimes`;
    return rf.get(url, data);
  },
  getGoogleMeetURL: (data = {}) => {
    const url = '/api/auth/google/integrate_url';
    return rf.get(url, data);
  },
  updateAdvancedSetting: (data = {}, id) => {
    const url = `/api/user/setting_events/${data.id}`;
    return rf.put(url, data);
  },
  getEventTypeFromGuest: (data = {}, id) => {
    const url = `/api/guest/events`;
    return rf.get(url, data);
  },
  setEventTemplate: (data = {}) => {
    const url = `/api/user/m_events`;
    return rf.post(url, data);
  },
  updateEventTemplate: (data = {}) => {
    const url = `/api/user/m_events`;
    return rf.post(url, data);
  },
  getEventTemplate: (data = {}) => {
    const url = `/api/user/m_events`;
    return rf.get(url, data);
  },
  getEventTemplateById: (id = {}) => {
    const url = `/api/user/m_events/${id}`;
    return rf.get(url);
  },
  getAllBookedSchedule: (data = {}) => {
    const url = `/api/user/user_calendars`;
    return rf.get(url, data);
  },
  getDateTimesByEvent: (id, data = {}) => {
    const url = `/api/user/events/${id}/event_datetimes`;
    return rf.get(url, data);
  },
  getFreeTimeByGuest: (data = {}) => {
    const url = '/api/guest/date_times';
    return rf.get(url, data);
  },
  getAllBookedScheduleByGuest: (data = {}) => {
    const url = `/api/guest/user_calendars`;
    return rf.get(url, data);
  },
  getGoogleCalendar: (data = {}) => {
    const url = `/api/user/sync_google`;
    return rf.get(url, data);
  },
  getGoogleCalendarByGuest: (data = {}) => {
    const url = `/api/guest/sync_google`;
    return rf.get(url, data);
  },
  getMicrosoftCalendar: (data = {}) => {
    const url = `/api/user/sync_microsoft`;
    return rf.get(url, data);
  },
  getMicrosoftCalendarByGuest: (data = {}) => {
    const url = `/api/guest/sync_microsoft`;
    return rf.get(url, data);
  },
  getCalendarByProvider: (data = {}) => {
    const { startTime, endTime, provider, email } = data;
    const url = `/api/users/calendars/${provider}/${email}?need_sync=true&start=${startTime}&end=${endTime}`;
    return rf.get(url, {});
  },
  getAllBookedScheduleByUser: (data = {}) => {
    const { user_id, need_sync, startTime, endTime } = data;
    const tz = moment.tz.guess();
    const url = `/api/user/user_calendars/${user_id}?need_sync=${need_sync}&timeZone=${tz}&start=${startTime}&end=${endTime}`;
    return rf.get(url, {});
  },
  getEventCustomizeDates: (data = {}) => {
    const url = `/api/user/events/custom_date/list`;
    return rf.get(url, data);
  },
  getGuestEventClient: (data = {}) => {
    const url = `/api/guest/event-client`;
    return rf.get(url, data);
  },
  getUserContract: (data = {}) => {
    const url = `/api/user/events/user-contract`;
    return rf.get(url, data);
  },
  getUserShare: (data = {}) => {
    const url = `/api/user/events/user-share`;
    return rf.get(url, data);
  },
  sendEmailAddMember: (data = {}) => {
    const url = `/api/users/calendars/send-mail`;
    return rf.post(url, data);
  },
  getNotifyAskCalendar: () => {
    const url = `/api/user/events/notify-ask-calendar`;
    return rf.get(url);
  },
  updateNotifyAskCalendar: data => {
    const url = `/api/user/events/notify-ask-calendar`;
    return rf.put(url, data);
  },
  updateNameCalendar: data => {
    const url = `/api/user/events/update-event-name`;
    return rf.put(url, data);
  },
  getAnswers: (id, data = {}) => {
    const url = `/api/form/result-form`;
    return rf.get(url, data);
  },
  inviteParticipant: (data = {}) => {
    const url = `/api/user/events/user-invites`;
    return rf.post(url, data);
  },
  updateTimeAvailable: (data = {}) => {
    const url = `/api/user/event_datetimes`;
    return rf.put(url, data);
  },
};
