import { useEffect, useState } from 'react';
import { produce } from 'immer';
import dayjs from 'dayjs';
import {
  App,
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
  InputNumber,
  AutoComplete,
} from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import Split from '@uiw/react-split';
import {
  LAB,
  CONNECT_TYPE,
  COM_PORT,
  BAUD_RATE,
  DATA_BITS,
  STOP_BITS,
  RTS_MODE,
  PARITY,
} from 'shared/constants';
import { useStore } from 'renderer/hooks/useStore';
import { useDispatch } from 'renderer/hooks/useDispatch';
import { useIpcRenderer } from 'renderer/hooks/useIpcRenderer';
import { connectionActions } from 'shared/store/connection/slice';
import { getConnections } from 'shared/store/connection/actions';
import { IpcChannels } from 'shared/ipcs/types';

export function HomePage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const connectionList = useStore((store) => store.connection?.connectionList);
  console.log('connectionList', connectionList);

  const [connectManager, setConnectManager] = useState({});

  const kieuketnoi = Form.useWatch('kieuketnoi', form);

  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<any>({});
  const [globalLoading, setGlobalLoading] = useState(false);

  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);

  const { modal, notification } = App.useApp();

  const getData = async () => {
    // const result = await window.dbApi.getConnect();
    // if (result.success) {
    //   return result.data;
    // }
    return null;
  };

  // useEffect(() => {
  //   dispatch(getConnections());
  // }, []);

  useEffect(() => {
    (async () => {
      const data = await getData();
      if (data && data.length > 0) {
        setDevices(data);
        setSelected(data[0]);
      }
    })();
  }, []);

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

  useEffect(() => {
    (async () => {
      // Get all connected ports
      // const data = await window.electron.ipcRenderer.invoke('connected-ports');
      // console.log('data', data);
    })();
  }, []);

  // useIpcRenderer('port-opened', () => {});

  // useIpcRenderer('port-closed', () => {});

  // useIpcRenderer('port-error', () => {});

  useEffect(() => {
    // const openSub = window.electron.serialport.on('open', () => {
    //   setConnected(true);
    // });
    // const errorSub = window.electron.serialport.on('error', (error: any) => {
    //   notification.error({
    //     message: 'SerialPort',
    //     description: error.message,
    //   });
    // });
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
    // const closeSub = window.electron.serialport.on('close', () => {
    //   setConnected(false);
    // });
    // return () => {
    //   openSub();
    //   errorSub();
    //   dataSub();
    //   closeSub();
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

  const onSave = async (values: any) => {
    console.log('onSubmit', values);
    // setLoading(true);
    // if (values.id) {
    //   const result = await window.dbApi.updateConnect(values);
    //   console.log('result', result);
    //   if (result.success) {
    //     const newDevices = produce(devices, (draft) => {
    //       const index = draft.findIndex((item) => item.id === values.id);
    //       if (index > -1) {
    //         draft.splice(index, 1, result.data);
    //       }
    //     });
    //     setDevices(newDevices);
    //     notification.success({
    //       message: 'Thành công',
    //       description: 'Cập nhật kết nối thành công',
    //     });
    //   }
    // } else {
    //   const result = await window.dbApi.createConnect(values);
    //   console.log('result', result);
    //   if (result.success) {
    //     const newDevices = produce(devices, (draft) => {
    //       draft.push(result.data);
    //     });
    //     setDevices(newDevices);
    //     setSelected(result.data);
    //     notification.success({
    //       message: 'Thành công',
    //       description: 'Thêm mới kết nối thành công',
    //     });
    //   }
    // }
    // setLoading(false);
  };

  const onDelete = async (id: any) => {
    // setLoading(true);
    // const result = await window.dbApi.deleteConnect(id);
    // console.log('result', result);
    // if (result.success) {
    //   const newDevices = produce(devices, (draft) => {
    //     const index = draft.findIndex((item) => item.id === id);
    //     if (index > -1) {
    //       draft.splice(index, 1);
    //     }
    //   });
    //   setDevices(newDevices);
    //   if (newDevices.length > 0) {
    //     setSelected(newDevices[0]);
    //   } else {
    //     setSelected(null);
    //   }
    //   notification.success({
    //     message: 'Thành công',
    //     description: 'Xoá kết nối thành công',
    //   });
    // }
    // setLoading(false);
  };

  const onOpen = () => {
    const params = form.getFieldsValue();
    // window.electron.serialport.connect(params);
  };

  const onClose = () => {
    const params = form.getFieldsValue();
    // window.electron.serialport.disconnect({ id: params.id });
  };

  const onViewLog = () => {
    window.electron.ipcRenderer.send(IpcChannels.OPEN_VIEW_WINDOW);
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
            disabled={globalLoading}
            onClick={() => setIsModalOpen(false)}
          >
            Đóng
          </Button>,
          <Button
            key="sync"
            size="small"
            type="primary"
            icon={<CloudUploadOutlined />}
            loading={globalLoading}
            onClick={async () => {
              // try {
              //   setGlobalLoading(true);
              //   const result = await window.electron.ipcRenderer.invoke(
              //     'dong-bo-his',
              //     testResult,
              //   );
              //   setIsModalOpen(false);
              //   setGlobalLoading(false);
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
              //   setGlobalLoading(false);
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
          <Form form={form} layout="vertical" onFinish={onSave}>
            <Row
              gutter={8}
              align="middle"
              justify="space-between"
              className="mb-2"
            >
              <Col>
                <p className="text-lg font-semibold">
                  {selected
                    ? 'Thông tin kết nối'
                    : 'Thêm mới thông tin kết nối'}
                </p>
              </Col>
              <Row gutter={4}>
                <Col>
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    disabled={!selected}
                    onClick={onAdd}
                  >
                    Thêm
                  </Button>
                </Col>
                <Col>
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="small"
                    icon={<SaveOutlined />}
                  >
                    Lưu lại
                  </Button>
                </Col>
                <Col>
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
                </Col>
              </Row>
            </Row>
            <Form.Item name="id" hidden />
            <Form.Item
              name="comp"
              label="Tên thiết bị"
              rules={[{ required: true, message: 'Không được để trống' }]}
            >
              <Input />
            </Form.Item>
            <Row gutter={8}>
              <Col sm={24} md={12}>
                <Form.Item
                  name="lab"
                  label="Loại máy"
                  initialValue="BW200"
                  rules={[{ required: true, message: 'Không được để trống' }]}
                >
                  <Select
                    options={Object.values(LAB).map((v) => ({
                      value: v,
                      label: v,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item
                  name="kieuketnoi"
                  label="Kết nối"
                  initialValue="SerialPort"
                  rules={[{ required: true, message: 'Không được để trống' }]}
                >
                  <Select
                    options={Object.values(CONNECT_TYPE).map((v) => ({
                      value: v,
                      label: v,
                    }))}
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
                      <Select options={RTS_MODE} />
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
                      <Select options={PARITY} />
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Row gutter={8}>
                  <Col sm={24} md={12}>
                    <Form.Item
                      name="readtimeout"
                      label="ReadTimeout"
                      initialValue={-1}
                    >
                      <InputNumber min={-1} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={12}>
                    <Form.Item
                      name="writetimeout"
                      label="WriteTimeout"
                      initialValue={-1}
                    >
                      <InputNumber min={-1} className="w-full" />
                    </Form.Item>
                  </Col>
                </Row> */}
              </>
            )}
            <Space>
              <Button
                type="primary"
                size="small"
                disabled={connected}
                onClick={onOpen}
              >
                Mở cổng
              </Button>
              <Button
                type="primary"
                size="small"
                disabled={!connected}
                onClick={onClose}
              >
                Đóng cổng
              </Button>
              <Button size="small" onClick={onViewLog}>
                Xem nhật ký
              </Button>
            </Space>
          </Form>
        </Card>
      </Split>
    </Spin>
  );
}
