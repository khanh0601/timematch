import FooterMobile from '@/components/Mobile/Footer';
import PCHeader from '@/components/PC/Header';
import FormCreateCalendar from './components/FormCreateCalendar';
import styles from './styles/index.less';
import { useEffect, useState } from 'react';
import CalendarPreview from '@/components/PC/Calendar/CalendarPreview';
import EventBus, { EventBusNames } from '@/util/eventBus';
import moment from 'moment';
import { ADMIN_FULL_DATE_HOUR, YYYYMMDD, YYYYMMDDTHHmm } from '@/constant';

function CreateNewCalendar() {
  const [blockNumber, setBlockNumber] = useState(60);
  const [listNewEvents, setListNewEvents] = useState({});

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

      const groupKey =
        event.thisDay || moment(event.start_time).format(YYYYMMDD);

      const newGroupKey = newStart.format(YYYYMMDD);
      setListNewEvents(prev => {
        const newBlocks = { ...prev };
        if (groupKey == newGroupKey) {
          const newEventIndex = newBlocks[groupKey]?.findIndex(e => {
            return (
              moment(e.start_time).format(YYYYMMDDTHHmm) == newStartTime &&
              moment(e.end_time).format(YYYYMMDDTHHmm) == newEndTime
            );
          });

          const eventIndex = newBlocks[groupKey]?.findIndex(e => {
            return (
              moment(e.start_time).format(YYYYMMDDTHHmm) == eventStartTime &&
              moment(e.end_time).format(YYYYMMDDTHHmm) == eventEndTime
            );
          });

          if (newEventIndex !== -1 && newEventIndex !== undefined) {
            newBlocks[groupKey][newEventIndex].checked = true;

            if (eventIndex !== -1 && eventIndex !== undefined) {
              newBlocks[groupKey][eventIndex].checked = false;
            }
          }

          if (eventIndex !== -1 && newEventIndex === -1) {
            newBlocks[groupKey][eventIndex].start_time = newStartTime;
            newBlocks[groupKey][eventIndex].start = newStartTime;
            newBlocks[groupKey][eventIndex].end_time = newEndTime;
            newBlocks[groupKey][eventIndex].end = newEndTime;
            newBlocks[groupKey][eventIndex].thisDay = thisDay;
            newBlocks[groupKey][eventIndex].dayStr = thisDay;
            newBlocks[groupKey][eventIndex].day_of_week = day_of_week;
          }
        } else {
          newBlocks[groupKey] = newBlocks[groupKey]?.filter(
            e =>
              moment(e.start_time).format(YYYYMMDDTHHmm) != eventStartTime &&
              moment(e.end_time).format(YYYYMMDDTHHmm) != eventEndTime,
          );

          newBlocks[newGroupKey] = newBlocks[newGroupKey] || [];
          newBlocks[newGroupKey].push({
            ...event,
            start_time: newStartTime,
            start: newStartTime,
            end_time: newEndTime,
            end: newEndTime,
            thisDay: thisDay,
            dayStr: thisDay,
            day_of_week: day_of_week,
          });
        }

        return newBlocks;
      });
    });
  }, []);

  useEffect(() => {
    EventBus.addEventListener(EventBusNames.DRAG_STOP_BLOCK_TIME, e => {
      const { detail: payload } = e;
      const event = payload.event._def.extendedProps;
      const eventStartTime = moment(event.start_time).format(
        ADMIN_FULL_DATE_HOUR,
      );
      const eventEndTime = moment(event.end_time).format(ADMIN_FULL_DATE_HOUR);
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

      const groupKey =
        event.thisDay || moment(event.start_time).format(YYYYMMDD);

      const newGroupKey = newStart.format(YYYYMMDD);

      setListNewEvents(prev => {
        const newBlocks = { ...prev };
        if (groupKey == newGroupKey) {
          const newEventIndex = newBlocks[groupKey]?.findIndex(
            e =>
              moment(e.start_time).format(YYYYMMDDTHHmm) == newStartTime &&
              moment(e.end_time).format(YYYYMMDDTHHmm) == newEndTime,
          );

          const eventIndex = newBlocks[groupKey]?.findIndex(
            e =>
              moment(e.start_time).format(ADMIN_FULL_DATE_HOUR) ==
                eventStartTime &&
              moment(e.end_time).format(ADMIN_FULL_DATE_HOUR) == eventEndTime,
          );

          if (newEventIndex !== -1 && newEventIndex !== undefined) {
            newBlocks[groupKey][newEventIndex].checked = true;

            if (eventIndex !== -1 && eventIndex !== undefined) {
              newBlocks[groupKey][eventIndex].checked = false;
            }
          }

          if (eventIndex !== -1 && newEventIndex === -1) {
            newBlocks[groupKey][eventIndex].start_time = newStartTime;
            newBlocks[groupKey][eventIndex].start = newStartTime;
            newBlocks[groupKey][eventIndex].end_time = newEndTime;
            newBlocks[groupKey][eventIndex].end = newEndTime;
            newBlocks[groupKey][eventIndex].thisDay = thisDay;
            newBlocks[groupKey][eventIndex].dayStr = thisDay;
            newBlocks[groupKey][eventIndex].day_of_week = day_of_week;
          }
        } else {
          newBlocks[groupKey] = newBlocks[groupKey]?.filter(
            e =>
              moment(e.start_time).format(ADMIN_FULL_DATE_HOUR) !=
                eventStartTime &&
              moment(e.end_time).format(ADMIN_FULL_DATE_HOUR) != eventEndTime,
          );

          newBlocks[newGroupKey] = newBlocks[newGroupKey] || [];
          newBlocks[newGroupKey].push({
            ...event,
            start_time: newStartTime,
            start: newStartTime,
            end_time: newEndTime,
            end: newEndTime,
            thisDay: thisDay,
            dayStr: thisDay,
            day_of_week: day_of_week,
          });
        }

        return newBlocks;
      });
    });
  }, []);

  const onChangeListEvent = events => {
    setListNewEvents(events);
    // setListNewEvents(prevList => {
    //   const newList = { ...prevList };

    //   Object.entries(events).forEach(([date, eventArray]) => {
    //     if (!newList[date]) {
    //       newList[date] = [...eventArray];
    //     } else {
    //       const existingIds = new Set(newList[date].map(e => e.id));
    //       const newEvents = eventArray.filter(e => !existingIds.has(e.id));
    //       newList[date] = [...newList[date], ...newEvents];
    //     }
    //   });

    //   return newList;
    // });
  };

  return (
    <div>
      <PCHeader />

      <div className={styles.mainContainer}>
        {/* Left panel */}
        <FormCreateCalendar
          blockNumber={blockNumber}
          syncBlockNumber={setBlockNumber}
          listNewEvents={listNewEvents}
          onChangeListEvent={onChangeListEvent}
        />

        {/* right panel */}
        <CalendarPreview
          blockNumber={blockNumber}
          listNewEvents={listNewEvents}
          setListNewEvents={setListNewEvents}
        />
      </div>

      <FooterMobile />
    </div>
  );
}
export default CreateNewCalendar;
