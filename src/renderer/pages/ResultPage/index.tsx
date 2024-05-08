import { useMemo, useState } from 'react';
import { Spin, Card, Radio } from 'antd';
import Split from '@uiw/react-split';

import { LAB } from 'shared/constants';
import { useConnectionState } from 'renderer/store/connection';
import { ResultLab } from './ResultLab';
import { LabConfig } from './LabConfig';
import { BW200Config } from './BW200Config';
import { Access2Config } from './Access2Config';
import { SysmexXP100Config } from './SysmexXP100Config';

export function ResultPage() {
  const { connections, selected, setSelected } = useConnectionState();

  const labConfig = useMemo(() => {
    if (selected) {
      if (selected.lab === LAB.BW200) return new BW200Config();
      if (selected.lab === LAB.Access2) return new Access2Config();
      if (selected.lab === LAB.SysmexXP100) return new SysmexXP100Config();
    }
    return new LabConfig();
  }, [selected]);

  const [loading, setLoading] = useState(false);

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
          <ResultLab labConfig={labConfig} />
        </Card>
      </Split>
    </Spin>
  );
}
