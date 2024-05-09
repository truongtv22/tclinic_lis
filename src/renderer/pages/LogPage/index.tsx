import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Table, Button, Card, Layout } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { formatDateTime } from 'shared/utils/date';
import { useLoggerIpc } from 'renderer/hooks/useLoggerIpc';
import { selectConnection } from 'renderer/store/connection';

export function LogPage() {
  const [searchParams] = useSearchParams();

  const connection = useSelector((state) =>
    selectConnection(state as any, +searchParams.get('connectId')),
  );

  const scope = useMemo(() => {
    const connectId = searchParams.get('connectId');
    return `connection-${connectId}`;
  }, [searchParams]);

  const { logs, clearLog } = useLoggerIpc(scope);

  return (
    <Layout>
      <Layout.Content className="py-8 px-12">
        <Card size="small">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-lg font-semibold">
                Log: {connection?.comp}
              </div>
              <div>
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => clearLog()}
                >
                  Xoá log
                </Button>
              </div>
            </div>
            <div>
              {logs.map((item, index) => (
                <div key={index} className="grid grid-cols-[200px_auto]">
                  <div className="flex space-x-1">
                    <div>{formatDateTime(item.date)}</div>
                    <div className="uppercase">[{item.level}]</div>
                  </div>
                  <div className="overflow-auto">
                    {item.data.map((item: any, index: any) => (
                      <div key={index} className="whitespace-pre-wrap">
                        {typeof item === 'string'
                          ? item
                          : JSON.stringify(item, null, 2)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Layout.Content>
    </Layout>
  );
}
