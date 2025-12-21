import { findBusyDays, profileFromStorage } from '@/commons/function';
import {
  DATE_TIME_TYPE,
  EVENT_RELATIONSHIP_TYPE,
  YYYYMMDD,
  YYYYMMDDTHHmm,
} from '@/constant';
import eventRequest from '@/services/eventRequest';
import EventBus, { EventBusNames, onNewBlock } from '@/util/eventBus';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { history, useIntl, useLocation } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import {
  convertBookedEvents,
  convertUserEvents,
  flatDataEvent,
} from './calendarUtils';

// Function to get Sunday of current week
const getSundayOfCurrentWeek = () => {
  const today = moment();
  const dayOfWeek = today.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return today.subtract(dayOfWeek, 'days').startOf('day');
};

const initState = {
  firstDay: undefined,
  displayEvents: [],
  newBlockEvents: [],
  userEvents: [],
  voters: [],
  loadingEvent: true,
  calendarKey: 0,
  initialDate: getSundayOfCurrentWeek().toDate(),
};

const DATE_FORMAT = 'DD/MM HH:mm';

export default function useCalendarPreview(props) {
  const [selected, setSelect] = useState({});
  const [expanded, setExpanded] = useState(false);

  // Allow override initialDate via props
  const getInitialDate = () => {
    if (props.startFromToday) {
      return moment()
        .startOf('day')
        .toDate();
    }
    return getSundayOfCurrentWeek().toDate();
  };

  const [state, setState] = useState({
    ...initState,
    firstDay: moment().isoWeekday(),
    initialDate: getInitialDate(),
  });
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [displayEvents, setDisplayEvents] = useState([]);

  const { currentStartDate } = props.availableTime;
  const intl = useIntl();
  const location = useLocation();
  const { state: locationState } = location;
  const { formatMessage } = intl;

  const calendarRef = props.calendarRef || useRef(null);
  const fetchEventRef = useRef(null);
  const isSelectMonthRef = useRef(false);
  const isSelectYearRef = useRef(false);
  const userEventsRef = useRef([]);
  const displayEventsRef = useRef([]);
  const eventId = Number(history.location.query.idEvent) || null;
  const isClone = Number(history.location.query.clone) || 0;

  const profile = profileFromStorage();

  useEffect(() => {
    EventBus.addEventListener(EventBusNames.DROP_BLOCK_TIME, e => {
      const { detail: payload } = e;
      const event = payload.event._def.extendedProps;
      const eventStartTime = moment(event.start_time).format(YYYYMMDDTHHmm);
      const eventEndTime = moment(event.end_time).format(YYYYMMDDTHHmm);

      const milliseconds = payload.delta.milliseconds;
      const days = payload.delta.days;

      const newStart = moment(event.start_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');
      const newStartTime = newStart.format(YYYYMMDDTHHmm);
      const newEnd = moment(event.end_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');
      const newEndTime = newEnd.format(YYYYMMDDTHHmm);

      const thisDay = newStart.format(YYYYMMDD);
      const day_of_week = newStart.isoWeekday();

      setState(prev => {
        const displayEvents = [...prev.displayEvents];
        const newBlockEvents = [...prev.newBlockEvents];
        const displayEventIndex = displayEvents.findIndex(
          e => e.srcId == event.srcId,
        );

        if (displayEventIndex !== -1 && displayEventIndex !== undefined) {
          displayEvents[displayEventIndex].start_time = newStartTime;
          displayEvents[displayEventIndex].start = newStartTime;
          displayEvents[displayEventIndex].end_time = newEndTime;
          displayEvents[displayEventIndex].end = newEndTime;
          displayEvents[displayEventIndex].thisDay = thisDay;
          displayEvents[displayEventIndex].dayStr = thisDay;
          displayEvents[displayEventIndex].day_of_week = day_of_week;
        }

        const eventIndex = newBlockEvents.findIndex(
          e =>
            moment(e.start_time).format(YYYYMMDDTHHmm) == eventStartTime &&
            moment(e.end_time).format(YYYYMMDDTHHmm) == eventEndTime,
        );

        const newEventIndex = newBlockEvents.findIndex(
          e =>
            moment(e.start_time).format(YYYYMMDDTHHmm) == newStartTime &&
            moment(e.end_time).format(YYYYMMDDTHHmm) == newEndTime,
        );

        if (newEventIndex !== -1 && newEventIndex !== undefined) {
          newBlockEvents[newEventIndex].checked = true;

          if (eventIndex !== -1 && eventIndex !== undefined) {
            newBlockEvents[eventIndex].checked = false;
          }
        }

        if (eventIndex !== -1 && newEventIndex === -1) {
          newBlockEvents[eventIndex].start_time = newStartTime;
          newBlockEvents[eventIndex].start = newStartTime;
          newBlockEvents[eventIndex].end_time = newEndTime;
          newBlockEvents[eventIndex].end = newEndTime;
          newBlockEvents[eventIndex].thisDay = thisDay;
          newBlockEvents[eventIndex].dayStr = thisDay;
          newBlockEvents[eventIndex].day_of_week = day_of_week;
        }

        return {
          ...prev,
          displayEvents,
          newBlockEvents,
        };
      });
    });
  }, []);

  useEffect(() => {
    EventBus.addEventListener(EventBusNames.DRAG_STOP_BLOCK_TIME, e => {
      const { detail: payload } = e;
      const event = payload.event._def.extendedProps;
      const eventStartTime = moment(event.start_time).format(YYYYMMDDTHHmm);
      const eventEndTime = moment(event.end_time).format(YYYYMMDDTHHmm);

      const milliseconds = payload.delta.milliseconds;
      const days = payload.delta.days;

      const newStart = moment(event.start_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');
      const newStartTime = newStart.format(YYYYMMDDTHHmm);
      const newEnd = moment(event.end_time)
        .add(milliseconds, 'milliseconds')
        .add(days, 'days');
      const newEndTime = newEnd.format(YYYYMMDDTHHmm);

      const thisDay = newStart.format(YYYYMMDD);
      const day_of_week = newStart.isoWeekday();

      setState(prev => {
        const displayEvents = [...prev.displayEvents];
        const newBlockEvents = [...prev.newBlockEvents];
        const displayEventIndex = displayEvents.findIndex(
          e => e.srcId == event.srcId,
        );

        if (displayEventIndex !== -1 && displayEventIndex !== undefined) {
          displayEvents[displayEventIndex].start_time = newStartTime;
          displayEvents[displayEventIndex].start = newStartTime;
          displayEvents[displayEventIndex].end_time = newEndTime;
          displayEvents[displayEventIndex].end = newEndTime;
          displayEvents[displayEventIndex].thisDay = thisDay;
          displayEvents[displayEventIndex].dayStr = thisDay;
          displayEvents[displayEventIndex].day_of_week = day_of_week;
        }

        const eventIndex = newBlockEvents.findIndex(
          e =>
            moment(e.start_time).format(YYYYMMDDTHHmm) == eventStartTime &&
            moment(e.end_time).format(YYYYMMDDTHHmm) == eventEndTime,
        );

        const newEventIndex = newBlockEvents.findIndex(
          e =>
            moment(e.start_time).format(YYYYMMDDTHHmm) == newStartTime &&
            moment(e.end_time).format(YYYYMMDDTHHmm) == newEndTime,
        );

        if (newEventIndex !== -1 && newEventIndex !== undefined) {
          newBlockEvents[newEventIndex].checked = true;

          if (eventIndex !== -1 && eventIndex !== undefined) {
            newBlockEvents[eventIndex].checked = false;
          }
        }

        if (eventIndex !== -1 && newEventIndex === -1) {
          newBlockEvents[eventIndex].start_time = newStartTime;
          newBlockEvents[eventIndex].start = newStartTime;
          newBlockEvents[eventIndex].end_time = newEndTime;
          newBlockEvents[eventIndex].end = newEndTime;
          newBlockEvents[eventIndex].thisDay = thisDay;
          newBlockEvents[eventIndex].dayStr = thisDay;
          newBlockEvents[eventIndex].day_of_week = day_of_week;
        }

        return {
          ...prev,
          displayEvents,
          newBlockEvents,
        };
      });
    });
  }, []);

  useEffect(() => {
    const unCheckedEventIds = state.newBlockEvents
      .filter(item => !item.checked)
      .map(item => item.srcId);

    const seen = new Set();
    const listNewEvents = flatDataEvent(props.listNewEvents || {});
    // console.log('props.listNewEvents: ', listNewEvents);
    // console.log('state.userEvents: ', state.userEvents);
    // console.log('state.displayEvents: ', state.displayEvents);
    // console.log('state.newBlockEvents: ', state.newBlockEvents);

    let data = [
      ...(state.userEvents || []),
      ...(state.displayEvents || []),
      ...(state.newBlockEvents || []),
      ...(listNewEvents || []),
      // { id: Date.now(), srcId: Date.now() },
    ]
      .filter(item => item && !unCheckedEventIds.includes(item.srcId))
      .filter(item => {
        if (
          (!item.recentAdded && !item.is_auto_generated) ||
          (item.recentAdded && item.fromEdit && item.checked)
        ) {
          if (item.randomId) {
            if (seen.has(item.randomId)) {
              return false;
            } else {
              seen.add(item.randomId);
              return true;
            }
          } else {
            return true;
          }
        }

        if (item.recentAdded && item.checked === false) {
          return false;
        }

        if (item.is_auto_generated && item.checked === undefined) {
          return false;
        }

        const startTime = moment(item.start_time).format(DATE_FORMAT);
        const endTime = moment(item.end_time).format(DATE_FORMAT);
        const key = `${startTime}-${endTime}`;

        if (seen.has(item.srcId)) {
          return false;
        } else {
          seen.add(item.srcId);
          if (seen.has(key)) {
            return false;
          } else {
            seen.add(key);
            return true;
          }
        }
      });

    if (props.votingEvents && props.votingEvents.length > 0) {
      props.votingEvents.forEach(item => {
        const existVote = data.find(
          x =>
            x.srcId == item.srcId &&
            moment(x.start_time).format(DATE_FORMAT) ==
              moment(item.start_time).format(DATE_FORMAT) &&
            moment(x.end_time).format(DATE_FORMAT) ==
              moment(item.end_time).format(DATE_FORMAT),
        );
        if (!existVote) {
          data.push(item);
        }
      });
    }

    // console.log('data: ', data);
    // return data;
    setDisplayEvents(data);
  }, [
    state.userEvents,
    state.displayEvents,
    state.newBlockEvents,
    props.votingEvents,
    props.listNewEvents,
    state.refresh,
  ]);

  useEffect(() => {
    EventBus.addEventListener(EventBusNames.CHECK_GENERATE_EVENTS, e => {
      // const unCheckedEvents = Object.entries(e.detail || {})
      //   .map(([key, value]) => {
      //     return value.filter(item => !item.checked);
      //   })
      //   .flat();

      const newBlockEvents = [];
      const propsListNewEvents = props.listNewEvents || {};
      const flatData = Object.entries(e.detail || {})
        .map(([key, value]) => {
          return value;
          // .filter(item => item.checked);
        })
        .flat();

      const userEvents = userEventsRef.current || state.userEvents;
      let displayEvents = displayEventsRef.current || state.displayEvents;

      flatData.forEach(item => {
        const existEventIndex = userEvents?.findIndex(
          x =>
            x.srcId == item.srcId &&
            moment(x.start_time).format(DATE_FORMAT) ==
              moment(item.start_time).format(DATE_FORMAT) &&
            moment(x.end_time).format(DATE_FORMAT) ==
              moment(item.end_time).format(DATE_FORMAT),
        );
        if (existEventIndex === -1) {
          newBlockEvents.push(item);
        } else {
          userEvents[existEventIndex].checked = item.checked;
        }

        if (eventId) {
          const existPropsEventIndex = propsListNewEvents[
            item.thisDay
          ]?.findIndex(x => {
            return (
              moment(x.start_time).format(DATE_FORMAT) ==
                moment(item.start_time).format(DATE_FORMAT) &&
              moment(x.end_time).format(DATE_FORMAT) ==
                moment(item.end_time).format(DATE_FORMAT)
            );
          });
          if (
            existPropsEventIndex !== -1 &&
            existPropsEventIndex !== undefined
          ) {
            propsListNewEvents[item.thisDay][existPropsEventIndex].checked =
              item.checked;
          }
        }

        const existDisplayEventIndex = displayEvents?.findIndex(x => {
          return (
            x.recentAdded &&
            moment(x.start_time).format(DATE_FORMAT) ==
              moment(item.start_time).format(DATE_FORMAT) &&
            moment(x.end_time).format(DATE_FORMAT) ==
              moment(item.end_time).format(DATE_FORMAT)
          );
        });
        if (
          existDisplayEventIndex !== -1 &&
          existDisplayEventIndex !== undefined
        ) {
          displayEvents[existDisplayEventIndex].checked = item.checked;
        }
      });

      if (eventId) {
        props.setListNewEvents?.(propsListNewEvents);
      }

      displayEvents = displayEvents.filter(item => {
        if (!item.recentAdded && !item.is_auto_generated) {
          return true;
        }

        const exist = flatData.find(x => {
          return (
            x.recentAdded &&
            moment(x.start_time).format(DATE_FORMAT) ==
              moment(item.start_time).format(DATE_FORMAT) &&
            moment(x.end_time).format(DATE_FORMAT) ==
              moment(item.end_time).format(DATE_FORMAT)
          );
        });

        return !!exist;
      });

      displayEventsRef.current = displayEvents;

      setState(prev => ({
        ...prev,
        newBlockEvents,
        userEvents,
        displayEvents,
      }));
    });
  }, [props.listEvents]);

  const showExpandRow = useMemo(() => {
    if (!calendarRef.current) return false;
    const calendar = calendarRef.current.getApi();

    const res = findBusyDays(
      displayEvents,
      calendar.view.currentStart,
      calendar.view.currentEnd,
    );
    return res?.find(x => x.count > 2);
  }, [displayEvents]);

  useEffect(() => {
    if (locationState?.event && locationState?.startDate) {
      const event = locationState.event;
      const startDate = locationState.startDate;

      // props.onAddEvent(info, props.blockNumber);

      props.setListNewEvents?.(listNewEvents => {
        if (listNewEvents[startDate]) {
          listNewEvents[startDate].push({
            ...event,
          });
        } else {
          listNewEvents[startDate] = [
            {
              ...event,
            },
          ];
        }

        return listNewEvents;
      });
    }
  }, [locationState]);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  useEffect(() => {
    if (currentStartDate && calendarRef && calendarRef.current) {
      fetchBookedEvents();
    }
  }, [currentStartDate, calendarRef]);

  const fetchBookedEvents = async () => {
    setState(prev => ({ ...prev, loadingEvent: true }));
    const calendar = calendarRef.current.getApi();

    let startTime = moment(calendar.view.currentStart);
    let endTime = moment(calendar.view.currentEnd);

    // if (isSelectMonthRef.current) {
    //   startTime = startTime.subtract(1, 'month');
    //   endTime = endTime.subtract(1, 'month');
    // }

    startTime = startTime.format(`YYYY-MM-DD`);
    endTime = endTime.format(`YYYY-MM-DD`);

    try {
      const { status, body } = await eventRequest.getAllBookedScheduleByUser({
        user_id: profile.id,
        need_sync: true,
        startTime,
        endTime,
      });

      const listEvents = convertBookedEvents(profile.id, body?.result?.result);

      if (locationState?.event) {
        const existEvent = listEvents.find(x => x.srcId);
        if (!existEvent) {
          listEvents.push(locationState.event);
        }
      }

      displayEventsRef.current = listEvents;

      setState(prev => ({
        ...prev,
        displayEvents: listEvents,
        loadingEvent: false,
        calendarKey: prev.calendarKey + 1,
      }));
    } catch (error) {
      console.log('error: ', error);
      setState(prev => ({
        ...prev,
        displayEvents: [],
        loadingEvent: false,
        calendarKey: prev.calendarKey + 1,
      }));
    }
  };

  const delayFetchBookedEvents = async () => {
    if (fetchEventRef.current) {
      clearTimeout(fetchEventRef.current);
    }
    fetchEventRef.current = setTimeout(() => {
      fetchBookedEvents();
    }, 1000);
  };

  const fetchEventTypes = async () => {
    try {
      const res = await eventRequest.getListEventType({
        relationship_type: EVENT_RELATIONSHIP_TYPE.vote,
        pageSize: 10,
        page: 1,
        has_pagination: false,
      });
      const listEventType = res.body?.data?.data || [];
      let { flatDataEvent, voters } = convertUserEvents(listEventType);

      userEventsRef.current = flatDataEvent;

      if (eventId) {
        flatDataEvent = flatDataEvent.map((item, index) => {
          if (item.id == eventId && !isClone) {
            item.recentAdded = true;
            item.fromEdit = true;
            item.randomId = Date.now() + index;
            item.checked = true;
            item.overlap = true;
            item.editable = true;
          }
          return item;
        });
      }

      let newBlockEvents = [];

      if (isClone && eventId) {
        const blocks = flatDataEvent.filter(e => e.id == eventId);
        const customEventsObjFiltered = blocks.reduce((acc, event) => {
          const date = moment(event.start_time).format('YYYY-MM-DD');
          if (moment(date, 'YYYY-MM-DD', true).isValid()) {
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push({
              id: moment(event.start_time).format('YYYYMMDDTHHmm'),
              srcId: event.event_id || uuidv4(),
              title: formatMessage({ id: 'i18n_votes' }),
              event_id: event?.id ?? null,
              start: moment(event.start_time).format(YYYYMMDDTHHmm),
              start_time: moment(event.start_time).format(YYYYMMDDTHHmm),
              end: moment(event.end_time).format(YYYYMMDDTHHmm),
              end_time: moment(event.end_time).format(YYYYMMDDTHHmm),
              thisDay: moment(date).format(YYYYMMDD),
              dayStr: moment(date).format(YYYYMMDD),
              day_of_week: moment(event.start_time).isoWeekday(),
              status: 1,
              custom_type: 1,
              checked: true,
              backgroundColor: 'transparent',
              borderColor: 'none',
              textColor: '#333333',
              overlap: true,
              fromEdit: true,
              recentAdded: true,
              randomId: uuidv4(),
            });
          }
          return acc;
        }, {});
        props.onCheckedGenerateBlockCalendar(customEventsObjFiltered);
        newBlockEvents = blocks.map(item => {
          return {
            ...item,
            name: '候補',
            checked: true,
            overlap: true,
            fromEdit: true,
            recentAdded: true,
            randomId: Date.now() + Math.random(),
            editable: true,
          };
        });
      }
      setState(prev => ({
        ...prev,
        userEvents: flatDataEvent,
        voters,
        newBlockEvents,
      }));
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const handleUpdateMonthYear = type => {
    const calendarApi = calendarRef.current.getApi();
    const startTime = moment(calendarApi.view.currentStart);
    const year = startTime.toDate().getFullYear();
    const month = startTime.toDate().getMonth();
    console.log('onchange type ', type, year, month);

    setSelectedMonth(month + 1);
    setSelectedYear(year);
  };

  const handleChangeYear = value => {
    const yearValue = Number(value);
    const calendarApi = calendarRef.current.getApi();
    const newDate = new Date(yearValue, selectedMonth, 1);
    isSelectYearRef.current = true;
    setSelectedYear(yearValue);
    calendarApi.gotoDate(newDate);
    delayFetchBookedEvents();
  };

  const handleChangeMonth = value => {
    const monthValue = Number(value);
    const calendarApi = calendarRef.current.getApi();
    const newDate = new Date(selectedYear, monthValue - 1, 1);
    calendarApi.gotoDate(newDate);
    isSelectMonthRef.current = true;
    handleUpdateMonthYear('month');
    delayFetchBookedEvents();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    // isSelectMonthRef.current = false;

    calendarApi.next();

    handleUpdateMonthYear('next');

    delayFetchBookedEvents();
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();

    // if (isSelectMonthRef.current) {
    //   let startDate = moment(calendarApi.view.currentStart);
    //   let endDate = moment(calendarApi.view.currentEnd);

    //   const diff = endDate.diff(startDate, 'days');
    //   const newStartDate = startDate
    //     .subtract(1, 'month')
    //     .subtract(diff, 'days');
    //   isSelectMonthRef.current = false;
    //   calendarApi.gotoDate(newStartDate.toDate());
    // } else {
    //   calendarApi.prev();
    // }
    calendarApi.prev();

    handleUpdateMonthYear('prev');

    delayFetchBookedEvents();
  };

  const handleDatesSet = arg => {
    // const date = arg.start; // hoặc arg.view.currentStart
    // let month = date.getMonth();
    // // console.log('month1: ', month, isSelectMonthRef.current);
    // let year = date.getFullYear();
    // if (month === 0) {
    //   month = 12;
    //   year = year - 1;
    // } else {
    //   // if (!isSelectMonthRef.current) {
    //   //   month = date.getMonth() + 1;
    //   // }
    //   month = date.getMonth() + 1;
    // }
    // // console.log('month2: ', month, isSelectMonthRef.current);
    // setSelectedMonth(month);
    // setSelectedYear(year);
  };

  const handleGoToToday = () => {
    const calendarApi = calendarRef.current.getApi();
    isSelectMonthRef.current = false;
    calendarApi.today();

    handleUpdateMonthYear('today');

    delayFetchBookedEvents();
  };

  const addTimeBlock = info => {
    if (props.viewOnly) return;
    // console.log('info: ', info);
    // if (info.allDay && props.fromCalendar) return;

    // Logic to handle the go to today button click
    let displayEvents = state.displayEvents;
    let listNewEvents = props.listNewEvents || {};
    // console.log('listNewEvents: ', listNewEvents);

    const start = moment(info.date);
    const startTime = start.format(YYYYMMDDTHHmm);
    const end = moment(info.date).add(props.blockNumber || 60, 'minutes');
    const endTime = end.format(YYYYMMDDTHHmm);

    const groupKey = start.format(YYYYMMDD);

    const groupData = listNewEvents[groupKey] || [];
    const blockTimeIndex = groupData.findIndex(
      x =>
        moment(x.start_time).format(YYYYMMDDTHHmm) === startTime &&
        moment(x.end_time).format(YYYYMMDDTHHmm) === endTime,
    );

    if (blockTimeIndex !== -1) {
      listNewEvents[groupKey][blockTimeIndex].checked = true;

      displayEvents = displayEvents.map(e => {
        if (e.srcId === listNewEvents[groupKey][blockTimeIndex].srcId) {
          return {
            ...e,
            checked: true,
          };
        }
        return e;
      });

      displayEventsRef.current = displayEvents;

      props.setListNewEvents?.(listNewEvents);

      onNewBlock(listNewEvents[groupKey][blockTimeIndex]);

      setState(prev => ({
        ...prev,
        displayEvents,
      }));
      return;
    }

    const event = {
      title: formatMessage({ id: 'i18n_votes' }),
      end: endTime,
      start: startTime,
      end_time: endTime,
      start_time: startTime,
      day_of_week: start.day(),
      status: 1,
      srcId: uuidv4(),
      dayStr: groupKey,
      thisDay: groupKey,
      recentAdded: true,
      overlap: true,
      color: null,
      custom_type: DATE_TIME_TYPE.default,
      textColor: '#333333',
      backgroundColor: 'transparent',
      borderColor: '#1890ff',
      // flag check event is auto generated
      isSync: false,
      checked: true,
    };

    if (props.fromCalendar) {
      history.push({
        pathname: '/pc/create-calendar',
        state: {
          event,
          startDate: groupKey,
        },
      });
      return;
    }

    displayEvents = [...displayEvents, event];
    displayEventsRef.current = displayEvents;

    if (listNewEvents[groupKey]) {
      listNewEvents[groupKey].push({
        ...event,
      });
    } else {
      listNewEvents[groupKey] = [
        {
          ...event,
        },
      ];
    }

    setState(prev => ({
      ...prev,
      displayEvents,
    }));

    props.onAddEvent(info, props.blockNumber);
    props.setListNewEvents?.(listNewEvents);

    onNewBlock(event);
  };

  const onDeleteEvent = payload => {
    let { displayEvents } = state;
    let listNewEvents = props.listNewEvents || {};
    let userEvents = [...state.userEvents];
    let newBlockEvents = [...state.newBlockEvents];

    displayEvents = displayEvents.filter(e => {
      return e.fromEdit
        ? e.randomId !== payload.randomId
        : e.srcId != payload.srcId;
    });

    if (payload.fromEdit) {
      userEvents = userEvents.filter(e => {
        return e.randomId !== payload.randomId;
      });
      newBlockEvents = newBlockEvents.filter(e => {
        return e.randomId !== payload.randomId;
      });
    }

    // set checked block generate to false
    listNewEvents = Object.entries(listNewEvents).map(([key, value]) => {
      return {
        [key]: value.map(item => {
          if (item.fromEdit && item.randomId !== payload.randomId) {
          } else if (item.srcId == payload.srcId) {
            item.checked = false;
          }

          return item;
        }),
      };
    });

    // revert to object
    listNewEvents = listNewEvents.reduce((acc, cur) => {
      return { ...acc, ...cur };
    }, {});

    displayEventsRef.current = displayEvents;

    setState(prev => ({
      ...prev,
      displayEvents,
      userEvents,
      newBlockEvents,
    }));

    props.setListNewEvents(listNewEvents);
  };

  const renderClassName = event => {
    const eProps = event.event._def.extendedProps;
    const calendar = calendarRef.current.getApi();
    const startOfWeek = moment(calendar.view.currentStart);

    let leftArrow = false;
    let rightArrow = false;

    const endOfWeek = moment(calendar.view.currentEnd);
    const startTime = moment(eProps.start_time);
    const startTimeFormat = moment(eProps.start_time).format(DATE_FORMAT);
    const endTime = moment(eProps.end_time);
    const endTimeFormat = moment(eProps.end_time).format(DATE_FORMAT);
    const currentTime = moment();

    const diff = endTime.diff(startTime, 'minutes');

    if (
      startTime.isBefore(startOfWeek) &&
      !eProps.isMsWeekly &&
      !eProps.isMsDaily
    ) {
      leftArrow = true;
    }

    if (endTime.isAfter(endOfWeek) && !eProps.isMsWeekly && !eProps.isMsDaily) {
      rightArrow = true;
    }

    let arrow = `${leftArrow ? 'leftArrow' : ''} ${
      rightArrow ? 'rightArrow' : ''
    }`;

    if (props.fromVote) {
      const existVote = props.eventDateTimeGuest?.find(
        x => x.event_id == eProps.srcId,
      );

      const existVoteTime = props.votedEvents?.find(
        x =>
          x.event_id == eProps.srcId &&
          moment(x.start_time).format(DATE_FORMAT) === startTimeFormat &&
          moment(x.end_time).format(DATE_FORMAT) === endTimeFormat,
      );

      if (existVote && !existVoteTime) {
        arrow = arrow + ' existNg';
      }

      if (existVote && currentTime.isAfter(startTime)) {
        arrow = arrow + ' existNg expiredTime';
      }
    }

    if (eProps.isEventClose) {
      arrow = arrow + ' isEventClose';
    }

    if (diff === 15) {
      arrow = arrow + ' timeTextShort';
    }

    if (eProps.isBooked) {
      if (eProps.isGoogleSync) {
        return 'isBooked googleSync ' + arrow;
      }
      if (eProps.isMicrosoftSync) {
        return 'isBooked microsoftSync ' + arrow;
      }
      return 'isBooked ' + arrow;
    }
    if (eProps.isSync) {
      return 'syncData ' + arrow;
    }
    if (eProps.recentAdded || eProps.checked) {
      return 'recentAdded ' + arrow;
    }

    return arrow;
  };

  const handleToggleExpand = () => {
    setExpanded(prev => !prev);
  };

  const renderYearNavigation = () => {
    const currentYear = moment().year();
    return Array.from(
      { length: 11 },
      (_, index) => currentYear - 5 + index,
    ).map(year => ({
      value: year,
      label: `${year} ${formatMessage({ id: 'i18n_year' })}`,
    }));
  };

  const renderMonthNavigation = () => {
    return Array.from({ length: 12 }, (_, index) => index + 1).map(month => ({
      value: month,
      label: `${month} ${formatMessage({ id: 'i18n_month' })}`,
    }));
  };

  return {
    calendarRef,
    selected,
    state,
    showExpandRow,
    expanded,
    displayEvents,
    selectedMonth,
    selectedYear,
    initialDate: state.initialDate,
    setState,
    setSelect,
    handleNext,
    handlePrev,
    handleGoToToday,
    addTimeBlock,
    fetchBookedEvents,
    renderClassName,
    onDeleteEvent,
    handleToggleExpand,
    handleChangeYear,
    handleChangeMonth,
    renderYearNavigation,
    renderMonthNavigation,
    handleDatesSet,
  };
}
