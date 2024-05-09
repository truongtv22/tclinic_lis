import { useEffect } from 'react';
import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

export default (): any => {
  const staticFunction = App.useApp();

  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;

  useEffect(() => {
    window.electron.ipcRenderer.onRequest(
      () => {
        // console.log('onRequest->success');
      },
      (error) => {
        // console.log('onRequest->error', error);
      },
    );

    window.electron.ipcRenderer.onResponse(
      () => {
        // console.log('onResponse->success');
      },
      (error) => {
        // console.log('onResponse->error', error);
      },
    );
  }, []);

  return null;
};

export { message, modal, notification };
