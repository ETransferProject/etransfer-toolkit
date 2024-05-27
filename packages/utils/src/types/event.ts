import EventEmitter from 'events';
import { EVENT_LIST } from '../constants';

export type TETransferEventEmitter = {
  remove: () => void;
} & EventEmitter;

export type TETransferEventsTypes = {
  [x in (typeof EVENT_LIST)[number]]: {
    emit: (...params: any[]) => void;
    addListener: (listener: (data: any) => void) => TETransferEventEmitter;
    name: string;
  };
};
