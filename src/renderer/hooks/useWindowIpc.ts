import { IpcChannel } from 'shared/ipcs/types';
import { useIpcListener } from './useIpcListener';

export const useWindowIpc = () => {
  const selectFolder = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.SELECT_FOLDER,
    );
    return result.folderPath;
  };
  
  return { selectFolder };
};
