import dayjs from 'dayjs';

const DATE_FORMAT = 'DD-MM-YYYY';
const TIME_FORMAT = 'HH:mm:ss';
const DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm:ss';

export function formatDate(value: any) {
  return dayjs(value).format(DATE_FORMAT);
}

export function formatTime(value: any) {
  return dayjs(value).format(TIME_FORMAT);
}

export function formatDateTime(value: any) {
  return dayjs(value).format(DATE_TIME_FORMAT);
}

export function parseDate(value: any) {
  return dayjs(value).toDate();
}

export function parseString(value: any) {
  return dayjs(value).toISOString();
}
