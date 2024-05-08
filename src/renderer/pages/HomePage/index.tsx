import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { produce } from 'immer';
import dayjs from 'dayjs';
import {
  Row,
  Col,
  Spin,
  Card,
  Form,
  Radio,
  Modal,
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
  CloudUploadOutlined,
} from '@ant-design/icons';
import Split from '@uiw/react-split';

import {
  CONNECT_ACTIVE,
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
import {
  createConnection,
  updateConnection,
  deleteConnection,
  selectConnectionStatus,
  useConnectionState,
} from 'renderer/store/connection';
import {
  modal,
  message,
  notification,
  useWindowIpc,
  useConnectionIpc,
} from 'renderer/hooks';
import { SelectFolder } from 'renderer/components';

export function HomePage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { openViewLog } = useWindowIpc();

  const { connections, selected, setSelected } = useConnectionState();
  const connectionStatus = useSelector(selectConnectionStatus);

  const { openConnection, closeConnection } = useConnectionIpc();

  const active = Form.useWatch('active', form);
  const kieuketnoi = Form.useWatch('kieuketnoi', form);

  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>({});
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      form.setFieldsValue(selected);
    } else {
      form.resetFields();
    }
  }, [selected]);

  useEffect(() => {
    if (!isModalOpen) {
      setTestResult({});
    }
  }, [isModalOpen]);

  // useEffect(() => {
  //   if (kieuketnoi === CONNECT_TYPE.SerialPort && !form.getFieldValue('config')) {
  //     form.setFieldValue('config', { dtr: true, rts: true });
  //   }
  // }, [kieuketnoi]);

  useEffect(() => {
    // const dataSub = window.electron.serialport.on('data', (data) => {
    //   const notifyKey = `open-${Date.now()}`;
    //   notification.open({
    //     key: notifyKey,
    //     message: 'Thông báo đồng bộ',
    //     description:
    //       'Bạn nhận được kết quả từ Máy xét nghiệm nước tiểu, bạn muốn xem kết quả trước khi đồng bộ tới HIS không?',
    //     btn: (
    //       <Space>
    //         <Button
    //           type="link"
    //           size="small"
    //           onClick={() => notification.destroy(notifyKey)}
    //         >
    //           Đóng
    //         </Button>
    //         <Button
    //           size="small"
    //           type="primary"
    //           onClick={() => {
    //             notification.destroy(notifyKey);
    //             setIsModalOpen(true);
    //             setTestResult(data);
    //           }}
    //         >
    //           Kết quả xét nghiệm
    //         </Button>
    //       </Space>
    //     ),
    //   });
    // });
    // return () => {
    //   dataSub();
    // };
  }, []);

  useEffect(() => {
    // const notifySub = window.electron.ipcRenderer.on(
    //   'notification-data',
    //   async (data) => {
    //     const confirmed = await modal.confirm({
    //       title: 'Kết quả xét nghiệm',
    //       content:
    //         'Bạn nhận được kết quả từ Máy xét nghiệm nước tiểu, bạn muốn xem kết quả xét nghiệm này không?',
    //       okText: 'Đồng ý',
    //       cancelText: 'Đóng',
    //     });
    //     if (confirmed) {
    //       setIsModalOpen(true);
    //       setTestResult(data);
    //     }
    //   },
    // );
    // return () => notifySub();
  }, []);

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
    openConnection(values.id);
  };

  const onClose = () => {
    const values = form.getFieldsValue(true);
    closeConnection(values.id);
  };

  return (
    <Spin spinning={loading} tip="Đang tải">
      <Modal
        title="Kết quả xét nghiệm"
        open={isModalOpen}
        width={800}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            size="small"
            disabled={modalLoading}
            onClick={() => setIsModalOpen(false)}
          >
            Đóng
          </Button>,
          <Button
            key="sync"
            size="small"
            type="primary"
            icon={<CloudUploadOutlined />}
            loading={modalLoading}
            onClick={async () => {
              // try {
              //   setModalLoading(true);
              //   const result = await window.electron.ipcRenderer.invoke(
              //     'dong-bo-his',
              //     testResult,
              //   );
              //   setIsModalOpen(false);
              //   setModalLoading(false);
              //   if (result.success) {
              //     notification.success({
              //       message: 'Đồng bộ HIS',
              //       description: result.message,
              //     });
              //   } else {
              //     notification.error({
              //       message: 'Đồng bộ HIS',
              //       description: result.message,
              //     });
              //   }
              // } catch (error) {
              //   setModalLoading(false);
              //   notification.error({
              //     message: 'Đồng bộ HIS',
              //     description: error.message,
              //   });
              // }
            }}
          >
            Đồng bộ HIS
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-base font-semibold">Thông tin thiết bị</div>
            <div className="space-y-1">
              <Row>
                <Col span={12}>
                  <p className="font-semibold">Thiết bị:</p>
                  <p>Máy xét nghiệm nước tiểu</p>
                </Col>
                <Col span={12}>
                  <p className="font-semibold">Loại máy:</p>
                  <p>BW200</p>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p className="font-semibold">Mã Barcode:</p>
                  <p>{testResult.barcode}</p>
                </Col>
                <Col span={12}>
                  <p className="font-semibold">Chỉnh sửa Barcode:</p>
                  <Input
                    value={testResult.barcode_edit || ''}
                    placeholder="Nhập mã barcode chỉnh sửa"
                    onChange={(e) =>
                      setTestResult(
                        produce((draft: any) => {
                          draft.barcode_edit = e.target.value;
                        }),
                      )
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <p className="font-semibold">Thời gian xét nghiệm:</p>
                  <p>{dayjs(testResult.datetime).format('HH:mm DD-MM-YYYY')}</p>
                </Col>
              </Row>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-base font-semibold">Kết quả xét nghiệm</div>
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
              {[
                { index: 'URO', name: 'URO' },
                { index: 'BIL', name: 'BIL' },
                { index: 'KET', name: 'KET' },
                { index: 'BLD', name: 'BLD' },
                { index: 'PRO', name: 'PRO' },
                { index: 'NIT', name: 'NIT' },
                { index: 'LEU', name: 'LEU' },
                { index: 'GLU', name: 'GLU' },
                { index: 'SG', name: 'SG' },
                { index: 'PH', name: 'PH' },
                { index: 'VC', name: 'VC' },
              ].map((item) => (
                <Col key={item.index} span={12}>
                  <Row className="px-1">
                    <Col span={6}>
                      <p>{item.name}</p>
                    </Col>
                    <Col span={18}>
                      <p>{testResult[item.index] ?? '-'}</p>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Modal>
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
            <Form.Item
              name="active"
              getValueFromEvent={(v) =>
                v ? CONNECT_ACTIVE.ON : CONNECT_ACTIVE.OFF
              }
            >
              <Switch
                disabled={false}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="comp"
              label="Tên thiết bị"
              rules={[{ required: true, message: 'Không được để trống' }]}
            >
              <Input placeholder="Tên thiết bị" />
            </Form.Item>
            <Row gutter={8}>
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
            </Row>
            {kieuketnoi === CONNECT_TYPE.SerialPort && (
              <>
                <Row gutter={8}>
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
                        options={BAUD_RATE.map((v) => ({ value: v, label: v }))}
                        placeholder="BaudRate"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
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
                </Row>
                <Row gutter={8}>
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
                </Row>
                <div className="my-2">
                  <div
                    className="flex justify-between cursor-pointer"
                    onClick={() => setExpand(!expand)}
                  >
                    <p className="text-base font-semibold">Cài đặt nâng cao</p>
                    <DownOutlined
                      rotate={expand ? 0 : -90}
                      className="text-xs"
                    />
                  </div>
                  {expand && (
                    <div className="mt-2">
                      <Form.Item
                        label="Flow control"
                        tooltip="Setting flow control"
                        dependencies={FLOW_CONTROL}
                      >
                        {() =>
                          FLOW_CONTROL.map((field) => (
                            <Form.Item
                              key={field}
                              name={['config', field]}
                              noStyle
                              valuePropName="checked"
                            >
                              <Checkbox>{field}</Checkbox>
                            </Form.Item>
                          ))
                        }
                      </Form.Item>
                      <Form.Item
                        label="Flag control"
                        tooltip="Set control flags on an open port is opened"
                        dependencies={FLAG_CONTROL}
                      >
                        {() =>
                          FLAG_CONTROL.map((field) => (
                            <Form.Item
                              key={field}
                              name={['config', field]}
                              noStyle
                              valuePropName="checked"
                            >
                              <Checkbox>{field}</Checkbox>
                            </Form.Item>
                          ))
                        }
                      </Form.Item>
                    </div>
                  )}
                </div>
              </>
            )}
            {kieuketnoi === CONNECT_TYPE.Folder && (
              <>
                <Row gutter={8}>
                  <Col sm={24} md={12}>
                    <Form.Item name="folder">
                      <SelectFolder />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
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
