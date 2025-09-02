export const EventBusNames = {
  NEW_BLOCK_TIME: 'NEW_BLOCK_TIME',
  CHECK_GENERATE_EVENTS: 'CHECK_GENERATE_EVENTS',
  REFRESH_PROFILE: 'REFRESH_PROFILE',
  DELETE_EVENT: 'DELETE_EVENT',
  DELETE_BLOCK_TIME: 'DELETE_BLOCK_TIME',
  DROP_BLOCK_TIME: 'DROP_BLOCK_TIME',
  DRAG_STOP_BLOCK_TIME: 'DRAG_STOP_BLOCK_TIME',
};

const EventBus = new EventTarget();

export const onNewBlock = payload => {
  EventBus.dispatchEvent(
    new CustomEvent(EventBusNames.NEW_BLOCK_TIME, { detail: payload }),
  );
};

export const onRefreshProfile = payload => {
  EventBus.dispatchEvent(
    new CustomEvent(EventBusNames.REFRESH_PROFILE, { detail: payload }),
  );
};

export const eventCheckedGenerateBlock = payload => {
  EventBus.dispatchEvent(
    new CustomEvent(EventBusNames.CHECK_GENERATE_EVENTS, { detail: payload }),
  );
};

export const eventDeleteEvent = payload => {
  EventBus.dispatchEvent(
    new CustomEvent(EventBusNames.DELETE_EVENT, { detail: payload }),
  );
};

export const eventDeleteBlockTime = payload => {
  EventBus.dispatchEvent(
    new CustomEvent(EventBusNames.DELETE_BLOCK_TIME, { detail: payload }),
  );
};

export const eventDropBlockTime = payload => {
  EventBus.dispatchEvent(
    new CustomEvent(EventBusNames.DROP_BLOCK_TIME, { detail: payload }),
  );
};

export const eventDragStopBlockTime = payload => {
  EventBus.dispatchEvent(
    new CustomEvent(EventBusNames.DRAG_STOP_BLOCK_TIME, { detail: payload }),
  );
};

export default EventBus;
