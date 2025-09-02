import { copyText, createTimeAsync, notify } from '@/commons/function';
import config from '@/config';
import {
  DATE_TIME_TYPE,
  YYYYMMDD,
  YYYYMMDDTHHmm,
  STATUS_CODE,
} from '@/constant';
import { message } from 'antd';
import moment from 'moment';
import { formatMessage, history } from 'umi';
import EventRequest from '../services/eventRequest.js';
import { getLocation, handleError } from '../commons/function';
import React from 'react';

export default {
  namespace: 'EVENT',
  state: {
    listEventType: [],
    listEventLocation: [],
    listEventCategories: [],
    listEventBlockTime: [],
    listEventMoveTime: [],
    freeTime: [],
    userByCode: {},
    listFreeDay: [],
    listGuestCalendar: [],
    detailEventType: {},
    listPersonalEventType: [],
    advancedSetting: [],
    totalEventType: 0,
    totalPersonalEventType: 0,
    listEventTypeFromGuest: [],
    isValidUserCode: false,
    owner_name: '',
    company: '',
    eventTemplateList: [],
    isLoading: false,
    isSelectEvent: false,
    firstSetupFreeTime: [],
    currentEvent: {},
    listBookedSchedule: [],
    listBookedScheduleGuest: [],
    scheduleInfo: {},
    listDatetimes: [],
    bookedList: [],
    listEventByProvider: [],
    externalBookedSchedules: [],
    changedBookedSchedule: false,
    loaderCount: 0,
    eventCustomizeDates: [],
    guestEventClients: [],
    listTextAskCalendar: {},
    copyEvent: {},
    createCalendarSuccess: {},
    dataCalendarSuccess: {},
    urlMeet: '',
    urlZoom: '',
    // hide page copy url
    // listCalendarCopyUrl: {
    //   id: '',
    //   urlCopy: '',
    //   nameEvent: '',
    //   block_name: '',
    //   location_name: '',
    //   listBlockTime: [],
    // },
  },
  reducers: {
    getListEventTypeSuccess(state, action) {
      // console.log('action 111: ', action);
      return {
        ...state,
        listEventType: action.payload.data,
        totalEventType: action.payload.total,
      };
    },
    getListPersonalEventTypeSuccess(state, action) {
      return {
        ...state,
        listPersonalEventType: action.payload.data,
        totalPersonalEventType: action.payload.total,
      };
    },
    getListEventLocationsSuccess(state, action) {
      return {
        ...state,
        listEventLocation: action.payload,
      };
    },
    getListEventCategoriesSuccess(state, action) {
      return {
        ...state,
        listEventCategories: action.payload,
      };
    },
    getListEventBlockTimeSuccess(state, action) {
      return {
        ...state,
        listEventBlockTime: action.payload,
      };
    },
    getListEventMoveTimeSuccess(state, action) {
      return {
        ...state,
        listEventMoveTime: action.payload,
      };
    },
    getFreeTimeSuccess(state, action) {
      return {
        ...state,
        firstSetupFreeTime: action.payload,
      };
    },
    getUserByCodeSuccess(state, action) {
      return {
        ...state,
        userByCode: action.payload,
      };
    },
    getListFreeDaySuccess(state, action) {
      return {
        ...state,
        listFreeDay: action.payload.map(item => {
          item.date = new Date(item.start_time);
          item.dateStr = moment(item.start_time).format(YYYYMMDD);
          return item;
        }),
      };
    },
    getGuestCalendarSuccess(state, action) {
      return {
        ...state,
        listGuestCalendar: action.payload,
      };
    },
    getDetailEventTypeSuccess(state, action) {
      return {
        ...state,
        detailEventType: action.payload,
      };
    },
    getTimeAvailableSuccess(state, action) {
      return {
        ...state,
        freeTime: action.payload,
      };
    },
    getEventTypeFromGuestSuccess(state, action) {
      return {
        ...state,
        listEventTypeFromGuest: action.payload.data,
        owner_name: action.payload.owner_name,
        company: action.payload.company,
        isValidUserCode: true,
      };
    },
    backToEventTypeListSuccess(state, action) {
      return {
        ...state,
        userByCode: {},
        listFreeDay: [],
        listGuestCalendar: [],
      };
    },
    getEventTemplateSuccess(state, action) {
      return {
        ...state,
        eventTemplateList: action.payload,
      };
    },
    setEventTemplateSuccess(state, action) {
      const eventTemplateList = state.eventTemplateList;
      let tempListTemplate = [...eventTemplateList];
      let newListTemplate = [];
      for (let i = 1; i <= 3; i++) {
        let tempActionPayload =
          action.payload.type_template === i ? { ...action.payload } : {};
        newListTemplate.push({ ...tempActionPayload });
      }
      return {
        ...state,
        eventTemplateList: newListTemplate,
      };
    },
    setLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    setListAskCalendar(state, action) {
      return {
        ...state,
        listTextAskCalendar: action.payload,
      };
    },
    // hide page copy url
    setCalendarCopyUrl(state, action) {
      const { payload } = action;
      return {
        ...state,
        listCalendarCopyUrl: payload,
      };
    },
    // hide page copy url
    reloadListBlockTime(state) {
      return {
        ...state,
        copyEvent: {},
        listTextAskCalendar: {},
      };
    },
    updateCurrentEventSuccess(state, action) {
      return {
        ...state,
        currentEvent: action.payload,
        isSelectEvent: true,
      };
    },

    setCopyEvent(state, action) {
      return {
        ...state,
        copyEvent: action.payload,
      };
    },

    getAllBookedScheduleSuccess(state, action) {
      return {
        ...state,
        listBookedSchedule: action.payload,
      };
    },

    getAllBookedScheduleGuestSuccess(state, action) {
      return {
        ...state,
        listBookedScheduleGuest: action.payload,
      };
    },

    appendBookedSchedule(state, action) {
      return {
        ...state,
        listBookedSchedule: [...state.listBookedSchedule, ...action.payload],
        changedBookedSchedule: true,
      };
    },

    createScheduleSuccess(state, action) {
      return {
        ...state,
        scheduleInfo: action.payload,
      };
    },

    setListDateTimeByEvent(state, action) {
      return {
        ...state,
        listDatetimes: action.payload,
      };
    },
    setCurrentTemplateSuccess(state, action) {
      return {
        ...state,
        detailEventType: action.payload,
      };
    },
    clearDetailEventTypeSuccess(state, action) {
      return {
        ...state,
        detailEventType: {},
        freeTime: [],
      };
    },
    setBookedListSuccess(state, action) {
      return {
        ...state,
        bookedList: action.payload,
      };
    },

    updateIsSelectEventSuccess(state, action) {
      return {
        ...state,
        isSelectEvent: false,
      };
    },
    syncGoogleCalendarSuccess(state, action) {
      return {
        ...state,
        listBookedSchedule: [...state.listBookedSchedule, ...action.payload],
      };
    },
    // setStartAndEndTimeSuccess(state, action) {
    //   return {
    //     ...state,
    //     eventTime: action.payload,
    //   };
    // },
    getGetCalendarByProviderSuccess(state, action) {
      return {
        ...state,
        listEventByProvider: action.payload,
        externalBookedSchedules: [
          ...state.externalBookedSchedules,
          ...action.payload,
        ],
      };
    },
    getBookedScheduleByUserSuccess(state, action) {
      return {
        ...state,
        externalBookedSchedules: [
          ...state.externalBookedSchedules,
          ...action.payload,
        ],
      };
    },
    setShowScheduleByUserSuccess(state, { payload }) {
      if (payload.show) {
        const bookedScheduleToAdd = state.externalBookedSchedules.filter(
          event => event.user_id === payload.member.id,
        );
        return {
          ...state,
          listBookedSchedule: [
            ...state.listBookedSchedule,
            ...bookedScheduleToAdd,
          ],
          changedBookedSchedule: true,
        };
      }

      const newBookedScheduleList = state.listBookedSchedule.filter(
        event => event.user_id !== payload.member.id,
      );
      return {
        ...state,
        listBookedSchedule: [...newBookedScheduleList],
        changedBookedSchedule: true,
      };
    },
    clearExternalBookedSchedulerSuccess(state) {
      return {
        ...state,
        externalBookedSchedules: [],
        listBookedSchedule: [],
      };
    },
    restoreChangedBookedScheduleSuccess(state) {
      return {
        ...state,
        changedBookedSchedule: false,
      };
    },
    restoreBookedScheduleSuccess(state) {
      const newBookedScheduleList = state.listBookedSchedule.filter(
        event => !event.user_id,
      );

      return {
        ...state,
        listBookedSchedule: [...newBookedScheduleList],
      };
    },
    increaseLoaderCount(state) {
      return {
        ...state,
        loaderCount: state.loaderCount + 1,
      };
    },
    decreaseLoaderCount(state) {
      return {
        ...state,
        loaderCount: state.loaderCount === 0 ? 0 : state.loaderCount - 1,
      };
    },
    setEventCustomizeDates(state, { payload }) {
      return {
        ...state,
        eventCustomizeDates: payload ? [...payload] : [],
      };
    },
    setGuestEventClient(state, { payload }) {
      return {
        ...state,
        guestEventClients: payload ? [...payload] : [],
      };
    },
    setCreateCalendarSuccess(state, { payload }) {
      return {
        ...state,
        createCalendarSuccess: payload,
      };
    },
    checkCreateEventAfterDelete(state, { payload }) {
      if (
        state.createCalendarSuccess?.id &&
        state.createCalendarSuccess?.id === payload.event_id
      ) {
        return {
          ...state,
          createCalendarSuccess: {},
        };
      }
    },
    setDataCalendarSuccess(state, { payload }) {
      return {
        ...state,
        dataCalendarSuccess: payload,
      };
    },
    setUrlMeet(state, { payload }) {
      return {
        ...state,
        urlMeet: payload,
      };
    },
    setUrlZoom(state, { payload }) {
      return {
        ...state,
        urlZoom: payload,
      };
    },
    // Handle for mobile
    setLoadingEvent(state, { payload }) {
      return {
        ...state,
        isLoadingEvent: payload,
      };
    },
    setLoadingSync(state, { payload }) {
      return {
        ...state,
        isLoadingSync: payload,
      };
    },
    setUpdateCalendarSuccess(state, { payload }) {
      return {
        ...state,
        updateCalendarSuccess: payload,
      };
    },
    resetDataCalendarCreation(state) {
      return {
        ...state,
        createCalendarSuccess: {},
        dataCalendarSuccess: {},
      };
    },
  },
  effects: {
    // *setStartAndEndTime(action, { put, call }) {
    //   yield put({ type: 'setStartAndEndTimeSuccess', payload: action.payload });
    // },
    *getListEventType(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      const res = yield EventRequest.getListEventType(action.payload);
      yield put({
        type: 'getListEventTypeSuccess',
        payload: res.body.data,
      });
      yield put({ type: 'decreaseLoaderCount' });
    },
    *getListPersonalEventType(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      const res = yield EventRequest.getListPersonalEventType(action.payload);
      yield put({
        type: 'getListPersonalEventTypeSuccess',
        payload: res.body.data,
      });
      yield put({ type: 'decreaseLoaderCount' });
    },
    *getListEventLocations(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      const res = yield EventRequest.getListEventLocations(action.payload);
      yield put({
        type: 'getListEventLocationsSuccess',
        payload: res.body.data,
      });
      yield put({ type: 'decreaseLoaderCount' });
    },
    *getListEventCategories(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      const res = yield EventRequest.getListEventCategories(action.payload);
      yield put({
        type: 'getListEventCategoriesSuccess',
        payload: res.body.data,
      });
      yield put({ type: 'decreaseLoaderCount' });
    },
    *getListEventBlockTime(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      const res = yield EventRequest.getListEventBlockTime(action.payload);
      yield put({
        type: 'getListEventBlockTimeSuccess',
        payload: res.body.data,
      });
      yield put({ type: 'decreaseLoaderCount' });
    },
    *getListEventMoveTime(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      const res = yield EventRequest.getListEventMoveTime(action.payload);
      yield put({
        type: 'getListEventMoveTimeSuccess',
        payload: res.body.data,
      });
      yield put({ type: 'decreaseLoaderCount' });
    },
    *updateEventType({ payload }, { call, put }) {
      const { eventTypeId } = payload;
      const { switchChange, ...res } = payload;

      yield put({ type: 'increaseLoaderCount' });
      yield put({
        type: 'setLoading',
        payload: true,
      });
      try {
        return yield EventRequest.updateEventType(res);
      } catch (error) {
        notify(error.response.body.message);
      } finally {
        yield put({ type: 'decreaseLoaderCount' });
        // reload if need
        yield put({
          type: 'setLoading',
          payload: false,
        });
        if (!switchChange) {
          history.push(`calendar-creation-success?event_id=${eventTypeId}`);
        }
      }
    },
    *generateOnceEventCode(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      yield put({
        type: 'setLoading',
        payload: true,
      });
      const res = yield EventRequest.generateOnceEventCode(action.payload);
      yield put({ type: 'decreaseLoaderCount' });
      yield put({
        type: 'setLoading',
        payload: false,
      });
      if (res.status === 201) {
        return res.body.data.code;
      }
      return null;
    },
    *getFreeTime(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      try {
        const res = yield EventRequest.getFreeTime(action.payload);
        // console.log('free time', res.body.data);
        yield put({
          type: 'CALENDAR_CREATION/setFreeTimes',
          payload: res.body.data,
        });
        return yield put({
          type: 'getFreeTimeSuccess',
          payload: res.body.data,
        });
      } catch (error) {
        handleError(error);
      } finally {
        yield put({ type: 'decreaseLoaderCount' });
      }
    },
    *getFreeTimeByGuest(action, { call, put }) {
      yield put({
        type: 'setLoading',
        payload: true,
      });
      yield put({ type: 'increaseLoaderCount' });
      const res = yield call(EventRequest.getFreeTimeByGuest, action.payload);
      yield put({ type: 'decreaseLoaderCount' });
      yield put({
        type: 'setLoading',
        payload: false,
      });
      return yield put({
        type: 'getFreeTimeSuccess',
        payload: res.body.data,
      });
    },
    *createEventType(action, { call, put }) {
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        const res = yield EventRequest.createEventType(action.payload);
        const { body } = res;
        history.push(`calendar-creation-success?event_id=${body.data.id}`);
      } catch (error) {
        notify(
          formatMessage({ id: 'i18n_message_error_get_calendar_by_provider' }),
        );
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *createEventCodeCopy(action, { call, put }) {
      const { payload } = action;
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        const res = yield EventRequest.createEventCodeCopy(payload);
      } catch (error) {
        console.log('error', error);
        // notify(
        //   formatMessage({ id: 'i18n_message_error_get_calendar_by_provider' }),
        // );
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *checkEventCode(action, { call, put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const res = yield EventRequest.checkEventCode(action.payload);
        if (action.callback && action.callback.func) {
          yield action.callback.func(res);
        }
        yield put({ type: 'decreaseLoaderCount' });
        return res;
      } catch (error) {
        if (action.callback.func) {
          yield action.callback.func(error.response);
        }
        yield put({ type: 'decreaseLoaderCount' });
        return error.response;
      }
    },
    *getUserByCode(action, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield EventRequest.getUserByCode(action.payload);
      yield put({ type: 'setLoading', payload: false });
      return yield put({
        type: 'getUserByCodeSuccess',
        payload: res.body.data,
      });
    },
    *getListFreeDay(action, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const res = yield call(EventRequest.getListFreeDay, action.payload);
      const sortDate =
        res.body && res.body.data
          ? res.body.data.sort(
              (a, b) => new Date(a.start_time) - new Date(b.start_time),
            )
          : [];
      yield put({ type: 'setLoading', payload: false });
      return yield put({
        type: 'getListFreeDaySuccess',
        payload: sortDate,
      });
    },
    *createSchedule(action, { call, put }) {
      const { nextStep, formatMessage, onCancel } = action.payload;
      try {
        const newPayload = {
          ...action.payload,
          nextStep: undefined,
          onCancel: undefined,
          formatMessage: undefined,
        };
        const res = yield EventRequest.createSchedule(newPayload);
        if (res.status === 200) {
          localStorage.setItem('calendar_id', res.body.data.calendar_id);
          yield put({
            type: 'createScheduleSuccess',
            payload: res.body.data,
          });
          nextStep();
        }
        if (res.status === 400) {
          notify(formatMessage({ id: 'i18n_this_time_already_booked' }));
        }
      } catch (error) {
        const { code, message } = error.response.body;
        if (message === 'time already in use') {
          notify(formatMessage({ id: 'i18n_this_time_already_booked' }));
        } else if (code === '2000') {
          notify(null, null, 'error', code, onCancel);
        } else {
          notify(formatMessage({ id: 'i18n_booking_failed' }));
        }
        return error.response;
      }
    },
    *getGuestCalendar(action, { call, put }) {
      const res = yield EventRequest.getGuestCalendar(action.payload);
      return yield put({
        type: 'getGuestCalendarSuccess',
        payload: res.body.data,
      });
    },
    *deleteEventType(action, { call, put }) {
      try {
        const res = yield EventRequest.deleteEventType(action.payload);
        const { body, status } = res;
        if (body.success || status === STATUS_CODE.success) {
          if (action.callback) {
            action.callback();
          }

          yield put({
            type: 'checkCreateEventAfterDelete',
            payload: {
              event_id: action.payload.eventTypeId,
            },
          });
        }
      } catch (err) {
        console.log('err: ', err);
        notify(formatMessage({ id: 'i18n_error_delete_event' }));
        return false;
      }
    },
    *getZoomURL(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      try {
        const newPayload = {
          ...action.payload,
          setUrlZoom: setUrlZoom,
        };
        delete newPayload.setUrlZoom;
        const res = yield EventRequest.getZoomURL(newPayload);
        const { setUrlZoom } = action.payload;
        if (res.body.status) {
          yield put({ type: 'setUrlZoom', payload: res.body.data.url });
          setUrlZoom(res.body.data.url);
        }
        yield put({ type: 'decreaseLoaderCount' });
        return res.body.data;
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
        notify('something wrong');
      }
    },
    *getDetailEventType({ payload }, { call, put }) {
      yield put({ type: 'AVAILABLE_TIME/setLoading', payload: true });

      try {
        const res = yield call(EventRequest.getDetailEventType, payload);
        if (!res.status) {
          notify(res.data.message);
          history.push('/');
        }
        // no need get data if is clone
        let members = [];
        if (!payload.isClone) {
          yield put.resolve({
            type: 'getTimeAvailable',
            payload: {
              event_id: payload.eventTypeId,
              is_manual_setting: res.body.data.is_manual_setting,
            },
          });

          if (res.body.data.client && res.body.data.client.length > 0) {
            members = res.body.data.client.map(member => {
              if (member.type !== 3) {
                const provider = member.type == 1 ? 'google' : 'microsoft';
                member.id = `${provider}-${member.email}`;
                member.provider = provider;
              }

              return {
                id: member.user_id || member.id,
                type: member.type,
                email: member.email,
                checked: !!member.status,
                provider: member.provider,
                user_id: member.user_id,
              };
            });
          }
        }

        // setCustomizeDayOnOff
        // no need set customie day on off if is clone
        if (!payload.isClone) {
          yield put({
            type: 'AVAILABLE_TIME/setCustomizeDayOnOff',
            payload: res.body.data.customize_on_off || [],
          });
        }

        yield put({
          type: 'CALENDAR_CREATION/setScheduleSetting',
          payload: res.body.data,
        });

        if (payload.isClone && res.body.data.priority_times) {
          res.body.data.priority_times = res.body.data.priority_times.map(
            (e, index) => {
              return {
                priority_end_time: e.priority_end_time,
                priority_start_time: e.priority_start_time,
                status: index + 1,
                is_delete: false,
                id: '',
              };
            },
          );
        }
        yield put({
          type: 'CALENDAR_CREATION/setTimeSetting',
          payload: res.body.data.priority_times,
        });

        const { user_avatar, user_id, user_name, user_company } = res.body.data;
        yield put({
          type: 'CALENDAR_CREATION/setUserIdCreate',
          payload: {
            avatar: user_avatar,
            id: user_id,
            name: user_name,
            company: user_company,
          },
        });
        yield put({
          type: 'CALENDAR_CREATION/setMessageSetting',
          payload: res.body.data,
        });
        yield put({
          type: 'BASIC_SETTING/setBasicSetting',
          payload: res.body.data,
        });
        yield put({
          type: 'SCHEDULE_SETTING/setState',
          payload: res.body.data,
        });
        yield put({
          type: 'TIME_SETTING/setState',
          payload: res.body.data.priority_times,
        });
        yield put({
          type: 'MESSAGE_SETTING/setState',
          payload: res.body.data,
        });

        yield put({ type: 'AVAILABLE_TIME/setLoading', payload: false });

        return members;
      } catch (error) {
        history.push('/');
        notify(error.response.body.message);
        return [];
      }
    },
    *getTimeAvailable({ payload }, { call, put }) {
      const res = yield EventRequest.getTimeAvailable(payload);

      const events = res.body.data.map(event => {
        const start = moment(event.start_time);
        return {
          ...event,
          start: event.start_time,
          end: event.end_time,
          srcId: event.id,
          dayStr: start.format(YYYYMMDD),
          thisDay: start.format(YYYYMMDD),
          recentAdded: true,
          overlap: true,
          color: null,
          custom_type: DATE_TIME_TYPE.default,
          is_auto_generated: !payload.is_manual_setting,
        };
      });

      return yield put({
        type: 'AVAILABLE_TIME/setCustomEvents',
        payload: events,
      });
    },
    *getGoogleMeetURL(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      try {
        const newPayload = {
          ...action.payload,
          setUrlMeet: setUrlMeet,
        };
        delete newPayload.setUrlMeet;
        const res = yield EventRequest.getGoogleMeetURL(newPayload);
        const { setUrlMeet } = newPayload;
        if (res.body.status) {
          yield put({ type: 'setUrlMeet', payload: res.body.data.url });
          setUrlMeet(res.body.data.url);
        }
        yield put({ type: 'decreaseLoaderCount' });
        return res.body.data;
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
        notify('something wrong');
      }
    },
    *updateAdvancedSetting(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      const res = yield EventRequest.updateAdvancedSetting(action.payload.data);
      yield put({
        type: 'updateAdvancedSettingSuccess',
        payload: res.body.data.data,
      });
      yield put({ type: 'decreaseLoaderCount' });
    },
    *getEventTypeFromGuest(action, { call, put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const res = yield EventRequest.getEventTypeFromGuest(action.payload);
        yield put({ type: 'decreaseLoaderCount' });
        if (res.status === 200) {
          return yield put({
            type: 'getEventTypeFromGuestSuccess',
            payload: {
              data: res.body.data.data,
              owner_name: res.body.data.owner_name,
              company: res.body.data.company,
            },
          });
        }
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
      }
    },
    *backToEventTypeList(action, { call, put }) {
      yield put({ type: 'increaseLoaderCount' });
      yield put({
        type: 'backToEventTypeListSuccess',
      });
      yield put({ type: 'decreaseLoaderCount' });
    },
    *setEventTemplate(action, { call, put }) {
      const { requestBody, name } = action.payload;
      yield put({ type: 'increaseLoaderCount' });
      yield put({
        type: 'setLoading',
        payload: true,
      });
      try {
        const res = yield EventRequest.setEventTemplate(requestBody);
        if (res.status === 200) {
          yield put({
            type: 'setEventTemplateSuccess',
            payload: res.body.data,
          });
        }
        yield put({ type: 'decreaseLoaderCount' });

        if (name) history.push('/event');
        return yield put({
          type: 'setLoading',
          payload: false,
        });
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
        return yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *updateEventTemplate(action, { call, put }) {
      const { requestBody, name } = action.payload;
      yield put({
        type: 'setLoading',
        payload: true,
      });
      try {
        yield put({ type: 'increaseLoaderCount' });
        const res = yield EventRequest.updateEventTemplate(requestBody);
        if (name)
          message.success(
            formatMessage({ id: 'i18n_update_template_successfully' }),
          );

        yield put({ type: 'decreaseLoaderCount' });
        return yield put({
          type: 'setLoading',
          payload: false,
        });
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
        return yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *getEventTemplate(action, { call, put }) {
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        yield put({ type: 'increaseLoaderCount' });
        const res = yield EventRequest.getEventTemplate(action.payload);
        yield put({ type: 'decreaseLoaderCount' });
        if (res.status === 200) {
          return yield put({
            type: 'getEventTemplateSuccess',
            payload: res.body.data,
          });
        }
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },

    *getEventTemplateById(action, { call, put }) {
      const { id } = action;
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        const res = yield EventRequest.getEventTemplateById(id);
        if (res.status === 200) {
          yield put({
            type: 'BASIC_SETTING/setBasicSetting',
            payload: res.body.data,
          });
          yield put({
            type: 'SCHEDULE_SETTING/setState',
            payload: res.body.data,
          });
          yield put({
            type: 'TIME_SETTING/setState',
            payload: res.body.data.priority_times,
          });
          yield put({
            type: 'MESSAGE_SETTING/setState',
            payload: res.body.data,
          });
        }
      } catch (error) {
        console.log('err', error);
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },

    *createEventTypeByTemplate(action, { call, put }) {
      yield put({
        type: 'setLoading',
        payload: true,
      });
      yield put({ type: 'increaseLoaderCount' });
      const newPayload = {
        ...action.payload,
      };
      const res = yield EventRequest.createEventType(newPayload);
      yield put({ type: 'decreaseLoaderCount' });
      if (res.status === 200) {
        const onceCode = yield EventRequest.generateOnceEventCode({
          event_id: res.body.data.id,
        });
        if (onceCode.status === 201) {
          setTimeout(() => {
            copyText(
              `${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode.body.data.code}&once=true`,
            );
          }, 0);
        }
        history.push('/event');
      }

      message.success('リンクをコピーしました');
      yield put({
        type: 'setLoading',
        payload: false,
      });
    },

    *updateCurrentEvent(action, { put }) {
      yield put({
        type: 'updateCurrentEventSuccess',
        payload: action.payload,
      });
    },
    *getAllBookedSchedule(action, { put, call }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const res = yield call(
          EventRequest.getAllBookedSchedule,
          action.payload,
        );
        yield put({
          type: 'getAllBookedScheduleSuccess',
          payload: res.body.data,
        });
        yield put({ type: 'decreaseLoaderCount' });
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
      }
    },
    *getCalendarByCode(action, { put, call }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const res = yield call(EventRequest.getCalendarByCode, action.payload);
        console.log('res==========================================', res);
        yield put({
          type: 'getAllBookedScheduleGuestSuccess',
          payload: res.body.data,
        });
      } catch (error) {
      } finally {
        yield put({ type: 'decreaseLoaderCount' });
      }
    },

    *getAllBookedScheduleByGuest(action, { put, call }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const res = yield call(
          EventRequest.getAllBookedScheduleByGuest,
          action.payload,
        );
        yield put({
          type: 'getAllBookedScheduleSuccess',
          payload: res.body.data,
        });
      } catch (error) {
      } finally {
        yield put({ type: 'decreaseLoaderCount' });
      }
    },
    *getListDefaultFreeDayTemplate(action, { call, put }) {
      return yield put({
        type: 'getListFreeDaySuccess',
        payload: action.payload,
      });
    },
    *getDateTimesByEvent(action, { put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const { status, body } = yield EventRequest.getDateTimesByEvent(
          action.payload,
        );
        if (status === 200) {
          yield put({
            type: 'setListDateTimeByEvent',
            payload: body.data.datetimes,
          });
        }
      } catch (error) {
      } finally {
        yield put({ type: 'decreaseLoaderCount' });
      }
    },
    *getListFreedayByEvent(action, { put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const { status, body } = yield EventRequest.getDateTimesByEvent(
          action.payload,
        );
        if (status === 200) {
          yield put({
            type: 'getListFreeDaySuccess',
            payload: body.data.datetimes,
          });
        }
      } catch (error) {
      } finally {
        yield put({ type: 'decreaseLoaderCount' });
      }
    },
    *setCurrentTemplate(action, { call, put }) {
      return yield put({
        type: 'setCurrentTemplateSuccess',
        payload: action.payload,
      });
    },
    *clearDetailEventType(action, { call, put }) {
      return yield put({
        type: 'clearDetailEventTypeSuccess',
        payload: {},
      });
    },
    *setBookedList(action, { call, put }) {
      const data = action.payload.setBooked();
      return yield put({
        type: 'setBookedListSuccess',
        payload: data,
      });
    },

    *updateIsSelectEvent(action, { put }) {
      return yield put({
        type: 'updateIsSelectEventSuccess',
        payload: action.payload,
      });
    },

    *syncGoogleCalendar(action, { put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const res = yield EventRequest.getGoogleCalendar(action.payload);
        yield put({ type: 'decreaseLoaderCount' });
        return true;
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
        return false;
      }
    },

    *syncGoogleCalendarByGuest(action, { put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const { status, body } = yield EventRequest.getGoogleCalendarByGuest(
          action.payload,
        );
        yield put({ type: 'decreaseLoaderCount' });
        return true;
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
        return false;
      }
    },

    *syncMicrosoftCalendar(action, { put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const res = yield EventRequest.getMicrosoftCalendar(action.payload);
        yield put({ type: 'decreaseLoaderCount' });
        return true;
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
        return false;
      }
    },

    *syncMicrosoftCalendarByGuest(action, { put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        const { status, body } = yield EventRequest.getMicrosoftCalendarByGuest(
          action.payload,
        );
        yield put({ type: 'decreaseLoaderCount' });
        return true;
      } catch (error) {
        yield put({ type: 'decreaseLoaderCount' });
        return false;
      }
    },
    *getCalendarByProvider({ payload }, { call, put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        yield put({
          type: 'setLoading',
          payload: true,
        });

        const { body } = yield EventRequest.getCalendarByProvider(payload);
        const events = body.result.events || body.result;
        if (events.length !== 0) {
          const listEvents = events.map(event => {
            const startTime = moment(event.start_time);
            const endTime = moment(event.end_time);

            return {
              id: event.id,
              start_time: startTime.format(YYYYMMDDTHHmm),
              end_time: endTime.format(YYYYMMDDTHHmm),
              option: payload.member.option,
              name: event.summary,
              user_id: payload.member.id,
              color: payload.member.color,
            };
          });

          yield put({
            type: 'AVAILABLE_TIME/setBookedEvents',
            payload: { listEvents, userId: payload.member.id },
          });
        }
      } catch (error) {
        notify(
          formatMessage({
            id: 'i18n_message_error_get_calendar_by_provider',
          }),
        );
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
        yield put({ type: 'decreaseLoaderCount' });
      }
    },
    *getAllBookedScheduleByUser({ payload }, { call, put }) {
      const { user_id, color, option, startTime, endTime } = payload;
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });

        yield put({ type: 'increaseLoaderCount' });

        const { status, body } = yield EventRequest.getAllBookedScheduleByUser({
          user_id: user_id,
          need_sync: true,
          startTime,
          endTime,
        });

        const listEvents = body.result.result.map(event => ({
          ...event,
          user_id: user_id,
          color: color,
          option: option,
          end_time: moment(event.start_time)
            .add(event.block_number, 'm')
            .format(YYYYMMDDTHHmm),
        }));

        yield put({
          type: 'AVAILABLE_TIME/setBookedEvents',
          payload: { listEvents, userId: user_id },
        });
      } catch (e) {
        console.log(e);
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
        yield put({ type: 'decreaseLoaderCount' });
      }
    },
    *setShowScheduleByUser(action, { put }) {
      return yield put({
        type: 'setShowScheduleByUserSuccess',
        payload: action.payload,
      });
    },
    *clearExternalBookedScheduler(action, { put }) {
      return yield put({
        type: 'clearExternalBookedSchedulerSuccess',
      });
    },
    *restoreChangedBookedSchedule(action, { put }) {
      return yield put({
        type: 'restoreChangedBookedScheduleSuccess',
      });
    },
    *restoreBookedSchedule(action, { put }) {
      return yield put({
        type: 'restoreBookedScheduleSuccess',
      });
    },
    *setListFreeDay(action, { call, put }) {
      yield put({
        type: 'getListFreeDaySuccess',
        payload: action.payload,
      });
    },
    *addBookedSchedule(action, { put }) {
      yield put({
        type: 'appendBookedSchedule',
        payload: action.payload,
      });
    },
    *getEventCustomizeDates(action, { put, call }) {
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        const res = yield call(
          EventRequest.getEventCustomizeDates,
          action.payload,
        );
        yield put({
          type: 'setEventCustomizeDates',
          payload: res.body.result.customize_on_off,
        });
      } catch (error) {
        notify(
          formatMessage({
            id: 'i18n_message_error_get_calendar_by_provider',
          }),
        );
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *getGuestEventClient(action, { put, call }) {
      try {
        yield put({ type: 'setLoading', payload: true });
        const res = yield call(
          EventRequest.getGuestEventClient,
          action.payload,
        );
        yield put({
          type: 'setGuestEventClient',
          payload: res.body.data,
        });

        return res.body.data;
      } catch (error) {
        notify(
          formatMessage({
            id: 'i18n_message_error_get_calendar_by_provider',
          }),
        );
        history.push('/invalid-url');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *getNotifyAskCalendar(action, { put, call }) {
      try {
        yield put({ type: 'setLoading', payload: true });
        const res = yield call(EventRequest.getNotifyAskCalendar);
        yield put({
          type: 'setListAskCalendar',
          payload: res.body.data,
        });
      } catch (error) {
        console.log(error);
        // notify(
        //   formatMessage({
        //     id: 'i18n_message_error_get_calendar_by_provider',
        //   }),
        // );
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *updateAskNotifyCalendar(action, { put, call }) {
      const { payload, callback } = action;
      try {
        yield put({ type: 'setLoading', payload: true });
        yield call(EventRequest.updateNotifyAskCalendar, payload);
        callback?.();
      } catch (error) {
        console.log(error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *updateNameCalendar(action, { put, call }) {
      const { payload } = action;
      try {
        yield put({ type: 'setLoading', payload: true });
        yield call(EventRequest.updateNameCalendar, payload);
      } catch (error) {
        history.push('/');
        notify(error.response.body.message);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *fetchEventForCopy(action, { put, call }) {
      const { payload } = action;
      yield put({ type: 'setLoading', payload: true });
      const { startTime, endTime } = createTimeAsync(null, 28);

      try {
        const res = yield call(EventRequest.getDetailEventType, payload);
        const { data } = res.body;
        yield put.resolve({
          type: 'getFreeTimeByGuest',
          payload: { event_code: data.event_code },
        });

        yield put({
          type: 'setEventCustomizeDates',
          payload: data.customize_on_off,
        });

        yield put.resolve({
          type: 'getListFreedayByEvent',
          payload: data.id,
        });
        // get all A schedule calendar
        // getGuestEventClient
        yield put({
          type: 'getGuestEventClient',
          payload: {
            event_code: data.event_code,
            user_code: data.user.code,
            need_sync: true,
            start: startTime,
            end: endTime,
          },
        });

        yield put({
          type: 'setCopyEvent',
          payload: data,
        });
      } catch (error) {
        console.log(error);
        history.push('/');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // Handle for mobile
    *getListEventTypeMobile(action, { call, put }) {
      // console.log('action: ', action);
      try {
        yield put({ type: 'setLoadingEvent', payload: true });

        const res = yield EventRequest.getListEventType(action.payload);

        yield put({
          type: 'getListEventTypeSuccess',
          payload: res.body.data,
        });
      } catch (e) {
        console.log(e);
      } finally {
        yield put({ type: 'setLoadingEvent', payload: false });
      }
    },
    *createCalendarMobile(action, { call, put }) {
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        const res = yield EventRequest.createEventType(action.payload);
        const { body } = res;
        yield put({ type: 'setCreateCalendarSuccess', payload: body.data });
      } catch (error) {
        notify(
          formatMessage({ id: 'i18n_message_error_get_calendar_by_provider' }),
        );
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *getDetailEventTypeMobile({ payload }, { call, put }) {
      yield put({ type: 'AVAILABLE_TIME/setLoading', payload: true });

      try {
        const res = yield EventRequest.getDetailEventType(payload);
        const { body } = res;
        if (!body.status) {
          notify(res.data.message);
          history.push('/');
        }
        yield put({ type: 'setDataCalendarSuccess', payload: body.data });
        // no need get data if is cloned
        let members = [];
        if (payload.isEdit) {
          yield put.resolve({
            type: 'getTimeAvailable',
            payload: {
              event_id: payload.eventTypeId,
              is_manual_setting: res.body.data.is_manual_setting,
            },
          });

          if (res.body.data.client && res.body.data.client.length > 0) {
            members = res.body.data.client.map(member => {
              if (member.type !== 3) {
                const provider = member.type == 1 ? 'google' : 'microsoft';
                member.id = `${provider}-${member.email}`;
                member.provider = provider;
              }

              return {
                id: member.user_id || member.id,
                type: member.type,
                email: member.email,
                checked: !!member.status,
                provider: member.provider,
                user_id: member.user_id,
              };
            });
          }
        }

        yield put({ type: 'AVAILABLE_TIME/setLoading', payload: false });

        return members;
      } catch (error) {
        history.push('/');
        notify(error.response.body.message);
      }
    },
    *createScheduleMobile(action, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const res = yield EventRequest.createSchedule(action.payload);
        const { body } = res;
        if (!body.status) {
          notify(res.message);
        }
        notify('予約が完了しました', 'bgWhite', 'success');
        yield put({ type: 'setLoading', payload: false });
      } catch (error) {
        notify('予約が失敗しました');
      }
    },
    *inviteParticipant(action, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true });
        const res = yield EventRequest.inviteParticipant(action.payload);
        const { body } = res;
        if (body.status) {
          notify(
            formatMessage({ id: 'i18n_invite_member_success' }),
            'bgWhite',
            'success',
          );
          history.push(action.payload.isPc ? '/pc/calendar' : '/calendar');
        }
      } catch (error) {
        notify(formatMessage({ id: 'i18n_invite_member_error' }));
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *getCalendarByProviderMobile({ payload }, { call, put }) {
      try {
        yield put({ type: 'increaseLoaderCount' });
        yield put({
          type: 'setLoading',
          payload: true,
        });

        const { body } = yield EventRequest.getCalendarByProvider(payload);
        const events = body.result.events || body.result;
        if (events.length !== 0) {
          const listEvents = events.map(event => {
            const startTime = moment(event.start_time);
            const endTime = moment(event.end_time);

            return {
              id: event.id,
              start_time: startTime.format(YYYYMMDDTHHmm),
              end_time: endTime.format(YYYYMMDDTHHmm),
              option: payload.member.option,
              name: event.summary,
              user_id: payload.member.id,
              color: payload.member.color,
            };
          });

          yield put({
            type: 'AVAILABLE_TIME/setSPBookedEvents',
            payload: { listEvents, userId: payload.member.id },
          });
        }
      } catch (error) {
        notify(
          formatMessage({
            id: 'i18n_message_error_get_calendar_by_provider',
          }),
        );
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
        yield put({ type: 'decreaseLoaderCount' });
      }
    },
    *addEmailInvites(action, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true });
        const res = yield EventRequest.addEmailInvites(action.payload);
        const { body } = res;
        notify(
          formatMessage({ id: 'i18n_add_contact_success' }),
          'bgWhite',
          'success',
        );
        yield put({
          type: 'MASTER/getHistoryInvitation',
          payload: {
            pageSize: 20,
            page: 1,
          },
        });
      } catch (error) {
        notify(formatMessage({ id: 'i18n_invite_member_error' }));
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *getAllBookedScheduleByUserMobile({ payload }, { call, put }) {
      const { user_id, color, option, startTime, endTime } = payload;
      try {
        yield put({ type: 'setLoadingSync', payload: true });

        const { status, body } = yield EventRequest.getAllBookedScheduleByUser({
          user_id: user_id,
          need_sync: true,
          startTime,
          endTime,
        });

        const listEvents = body.result.result.map(event => ({
          ...event,
          title: event.name ?? event.holiday_name,
          user_id: user_id,
          color: color,
          option: option,
          end_time: !event.block_number
            ? moment(event.end_time).format(YYYYMMDDTHHmm)
            : moment(event.start_time)
                .add(event.block_number, 'm')
                .format(YYYYMMDDTHHmm),
          text_color: '#333333',
          ...(!event.block_number && { allDay: true }),
        }));

        yield put({
          type: 'AVAILABLE_TIME/setBookedEventsMobile',
          payload: { listEvents, userId: user_id },
        });
      } catch (e) {
        console.log(e);
      } finally {
        yield put({ type: 'setLoadingSync', payload: false });
      }
    },
    *updateTimeAvailable(action, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true });
        const res = yield EventRequest.updateTimeAvailable(action.payload);
      } catch (error) {
        notify('更新が失敗しました');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *updateCalendarMobile(action, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true });
        const res = yield EventRequest.updateCalendar(action.payload);
        const { body } = res;
        yield put({ type: 'setUpdateCalendarSuccess', payload: body.status });
      } catch (error) {
        notify('更新が失敗しました');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    *updateEventCalendarMobile(action, { call, put }) {
      try {
        yield put({ type: 'setLoading', payload: true });
        const res = yield EventRequest.updateEventCalendar(action.payload);
        const { body } = res;
        yield put({
          type: 'setUpdateEventCalendarSuccess',
          payload: body.status,
        });
        notify('更新が完了しました', 'bgWhite', 'success');
      } catch (error) {
        notify('更新が失敗しました');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },
};
