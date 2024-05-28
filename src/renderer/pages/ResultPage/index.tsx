import { Card, Radio } from 'antd';
import Split from '@uiw/react-split';

import { useConnectionState } from 'renderer/store/connection';
import { ResultLab } from './ResultLab';

export function ResultPage() {
  const { connections, selected, setSelected } = useConnectionState();

  const onSelect = (item: any) => {
    setSelected(item);
  };

  return (
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
      <Card
        className="flex-1 overflow-hidden"
        size="small"
        classNames={{ body: 'h-full' }}
      >
        {selected ? (
          <ResultLab connection={selected} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">Không có kết nối được chọn</p>
          </div>
        )}
      </Card>
    </Split>
  );
}
