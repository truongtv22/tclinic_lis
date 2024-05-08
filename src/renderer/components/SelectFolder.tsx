import { Button } from 'antd';
import { FolderAddOutlined } from '@ant-design/icons';

import { useWindowIpc } from 'renderer/hooks';

export const SelectFolder = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const { selectFolder } = useWindowIpc();

  const onSelect = async () => {
    const folder = await selectFolder();
    if (folder) {
      onChange(folder);
    }
  };

  return (
    <div className="space-y-1">
      <Button
        icon={<FolderAddOutlined />}
        type="dashed"
        onClick={onSelect}
        className="w-full"
      >
        Chọn thư mục
      </Button>
      <p>{value}</p>
    </div>
  );
};
