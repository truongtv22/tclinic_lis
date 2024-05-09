export enum StorageIpcChannel {
  STORAGE_GET_ITEM = 'storage-get-item',
  STORAGE_SET_ITEM = 'storage-set-item',
  STORAGE_REMOVE_ITEM = 'storage-remove-item',
}

export type StorageIpcEvents = {
  [StorageIpcChannel.STORAGE_GET_ITEM]: (key: string) => any;
  [StorageIpcChannel.STORAGE_SET_ITEM]: (key: string, value: any) => void;
  [StorageIpcChannel.STORAGE_REMOVE_ITEM]: (key: string) => void;
};
