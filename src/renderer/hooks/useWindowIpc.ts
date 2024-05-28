import { IpcChannel } from 'shared/ipcs/types';

export const useWindowIpc = () => {
  const openViewLog = (connectId: number) => {
    window.electron.ipcRenderer.send(IpcChannel.OPEN_VIEW_WINDOW, connectId);
  };

  const selectFolder = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.SELECT_FOLDER,
    );
    return result.folderPath;
  };

  return { openViewLog, selectFolder };
};
