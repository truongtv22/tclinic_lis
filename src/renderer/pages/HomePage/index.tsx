import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Spin,
  Card,
  Form,
  Radio,
  Input,
  Space,
  Select,
  Button,
  Popconfirm,
  AutoComplete,
  Checkbox,
  Switch,
} from 'antd';
import {
  DownOutlined,
  PlusOutlined,
  SaveOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Split from '@uiw/react-split';

import {
  BOOLEAN,
  LAB,
  CONNECT_TYPE,
  COM_PORT,
  BAUD_RATE,
  DATA_BITS,
  STOP_BITS,
  RTS_MODE,
  PARITY,
  FLOW_CONTROL,
  FLAG_CONTROL,
} from 'shared/constants';
import { IpcChannel } from 'shared/ipcs/types';
import {
  createConnection,
  updateConnection,
  deleteConnection,
  selectConnectionStatus,
  useConnectionState,
} from 'renderer/store/connection';
import { useWindowIpc } from 'renderer/hooks';
import { SelectFolder } from 'renderer/components';

export function HomePage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { openViewLog } = useWindowIpc();

  const { connections, selected, setSelected } = useConnectionState();
  const connectionStatus = useSelector(selectConnectionStatus);

  const active = Form.useWatch('active', form);
  const kieuketnoi = Form.useWatch('kieuketnoi', form);

  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      form.setFieldsValue(selected);
    } else {
      form.resetFields();
    }
  }, [selected]);

  useEffect(() => {
    if (
      form.getFieldValue('kieuketnoi') === CONNECT_TYPE.SerialPort &&
      !form.getFieldValue('config')
    ) {
      form.setFieldValue('config', { dtr: true, rts: true });
    }
  }, [selected, kieuketnoi]);

  const onAdd = () => {
    setSelected(null);
  };

  const onSelect = (item: any) => {
    setSelected(item);
  };

  const onSave = async () => {
    try {
      const values = form.getFieldsValue(true);
      console.log('Submit form', values);
      setLoading(true);
      if (values.id) {
        const [, data] = await dispatch(updateConnection([values.id, values]));
        setSelected(data);
      } else {
        const data = await dispatch(createConnection([values]));
        setSelected(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onDelete = async (id: any) => {
    try {
      setLoading(true);
      await dispatch(deleteConnection([id]));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onOpen = () => {
    const values = form.getFieldsValue(true);
    window.electron.ipcRenderer.send(IpcChannel.OPEN_CONNECTION, values.id);
  };

  const onClose = () => {
    const values = form.getFieldsValue(true);
    window.electron.ipcRenderer.send(IpcChannel.CLOSE_CONNECTION, values.id);
  };

  return (
    <Spin spinning={loading} tip="Đang tải">
      <Split lineBar className="space-x-2">
        <Card className="min-w-60 max-w-[50%]" size="small">
          <div className="space-y-2">
            <p className="text-lg font-semibold">Danh sách kết nối</p>
            {connections.length > 0 ? (
              <div className="space-y-2">
                {connections.map((item) => (
                  <div key={item.id} className="flex space-x-2">
                    <Radio
                      value={1}
                      checked={item.id === selected?.id}
                      onChange={() => onSelect(item)}
                    >
                      <span
                        className={`line-clamp-2 ${
                          item.active ? '' : 'text-gray-400'
                        }`}
                      >
                        {item.comp}
                      </span>
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
          <div className="flex mb-2 justify-between">
            <p className="text-lg font-semibold">
              {selected ? 'Thông tin kết nối' : 'Thêm mới thông tin kết nối'}
            </p>
            <div className="flex space-x-1">
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                disabled={!selected}
                onClick={onAdd}
              >
                Thêm
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<SaveOutlined />}
                onClick={form.submit}
              >
                Lưu lại
              </Button>
              <Popconfirm
                title="Xoá kết nối"
                description="Bạn muốn xóa kết nối này không?"
                okText="Xoá"
                cancelText="Không"
                onConfirm={() => onDelete(selected.id)}
              >
                <Button
                  size="small"
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!selected}
                >
                  Xoá
                </Button>
              </Popconfirm>
            </div>
          </div>
          <Form
            form={form}
            layout="vertical"
            disabled={!active}
            onFinish={onSave}
          >
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Form.Item
                  name="active"
                  normalize={(v) => (v ? BOOLEAN.TRUE : BOOLEAN.FALSE)}
                  initialValue={BOOLEAN.TRUE}
                >
                  <Switch
                    disabled={!selected}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="comp"
                  label="Tên thiết bị"
                  rules={[{ required: true, message: 'Không được để trống' }]}
                >
                  <Input placeholder="Tên thiết bị" />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item
                  name="lab"
                  label="Loại máy"
                  rules={[{ required: true, message: 'Không được để trống' }]}
                >
                  <Select
                    options={Object.values(LAB).map((v) => ({
                      value: v,
                      label: v,
                    }))}
                    placeholder="Loại máy"
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item
                  name="kieuketnoi"
                  label="Kết nối"
                  rules={[{ required: true, message: 'Không được để trống' }]}
                >
                  <Select
                    options={Object.values(CONNECT_TYPE).map((v) => ({
                      value: v,
                      label: v,
                    }))}
                    placeholder="Kết nối"
                  />
                </Form.Item>
              </Col>
              {kieuketnoi === CONNECT_TYPE.SerialPort && (
                <>
                  <Col sm={24} md={12}>
                    <Form.Item
                      name="comport"
                      label="ComPort"
                      rules={[
                        { required: true, message: 'Không được để trống' },
                      ]}
                    >
                      <AutoComplete
                        options={COM_PORT.map((v) => ({
                          value: v,
                          label: v,
                        }))}
                        placeholder="ComPort"
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={12}>
                    <Form.Item
                      name="baudrate"
                      label="BaudRate"
                      initialValue={9600}
                      rules={[
                        { required: true, message: 'Không được để trống' },
                      ]}
                    >
                      <AutoComplete
                        options={BAUD_RATE.map((v) => ({
                          value: `${v}`,
                          label: v,
                        }))}
                        placeholder="BaudRate"
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={12}>
                    <Form.Item
                      name="databits"
                      label="DataBits"
                      initialValue={8}
                      rules={[
                        { required: true, message: 'Không được để trống' },
                      ]}
                    >
                      <Select
                        options={DATA_BITS.map((v) => ({ value: v, label: v }))}
                        placeholder="DataBits"
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={12}>
                    <Form.Item
                      name="stopbits"
                      label="StopBits"
                      initialValue={1}
                      rules={[
                        { required: true, message: 'Không được để trống' },
                      ]}
                    >
                      <Select
                        options={STOP_BITS.map((v) => ({ value: v, label: v }))}
                        placeholder="StopBits"
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={12}>
                    <Form.Item
                      name="rtsmode"
                      label="RtsMode"
                      initialValue="handshake"
                      rules={[
                        { required: true, message: 'Không được để trống' },
                      ]}
                    >
                      <Select options={RTS_MODE} placeholder="RtsMode" />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={12}>
                    <Form.Item
                      name="parity"
                      label="Parity"
                      initialValue="none"
                      rules={[
                        { required: true, message: 'Không được để trống' },
                      ]}
                    >
                      <Select options={PARITY} placeholder="Parity" />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="my-2 space-y-2">
                    <div
                      className="flex justify-between cursor-pointer"
                      onClick={() => setExpand(!expand)}
                    >
                      <p className="text-base font-semibold">
                        Cài đặt nâng cao
                      </p>
                      <DownOutlined
                        rotate={expand ? 0 : -90}
                        className="text-xs"
                      />
                    </div>
                    {expand && (
                      <div className="space-y-2">
                        <Form.Item
                          label="Flow control"
                          tooltip="Setting flow control"
                          dependencies={FLOW_CONTROL}
                        >
                          {() => (
                            <div className="space-x-2">
                              {FLOW_CONTROL.map((field) => (
                                <Form.Item
                                  key={field}
                                  name={['config', field]}
                                  noStyle
                                  valuePropName="checked"
                                >
                                  <Checkbox>{field}</Checkbox>
                                </Form.Item>
                              ))}
                            </div>
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Flag control"
                          tooltip="Set control flags on an open port is opened"
                          dependencies={FLAG_CONTROL}
                        >
                          {() => (
                            <div className="space-x-2">
                              {FLAG_CONTROL.map((field) => (
                                <Form.Item
                                  key={field}
                                  name={['config', field]}
                                  noStyle
                                  valuePropName="checked"
                                >
                                  <Checkbox>{field}</Checkbox>
                                </Form.Item>
                              ))}
                            </div>
                          )}
                        </Form.Item>
                      </div>
                    )}
                  </Col>
                </>
              )}
              {kieuketnoi === CONNECT_TYPE.Folder && (
                <>
                  <Col sm={24} md={12}>
                    <Form.Item name="folder">
                      <SelectFolder />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
            <Space className="my-2">
              <Button
                type="primary"
                size="small"
                disabled={
                  !active ||
                  !selected ||
                  (selected && !!connectionStatus[selected.id])
                }
                onClick={onOpen}
              >
                Mở cổng
              </Button>
              <Button
                type="primary"
                size="small"
                disabled={
                  !active ||
                  !selected ||
                  (selected && !connectionStatus[selected.id])
                }
                onClick={onClose}
              >
                Đóng cổng
              </Button>
              <Button
                size="small"
                disabled={!selected}
                onClick={() => openViewLog(selected.id)}
              >
                Xem log
              </Button>
            </Space>
          </Form>
        </Card>
      </Split>
    </Spin>
  );
}
