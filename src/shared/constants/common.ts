export const STORAGE_KEY = 'TCLINIC_LIS_STORAGE';

export const LAB = {
  BW200: 'BW200',
  Access2: 'Access2',
  SysmexXP100: 'SysmexXP100',
  BioSystemA15: 'BioSystemA15',
};

export const CONNECT_TYPE = {
  SerialPort: 'SerialPort',
  Folder: 'Folder',
};

export const COM_PORT = [
  'COM1',
  'COM2',
  'COM3',
  'COM4',
  'COM5',
  'COM6',
  'COM7',
  'COM8',
  'COM9',
  'COM10',
];

export const BAUD_RATE = [
  110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200,
];

export const DATA_BITS = [5, 6, 7, 8];
export const STOP_BITS = [1, 1.5, 2];

export const RTS_MODE = [
  { value: 'handshake', label: 'Handshake' },
  { value: 'enable', label: 'Enable' },
  { value: 'toggle', label: 'Toggle' },
];

export const PARITY = [
  { value: 'none', label: 'None' },
  { value: 'even', label: 'Even' },
  { value: 'odd', label: 'Odd' },
  { value: 'mark', label: 'Mark' },
  { value: 'space', label: 'Space' },
];
