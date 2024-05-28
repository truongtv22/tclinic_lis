import { useMemo } from 'react';
import NiceModal, { useModal, antdModalV5 } from '@ebay/nice-modal-react';
import { Row, Col, Input, Modal, Button } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';

import { formatDateTime } from 'shared/utils/date';
import { getLabConfig } from 'renderer/labs';

export const TestResultModal = NiceModal.create(
  ({ connection, data }: { connection: any; data: any }) => {
    const modal = useModal();

    const labConfig = useMemo(() => {
      return getLabConfig(connection.lab);
    }, []);

    const onSendHis = async () => {
      const result = await labConfig.sendHis(data.id, data);
      console.log('onSendHis', result);
      if (result.success) {
        modal.hide();
      }
    };

    return (
      <Modal
        {...antdModalV5(modal)}
        title="Kết quả xét nghiệm"
        width={800}
        footer={[
          <Button
            key="cancel"
            size="small"
            onClick={modal.hide}
          >
            Đóng
          </Button>,
          <Button
            key="sync"
            size="small"
            type="primary"
            icon={<CloudUploadOutlined />}
            onClick={onSendHis}
          >
            Đồng bộ HIS
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold">Thông tin thiết bị</div>
            <div className="space-y-1">
              <Row>
                <Col span={12}>
                  <p className="font-semibold">Thiết bị:</p>
                  <p>{connection.comp}</p>
                </Col>
                <Col span={12}>
                  <p className="font-semibold">Loại máy:</p>
                  <p>{connection.lab}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p className="font-semibold">Thời gian xét nghiệm:</p>
                  <p>{formatDateTime(data.date_time)}</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p className="font-semibold">Mã Barcode:</p>
                  <p>{data.barcode}</p>
                </Col>
                <Col span={12}>
                  <p className="font-semibold">Chỉnh sửa Barcode:</p>
                  <Input
                    value={data.barcode_edit || ''}
                    placeholder="Nhập mã barcode chỉnh sửa"
                    onChange={(e) => {}}
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold">Kết quả xét nghiệm</div>
            <Row gutter={4}>
              <Col span={12}>
                <Row className="p-1 bg-gray-100">
                  <Col span={6}>
                    <p className="font-semibold">Chỉ số</p>
                  </Col>
                  <Col span={18}>
                    <p className="font-semibold">Kết quả</p>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row className="p-1 bg-gray-100">
                  <Col span={6}>
                    <p className="font-semibold">Chỉ số</p>
                  </Col>
                  <Col span={18}>
                    <p className="font-semibold">Kết quả</p>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[4, 4]}>
              {labConfig.fields.map((field) => (
                <Col key={field.id} span={12}>
                  <Row className="px-1">
                    <Col span={6}>
                      <p>{field.title}</p>
                    </Col>
                    <Col span={18}>
                      <p>{data[field.id]}</p>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Modal>
    );
  },
);
