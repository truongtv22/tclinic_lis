import dayjs from 'dayjs';

export const DATE_FORMAT = 'DD-MM-YYYY';
export const TIME_FORMAT = 'HH:mm:ss';
export const DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm:ss';

export function formatDate(value: any) {
  return dayjs(value).format(DATE_FORMAT);
}

export function formatTime(value: any) {
  return dayjs(value).format(TIME_FORMAT);
}

export function formatDateTime(value?: any) {
  return dayjs(value).format(DATE_TIME_FORMAT);
}

export function parseDate(value: any) {
  return dayjs(value).toDate();
}

export function parseString(value: any, format?: string) {
  return dayjs(value, format).toISOString();
}
