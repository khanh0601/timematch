import rf from './baseRequests.js';

export default {
  getListCalendar: (data = {}) => {
    const url = '/api/user/calendars';
    return rf.get(url, data);
  },
  getListPastCalendar: (data = {}) => {
    const url = '/api/user/calendars';
    return rf.get(url, data);
  },
  cancelBooking: (data = {}) => {
    const url = `/api/user/calendars/${data.calendarId}`;
    return rf.post(url, data);
  },
  cancelBookingByGuest: (data = {}) => {
    const url = `/api/guest/calendars/${data.calendarId}`;
    return rf.post(url, data);
  },
  getDetailCalendar: (data = {}) => {
    const url = `/api/user/calendars/${data.calendarId}`;
    return rf.get(url, {});
  },
  getDetailCalendarByGuess: (data = {}) => {
    const url = `/api/guest/calendars/${data.calendarId}`;
    return rf.get(url, {});
  },
};
