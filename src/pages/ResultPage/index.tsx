import { useEffect, useState } from 'react';
import { App, Spin, Card, Radio } from 'antd';
import Split from '@uiw/react-split';

export function ResultPage() {
  const [loading, setLoading] = useState(false);

  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);

  const { modal, notification } = App.useApp();

  const getData = async () => {
    const result = await window.dbApi.getConnect();
    if (result.success) {
      return result.data;
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      const data = await getData();
      if (data && data.length > 0) {
        setDevices(data);
        setSelected(data[0]);
      }
    })();
  }, []);

  const onSelect = (item: any) => {
    setSelected(item);
  };

  return (
    <Spin spinning={loading} tip="Đang tải">
      <Split lineBar className="space-x-2">
        <Card className="min-w-60 max-w-[50%]" size="small">
          <div className="space-y-2">
            <p className="text-lg font-semibold">Danh sách thiết bị</p>
            {devices.length > 0 ? (
              <div className="space-y-2">
                {devices.map((item) => (
                  <div key={item.id} className="flex space-x-2">
                    <Radio
                      value={1}
                      checked={item.id === selected?.id}
                      onChange={() => onSelect(item)}
                    >
                      <span className="line-clamp-2">{item.comp}</span>
                    </Radio>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Danh sách trống</p>
            )}
          </div>
        </Card>
        <Card className="flex-1" size="small">
          <div>
            <p className="text-lg font-semibold">Kết quả xét nghiệm</p>
          </div>
        </Card>
      </Split>
    </Spin>
  );
}
