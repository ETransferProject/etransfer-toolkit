import * as uuid from 'uuid';

export const dealURLLastChar = (url = '') => (url?.slice(-1) === '/' ? url.slice(0, -1) : url);

export const randomId = () => uuid.v4().replace(/-/g, '');
