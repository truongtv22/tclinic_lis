import { useDispatch, useSelector } from 'react-redux';
import { Space, Button } from 'antd';
import NiceModal from '@ebay/nice-modal-react';

import { IpcChannel } from 'shared/ipcs/types';
import {
  connectionActions,
  selectConnections,
} from 'renderer/store/connection';
import { TestResultModal } from 'renderer/pages/base';
import { modal, notification } from './useApp';
import { useIpcListener } from './useIpcListener';

export const useConnectionIpc = () => {
  const dispatch = useDispatch();
  const connections = useSelector(selectConnections);

  useIpcListener(IpcChannel.CONNECTION_OPENED, (id) => {
    console.log(`Connection ${id} opened`);
    notification.success({
      message: 'Kết nối thiết bị thành công',
    });
    dispatch(connectionActions.updateStatus([id, true]));
  });

  useIpcListener(IpcChannel.CONNECTION_CLOSED, (id) => {
    console.log(`Connection ${id} closed`);
    dispatch(connectionActions.updateStatus([id, false]));
  });

  useIpcListener(IpcChannel.CONNECTION_ERROR, (id, error, retry) => {
    console.log(`Error on connection ${id}`, error);
    if (!retry) {
      notification.error({
        message: 'Lỗi kết nối thiết bị',
        description: error,
      });
    }
    dispatch(connectionActions.updateStatus([id, false]));
  });

  // useIpcListener(
  //   IpcChannel.CONNECTION_DATA,
  //   async (id, data) => {
  //     const connection = connections.find((item) => item.id === id);

  //     const notifyKey = `open-${Date.now()}`;
  //     notification.open({
  //       key: notifyKey,
  //       message: 'Thông báo đồng bộ',
  //       description: `Bạn nhận được kết quả từ ${connection.comp}, bạn muốn xem kết quả trước khi đồng bộ tới HIS không?`,
  //       btn: (
  //         <Space>
  //           <Button
  //             type="link"
  //             size="small"
  //             onClick={() => notification.destroy(notifyKey)}
  //           >
  //             Đóng
  //           </Button>
  //           <Button
  //             size="small"
  //             type="primary"
  //             onClick={() => {
  //               notification.destroy(notifyKey);
  //               showTestResult(connection, data);
  //             }}
  //           >
  //             Kết quả xét nghiệm
  //           </Button>
  //         </Space>
  //       ),
  //     });
  //   },
  //   [connections],
  // );

  useIpcListener(
    IpcChannel.CONNECTION_DATA_NOTIFY,
    async (id, data) => {
      const connection = connections.find((item) => item.id === id);

      const confirmed = await modal.confirm({
        title: 'Kết quả xét nghiệm',
        content: `Bạn nhận được kết quả từ ${connection.comp}, bạn muốn xem kết quả xét nghiệm này không?`,
        okText: 'Đồng ý',
        cancelText: 'Đóng',
      });
      if (confirmed) {
        showTestResult(connection, data);
      }
    },
    [connections],
  );

  const showTestResult = async (connection: any, data: any) => {
    NiceModal.show(TestResultModal, { connection, data });
  };
};
