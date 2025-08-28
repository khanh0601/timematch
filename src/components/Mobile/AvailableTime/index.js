import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { slotLabelFormat } from '../../../commons/function';
import Header from '@/pages/Mobile/Calendar/components/Header';
import Content from '@/pages/Mobile/Calendar/components/Content';
import FullCalendar from '@fullcalendar/react';
import React, { useState } from 'react';

function AvailableTime(props) {
  const {
    calendarRef,
    displayEvents,
    viewEventCalendar,
    addTimeBlock,
    handleOnResizeAndDropEvent,
    firstDay,
    dateIncrement,
    onDeleteEvent,
    handleEventClick,
    showDeleteEvent,
    memoEventMobile,
  } = props;

  const [selected, onSelect] = useState({});

  const handleDisabledDate = info => {
    if (info.event._def.extendedProps.isBooked) {
      return true;
    }
    return false;
  };

  return (
    <FullCalendar
      ref={calendarRef}
      eventOverlap={true}
      headerToolbar={false}
      expandRows={true}
      timeZone={'local'}
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGrid"
      duration={{ days: viewEventCalendar }}
      height={'80vh'}
      events={displayEvents.filter(event => !event.isDeleted)}
      slotMinTime={'00:00:00'}
      slotMaxTime={'24:00:00'}
      slotDuration={'00:15:00'}
      slotLabelInterval={{ hours: 1 }}
      eventMinHeight={15}
      editable={true}
      allDaySlot={false}
      slotLabelFormat={slotLabelFormat}
      dateIncrement={{
        days: dateIncrement,
      }}
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false,
        hourCycle: 'h23',
      }}
      dateClick={info => addTimeBlock(info)}
      eventResize={info => handleOnResizeAndDropEvent(info)}
      eventDrop={info => handleOnResizeAndDropEvent(info)}
      firstDay={firstDay}
      scrollTimeReset={false}
      dayHeaderContent={value => <Header value={value} />}
      eventContent={info => (
        <Content
          info={info}
          selected={selected}
          onSelect={onSelect}
          deleteEvent={onDeleteEvent}
          showDeleteEvent={showDeleteEvent ?? false}
          memoEventMobile={memoEventMobile}
          disabled={handleDisabledDate(info)}
        />
      )}
      windowResize={true}
      eventClick={info => handleEventClick(info)}
    />
  );
}

export default AvailableTime;
