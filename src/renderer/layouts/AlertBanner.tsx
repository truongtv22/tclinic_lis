import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';

import { IpcChannel } from 'shared/ipcs/types';
import { useIpcListener } from 'renderer/hooks';
import { selectConnections } from 'renderer/store/connection';
import { formatDateTime } from 'shared/utils/date';

export const AlertBanner = () => {
  const connections = useSelector(selectConnections);

  const timeoutId = useRef<any>();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => setMessage(null), 30000);
    }
  }, [message]);

  useIpcListener(IpcChannel.CONNECTION_DATA, async (id, data) => {
    const connection = connections.find((item) => item.id === id);
    setMessage(
      `Đọc xong kết quả từ <b>${
        connection?.comp
      }</b> (<b>${formatDateTime()}</b>)`,
    );
  }, [connections]);

  useIpcListener(IpcChannel.HIS_SENT, async (connectId, id, result) => {
    const connection = connections.find((item) => item.id === connectId);
    setMessage(
      `Gửi kết quả từ <b>${connection?.comp}</b> vào HIS: ${
        result?.message
      } (<b>${formatDateTime()}</b>)`,
    );
  }, [connections]);

  useIpcListener(IpcChannel.HIS_CANCELED, async (connectId, id, result) => {
    const connection = connections.find((item) => item.id === connectId);
    setMessage(
      `Huỷ kết quả HIS từ <b>${connection?.comp}</b>: ${
        result?.message
      } (<b>${formatDateTime()}</b>)`,
    );
  }, [connections]);

  if (!message) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <Alert
        type="info"
        banner
        message={<div dangerouslySetInnerHTML={{ __html: message }} />}
        // message={<Marquee pauseOnHover>{message}</Marquee>}
        // action={
        //   <Button size="small" type="link">
        //     Xem thêm
        //   </Button>
        // }
        closable
        onClose={() => setMessage(null)}
      />
    </div>
  );
};
