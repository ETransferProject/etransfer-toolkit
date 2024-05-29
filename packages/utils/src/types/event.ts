import EventEmitter from 'events';
import { EVENT_LIST } from '../constants';

export type TETransferEventEmitter = {
  remove: () => void;
} & EventEmitter;

export type TEventName = (typeof EVENT_LIST)[number];

export type TETransferEventsTypes = {
  [x in TEventName]: {
    emit: (...params: any[]) => void;
    addListener: (listener: (data: any) => void) => TETransferEventEmitter;
    name: string;
  };
};
