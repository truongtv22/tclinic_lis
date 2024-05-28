import dayjs from 'dayjs';

export function getBarcode(barcode: string, datetime: string) {
  return `${dayjs(datetime).format('YYMMDD')}-${barcode}`;
}
