import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { YYYYMMDDTHHmm } from '@/constant';

export const convertUserEvents = (listEventType = []) => {
  const namePattern = /[?&]name=([^&]+)/;
  const voters = listEventType.map(x => {
    return {
      id: x.id,
      voters: x.vote?.voters || [],
      comment: x.calendar_create_comment,
    };
  });

  const flatDataEventVoted = listEventType.flatMap(item => {
    const uuidFullURL = item.vote.full_url.match(namePattern);
    return item.calendars.map(calendar => ({
      start_time: calendar.start_time,
      end_time: moment(calendar.start_time)
        .add(calendar.block_number, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss'),
      id: item.id,
      srcId: uuidFullURL ? uuidFullURL[1] : null,
      name: calendar.event_name,
      isEventClose: true,
      slugURL: item.vote.slug,
      eventByUser: item.user_id,
      uuidVote: uuidFullURL ? uuidFullURL[1] : null,
    }));
  });

  const flatDataEventVote = listEventType.flatMap(item => {
    const uuidFullURL = item.vote.full_url.match(namePattern);
    return item.event_datetimes.map(calendar => ({
      start_time: calendar.start_time,
      end_time: calendar.end_time,
      id: item.id,
      srcId: item.id,
      name: item.name,
      backgroundColor: '#FFFFFF',
      borderColor: '#3368C7',
      textColor: '#3368C7',
      isEventClose: false,
      slugURL: item.vote.slug,
      eventByUser: item.user_id,
      uuidVote: uuidFullURL ? uuidFullURL[1] : null,
    }));
  });

  const mergeDataEvent = flatDataEventVoted.concat(flatDataEventVote);

  const flatDataEvent = mergeDataEvent.map(item => ({
    ...item,
    end: item.end_time,
    start: item.start_time,
    srcId: item.srcId ?? uuidv4(),
    title: item.name ?? '',
    editable: false,
  }));

  return { voters, flatDataEvent };
};

export const convertBookedEvents = (profileId, result = []) => {
  const dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  let data =
    result?.filter(
      event =>
        !event.isDeleted &&
        !event.recurrence?.pattern?.daysOfWeek?.length &&
        event.recurrence?.pattern?.type !== 'daily',
    ) || [];

  const msWeekly = result?.filter(
    event => event.recurrence?.pattern?.daysOfWeek?.length > 0,
  );
  const msDaily = result?.filter(
    event => event.recurrence?.pattern?.type === 'daily',
  );
  // const ids = new Set(data.map(event => event.event_id));
  // data = data.filter(event => {
  //   return !ids.has(event.srcId);
  // });

  const listEvents = data.map(event => ({
    ...event,
    title: event.name ?? event.holiday_name,
    user_id: profileId,
    // color: color,
    // option: option,
    start: moment(event.start_time).format(YYYYMMDDTHHmm),
    end: !event.block_number
      ? moment(event.end_time).format(YYYYMMDDTHHmm)
      : moment(event.start_time)
          .add(event.block_number, 'm')
          .format(YYYYMMDDTHHmm),
    text_color: '#333333',
    ...(!event.block_number && { allDay: true }),
    editable: false,
    isBooked: true,
    isSync: event.event_google_id || event.event_microsoft_id,
    isGoogleSync: !!event.event_google_id,
    isMicrosoftSync: !!event.event_microsoft_id,
  }));

  msWeekly.forEach(item => {
    const start = moment(item.recurrence.range.startDate);
    const end = moment(item.recurrence.range.endDate);
    const daysOfWeek = item.recurrence.pattern.daysOfWeek.map(
      d => dayMap[d.toLowerCase()],
    );
    // const interval = item.recurrence.pattern.interval || 1;

    let current = start.clone();

    while (current.isSameOrBefore(end)) {
      if (daysOfWeek.includes(current.day())) {
        const startTime = moment(item.start_time);
        const eventStart = current
          .clone()
          .hour(startTime.hour())
          .minute(startTime.minute());
        const eventEnd = item.block_number
          ? eventStart.clone().add(item.block_number, 'minutes')
          : moment(item.end_time);

        listEvents.push({
          ...item,
          title: item.name ?? item.holiday_name,
          user_id: profileId,
          start: eventStart.format(YYYYMMDDTHHmm),
          end: eventEnd.format(YYYYMMDDTHHmm),
          text_color: '#333333',
          editable: false,
          isBooked: true,
          isSync: item.event_google_id || item.event_microsoft_id,
          isGoogleSync: !!item.event_google_id,
          isMicrosoftSync: !!item.event_microsoft_id,
          isMsWeekly: true,
        });
      }

      current.add(1, 'day');
    }
  });

  msDaily.forEach(item => {
    const start = moment(item.recurrence.range.startDate);
    const end = moment(item.recurrence.range.endDate);
    const interval = item.recurrence.pattern.interval || 1;
    let current = start.clone();

    while (current.isSameOrBefore(end)) {
      const startTime = moment(item.start_time);
      const eventStart = current
        .clone()
        .hour(startTime.hour())
        .minute(startTime.minute());
      const eventEnd = item.block_number
        ? eventStart.clone().add(item.block_number, 'minutes')
        : moment(item.end_time);

      listEvents.push({
        ...item,
        title: item.name ?? item.holiday_name,
        user_id: profileId,
        start: eventStart.format(YYYYMMDDTHHmm),
        end: eventEnd.format(YYYYMMDDTHHmm),
        text_color: '#333333',
        ...(item.block_number ? {} : { allDay: true }),
        editable: false,
        isBooked: true,
        isSync: item.event_google_id || item.event_microsoft_id,
        isGoogleSync: !!item.event_google_id,
        isMicrosoftSync: !!item.event_microsoft_id,
        isMsDaily: true,
      });

      current.add(interval, 'days');
    }
  });

  return listEvents;
};

export const flatDataEvent = (obj = {}) => {
  const flatData = Object.entries(obj || {})
    .map(([key, value]) => {
      return value;
      // .filter(item => item.checked);
    })
    .flat();

  return flatData;
};
