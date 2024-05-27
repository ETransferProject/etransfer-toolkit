import EventEmitter from 'events';
import { EVENT_LIST } from '../constants';
import { TETransferEventsTypes } from '../types/event';

export const eventBus = new EventEmitter();

const eventsServer = new Function();

eventsServer.prototype.parseEvent = function (name: string, eventMap: string[]) {
  const obj: any = (this[name] = {});
  eventMap.forEach(item => {
    const eventName = item.toLocaleUpperCase();
    obj[item] = {
      emit: this.emit.bind(this, eventName),
      addListener: this.addListener.bind(this, eventName),
      name: eventName,
    };
  });
};

eventsServer.prototype.emit = function (eventType: string, ...params: any[]) {
  eventBus.emit(eventType, ...params);
};
eventsServer.prototype.addListener = function (eventType: string, listener: (data: any) => void) {
  const cListener = eventBus.addListener(eventType, listener);
  return { ...cListener, remove: () => eventBus.removeListener(eventType, listener) };
};

eventsServer.prototype.parseEvent('base', EVENT_LIST);

export const etransferEvents = { ...eventsServer.prototype.base } as unknown as TETransferEventsTypes;
