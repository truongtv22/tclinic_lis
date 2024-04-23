export enum StorageIpcChannels {
  STORAGE_GET_ITEM = 'storage-get-item',
  STORAGE_SET_ITEM = 'storage-set-item',
  STORAGE_REMOVE_ITEM = 'storage-remove-item',
}

export type StorageIpcEvents = {
  [StorageIpcChannels.STORAGE_GET_ITEM]: (key: string) => any;
  [StorageIpcChannels.STORAGE_SET_ITEM]: (key: string, value: any) => void;
  [StorageIpcChannels.STORAGE_REMOVE_ITEM]: (key: string) => void;
};
