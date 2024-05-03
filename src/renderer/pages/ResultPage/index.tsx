import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Card, Radio } from 'antd';
import Split from '@uiw/react-split';
import { getConnections, selectConnections } from 'renderer/store/connection';
import { ResultLab } from './ResultLab';

export function ResultPage() {
  const dispatch = useDispatch();

  const connections = useSelector(selectConnections);

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(getConnections());
  }, []);

  useEffect(() => {
    if (selected) {
      const found = connections.find((item) => item.id === selected.id);
      if (found) {
        setSelected(found);
      } else {
        setSelected(connections[0]);
      }
    } else {
      setSelected(connections[0]);
    }
  }, [connections]);

  const onSelect = (item: any) => {
    setSelected(item);
  };

  return (
    <Spin spinning={loading} tip="Đang tải">
      <Split lineBar className="space-x-2">
        <Card className="min-w-60 max-w-[50%]" size="small">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Danh sách kết nối</h4>
            {connections.length > 0 ? (
              <div className="space-y-2">
                {connections.map((item) => (
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
        <Card className="flex-1 overflow-hidden" size="small">
          <ResultLab />
        </Card>
      </Split>
    </Spin>
  );
}
