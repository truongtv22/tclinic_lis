import { useMemo } from 'react';
import dayjs from 'dayjs';
import NiceModal, { useModal, antdModalV5 } from '@ebay/nice-modal-react';
import { Row, Col, Form, Modal, Button } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormDateTimePicker,
} from '@ant-design/pro-components';

import { parseString, DATE_TIME_FORMAT } from 'shared/utils/date';
import { getLabConfig } from 'renderer/labs';

export const AddResultModal = NiceModal.create(
  ({ connection }: { connection: any }) => {
    const modal = useModal();
    const [form] = Form.useForm();

    const labConfig = useMemo(() => {
      return getLabConfig(connection.lab);
    }, []);

    const onSubmit = async (values: any) => {
      const result = await labConfig.create(values);
      modal.resolve(result);
      modal.hide();
    };

    return (
      <Modal
        {...antdModalV5(modal)}
        title="Thêm kết quả xét nghiệm"
        width={800}
        footer={[
          <Button key="cancel" size="small" onClick={modal.hide}>
            Đóng
          </Button>,
          <Button key="sync" size="small" type="primary" onClick={form.submit}>
            Thêm mới
          </Button>,
        ]}
      >
        <ProForm form={form} onFinish={onSubmit} submitter={false}>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold">Thông tin thiết bị</div>
              <div className="space-y-1">
                <Row gutter={[16, 4]}>
                  <Col span={12}>
                    <p className="font-semibold">Thiết bị</p>
                    <p>{connection.comp}</p>
                  </Col>
                  <Col span={12}>
                    <p className="font-semibold">Loại máy</p>
                    <p>{connection.lab}</p>
                  </Col>
                  <Col span={12}>
                    <p className="font-semibold">Thời gian xét nghiệm</p>
                    <ProFormDateTimePicker
                      name="date_time"
                      fieldProps={{
                        format: DATE_TIME_FORMAT,
                        className: 'w-full',
                      }}
                      initialValue={dayjs()}
                      transform={(value) =>
                        parseString(value, DATE_TIME_FORMAT)
                      }
                      placeholder="Thời gian xét nghiệm"
                      rules={[
                        { required: true, message: 'Không được để trống' },
                      ]}
                    />
                  </Col>
                  <Col span={12}>
                    <p className="font-semibold">Mã Barcode</p>
                    <ProFormText
                      name="barcode"
                      fieldProps={{ maxLength: 4 }}
                      placeholder="Mã barcode"
                      rules={[
                        { required: true, message: 'Không được để trống' },
                      ]}
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold">Kết quả xét nghiệm</div>
              <Row gutter={[16, 4]}>
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
              <Row gutter={[16, 4]}>
                {labConfig.fields.map((field) => (
                  <Col key={field.id} span={12}>
                    <Row className="px-1">
                      <Col span={6} className="flex items-center">
                        <p>{field.title}</p>
                      </Col>
                      <Col span={18}>
                        <ProFormText
                          name={field.id}
                          placeholder={field.title}
                        />
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </ProForm>
      </Modal>
    );
  },
);
