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
    window.electron.ipcRenderer.onResponse(
      (result) => {
        if (!result.success) message.error(result.message);
      },
      (error) => {
        message.error(error.message || error);
      },
    );
  }, []);

  return null;
};

export { message, modal, notification };
