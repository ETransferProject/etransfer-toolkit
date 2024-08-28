import moment from 'moment';

export const formatPastTime = (time: number) => {
  const currentTime = new Date();
  const currentTimestamp = moment(currentTime).valueOf();

  const timeDaysDiff = moment(currentTimestamp).diff(moment(time), 'days');
  if (timeDaysDiff > 0) {
    return moment(time).format('MMM D, YYYY HH:mm:ss');
  } else {
    const timeHourDiff = moment(currentTimestamp).diff(moment(time), 'hours');
    if (timeHourDiff > 0) {
      return `${timeHourDiff} hours ago`;
    } else {
      const timeMinDiff = moment(currentTimestamp).diff(moment(time), 'minutes');
      if (timeMinDiff > 0) {
        return `${timeMinDiff} minutes ago`;
      } else {
        return `just now`;
      }
    }
  }
};
