import { cloneElement, useState, useEffect, useMemo } from 'react';
import { produce } from 'immer';
import dayjs from 'dayjs';
import {
  Row,
  Col,
  Input,
  Space,
  Table,
  Button,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProColumnType,
  ProFormDatePicker,
  EditableProTable,
} from '@ant-design/pro-components';
import {
  // StopOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  HistoryOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import NiceModal from '@ebay/nice-modal-react';

import { BOOLEAN } from 'shared/constants';
import { parseString, DATE_TIME_FORMAT } from 'shared/utils/date';
import { getLabConfig } from 'renderer/labs';
import { message, modal, useIpcListener } from 'renderer/hooks';
import { AddResultModal, CancelHisModal, HistoryHisModal } from '../base';
import { IpcChannel } from 'shared/ipcs/types';

const THOIGIAN_COLUMNN: ProColumnType<any, 'dateTime'> = {
  title: 'Thời gian',
  dataIndex: 'date_time',
  width: 165,
  fixed: 'left',
  valueType: 'dateTime',
  fieldProps: {
    format: DATE_TIME_FORMAT,
    placeholder: 'Thời gian',
  },
  formItemProps: {
    normalize: (value) => parseString(value, DATE_TIME_FORMAT),
    rules: [{ required: true, message: 'Không được để trống' }],
  },
};

const BARCODE_COLUMNN: ProColumnType<any> = {
  title: 'Barcode',
  dataIndex: 'barcode_edit',
  width: 70,
  fixed: 'left',
  render(dom, row) {
    return (
      <Space>
        {row.barcode_edit}
        <span className={classNames({ 'line-through': row.barcode_edit })}>
          {row.barcode}
        </span>
      </Space>
    );
  },
  fieldProps: {
    maxLength: 4,
    placeholder: 'Sửa barcode',
  },
  formItemProps: (form, { entity }) => ({
    getValueProps: (value) => ({ value: value ?? entity.barcode }),
  }),
};

export function ResultLab({ connection }: { connection: any }) {
  const [form] = ProForm.useForm();

  const formValues = {
    startDate: dayjs().subtract(7, 'day').startOf('day'),
    endDate: dayjs().endOf('day'),
    status: -1,
  };

  const [dataSource, setDataSource] = useState([]);
  const [editableKeys, setEditableKeys] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const labConfig = useMemo(() => {
    return getLabConfig(connection.lab);
  }, [connection]);

  useEffect(() => {
    form.resetFields();
    getData(formValues);
  }, [labConfig]);

  useIpcListener(
    IpcChannel.HIS_SENT,
    async (connectId, id, result) => {
      if (connection.id === connectId && result.success) {
        setDataSource(
          produce((draft) => {
            const index = draft.findIndex((item) => item.id === id);
            if (index > -1) {
              draft[index].sendhis = BOOLEAN.TRUE;
              setEditableKeys(
                produce((draft) => {
                  removeById(draft, id);
                }),
              );
              setSelectedRowKeys(
                produce((draft) => {
                  removeById(draft, id);
                }),
              );
            }
          }),
        );
      }
    },
    [connection],
  );

  useIpcListener(
    IpcChannel.HIS_CANCELED,
    async (connectId, id, result) => {
      if (connection.id === connectId && result.success) {
        setDataSource(
          produce((draft) => {
            const index = draft.findIndex((item) => item.id === id);
            if (index > -1) {
              draft[index].sendhis = BOOLEAN.FALSE;
            }
          }),
        );
      }
    },
    [connection],
  );

  const getData = async (params: any = {}) => {
    setEditableKeys([]);
    setSelectedRowKeys([]);
    if (params.startDate) params.startDate = parseString(params.startDate);
    if (params.endDate) params.endDate = parseString(params.endDate);
    const result = await labConfig.getAll(params);
    if (result.success) {
      setDataSource(result.data);
    } else {
      setDataSource([]);
    }
  };

  const removeById = (array: any[], id: number) => {
    const index = array.indexOf(id);
    if (index > -1) array.splice(index, 1);
  };

  const onCreate = async () => {
    const result: any = await NiceModal.show(AddResultModal, { connection });
    if (result && result.success) {
      setDataSource(
        produce((draft: any[]) => {
          draft.unshift(result.data);
        }),
      );
      message.success('Thêm mới thành công');
    }
  };

  const onUpdate = async (id: number, values: any) => {
    const result = await labConfig.update(id, values);
    if (result && result.success) {
      setDataSource(
        produce((draft) => {
          const index = draft.findIndex((item) => item.id === id);
          if (index > -1) Object.assign(draft[index], result.data);
        }),
      );
      message.success('Lưu thành công');
    }
  };

  const onDelete = async (id: any) => {
    const result = await labConfig.delete(id);
    if (result.success) {
      setDataSource(
        produce((draft) => {
          const index = draft.findIndex((item) => item.id === id);
          if (index > -1) draft.splice(index, 1);
        }),
      );
      message.success('Xóa thành công');
    }
  };

  const onHistory = () => {
    NiceModal.show(HistoryHisModal, { connection });
  };

  const onSendHis = async (selectedItems: any[]) => {
    const confirmed = await modal.confirm({
      title: 'Đồng bộ HIS',
      okText: 'Xác nhận',
      content: 'Xác nhận đồng bộ kết quả sang HIS?',
    });
    if (confirmed) {
      const results = await labConfig.bulkSendHis(connection.id, selectedItems);
      if (
        Array.isArray(results) &&
        results.every(
          (item) => item.status === 'fulfilled' && item.value.success,
        )
      ) {
        message.success('Đồng bộ kết quả HIS thành công');
      }
    }
  };

  const onCancelHis = async () => {
    NiceModal.show(CancelHisModal, { connection });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Kết quả xét nghiệm</h4>
        <ProForm
          form={form}
          initialValues={formValues}
          onFinish={getData}
          submitter={{
            searchConfig: {
              resetText: 'Làm mới',
              submitText: 'Tìm kiếm',
            },
            render: (_, dom) => (
              <div className="flex mt-2 gap-2 justify-end">{dom}</div>
            ),
            onReset: getData,
          }}
        >
          <Row gutter={[8, 8]}>
            <Col span={12} xl={6}>
              <ProFormDatePicker
                name="startDate"
                label="Từ ngày"
                placeholder="Từ ngày"
                fieldProps={{ className: 'w-full' }}
              />
            </Col>
            <Col span={12} xl={6}>
              <ProFormDatePicker
                name="endDate"
                label="Đến ngày"
                placeholder="Đến ngày"
                fieldProps={{ className: 'w-full' }}
              />
            </Col>
            <Col span={12} xl={6}>
              <ProFormText
                name="barcode"
                label="Barcode"
                placeholder="Barcode"
              />
            </Col>
            <Col span={12} xl={6}>
              <ProFormSelect
                name="status"
                label="Trạng thái"
                placeholder="Tất cả"
                options={[
                  {
                    value: -1,
                    label: 'Tất cả',
                  },
                  {
                    value: 1,
                    label: 'Đã gửi sang HIS',
                  },
                  {
                    value: 0,
                    label: 'Chưa gửi sang HIS',
                  },
                ]}
              />
            </Col>
          </Row>
        </ProForm>
      </div>
      <EditableProTable
        rowKey="id"
        value={dataSource}
        headerTitle={
          <Space>
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreate}
            >
              Thêm mới
            </Button>
            <Button size="small" icon={<HistoryOutlined />} onClick={onHistory}>
              Lịch sử
            </Button>
          </Space>
        }
        scroll={{ x: 'max-content' }}
        columns={[
          THOIGIAN_COLUMNN,
          BARCODE_COLUMNN,
          Table.SELECTION_COLUMN,
          ...labConfig.getColumns(),
          {
            valueType: 'option',
            width: 50,
            fixed: 'right',
            render: (text, row, index, action) => (
              <div>
                <Tooltip title="Chỉnh sửa" placement="left">
                  <Button
                    size="small"
                    disabled={row.sendhis === BOOLEAN.TRUE}
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => action.startEditable(row.id)}
                  />
                </Tooltip>
                <Tooltip title="Xoá" placement="right">
                  <Popconfirm
                    title="Xác nhận xoá?"
                    onConfirm={() => onDelete(row.id)}
                  >
                    <Button
                      size="small"
                      type="link"
                      icon={<DeleteOutlined />}
                      danger
                    />
                  </Popconfirm>
                </Tooltip>
              </div>
            ),
          },
        ]}
        options={{
          density: false,
          reload: () => getData(form.getFieldsValue()),
          setting: true,
        }}
        toolbar={{ className: '*:py-1' }}
        toolBarRender={() => [
          <Button
            key="button"
            size="small"
            // icon={<StopOutlined />}
            onClick={onCancelHis}
          >
            Huỷ KQ HIS
          </Button>,
        ]}
        tableAlertRender={({ selectedRowKeys }) => (
          <span>Đã chọn {selectedRowKeys.length} kết quả</span>
        )}
        tableAlertOptionRender={({ selectedRows, onCleanSelected }) => (
          <Space size={8}>
            <Button size="small" onClick={onCleanSelected}>
              Huỷ
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => onSendHis(selectedRows)}
            >
              Đồng bộ HIS
            </Button>
          </Space>
        )}
        rowSelection={{
          columnTitle: 'Gửi HIS',
          columnWidth: 60,
          getCheckboxProps: (row: any) => ({
            disabled: row.sendhis === BOOLEAN.TRUE,
          }),
          renderCell: (value, row, index, node) =>
            cloneElement(
              node as any,
              row.sendhis === BOOLEAN.TRUE ? { checked: true } : {},
            ),
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        editable={{
          type: 'multiple',
          saveText: (
            <Tooltip title="Lưu" placement="left">
              <Button size="small" type="link" icon={<SaveOutlined />} />
            </Tooltip>
          ),
          cancelText: (
            <Tooltip title="Huỷ bỏ" placement="right">
              <Button
                size="small"
                type="link"
                icon={<CloseOutlined />}
                danger
              />
            </Tooltip>
          ),
          actionRender: (row, config, dom) => [
            <div key="action">
              {dom.save}
              {dom.cancel}
            </div>,
          ],
          editableKeys,
          onChange: setEditableKeys,
          onSave: onUpdate,
        }}
        cardProps={{ bodyStyle: { padding: 0 } }}
        // components={{
        //   table: (props) => (
        //     <table
        //       {...props}
        //       onKeyDown={() => console.log('onKeyDown')}
        //     />
        //   ),
        // body: {
        //   cell: (props) => (
        //     <td
        //       {...props}
        //       tabIndex={1}
        //       className={classNames(props.className, '')}
        //     />
        //   ),
        // },
        // }}
        pagination={{ position: ['bottomRight'] }}
        columnEmptyText={false}
        recordCreatorProps={false}
      />
    </div>
  );
}
