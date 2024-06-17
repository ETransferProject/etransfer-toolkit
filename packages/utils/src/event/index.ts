import EventEmitter from 'events';
import { EVENT_LIST } from '../constants';
import { TETransferEventsTypes } from '../types/event';

export const eventBus = new EventEmitter();

class EventsService {
  constructor() {
    this.parseEvent(EVENT_LIST);
  }

  parseEvent = (eventMap: typeof EVENT_LIST) => {
    eventMap.forEach(item => {
      const eventName = item.toLocaleUpperCase();
      this[item] = {
        emit: this.emit.bind(this, eventName),
        addListener: this.addListener.bind(this, eventName),
        name: eventName,
      };
    });
  };

  emit = (eventType: string, ...params: any[]) => {
    eventBus.emit(eventType, ...params);
  };

  addListener = (eventType: string, listener: (data: any) => void) => {
    const cListener = eventBus.addListener(eventType, listener);
    return { ...cListener, remove: () => eventBus.removeListener(eventType, listener) };
  };
}

export const etransferEvents = new EventsService() as unknown as TETransferEventsTypes;
