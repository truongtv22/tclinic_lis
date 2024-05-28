import axios from 'axios';

import { LAB } from 'shared/constants';
import { IpcChannel } from 'shared/ipcs';
import { getBarcode } from 'shared/utils/barcode';
import { sendMessage } from 'main/utils';
import { hisLogger } from 'main/logger';

import logSendDb from 'main/database/logSend';
import dmKhopmaDb from 'main/database/dmKhopma';
import connectManageDb from 'main/database/connectManage';

import kqBW200dDb from 'main/database/kqBW200';
import kqAccess2dDb from 'main/database/kqAccess2';
import kqSysmexXP100dDb from 'main/database/kqSysmexXP100';
import kqBioSystemA15dDb from 'main/database/kqBioSystemA15';

export default {
  getKqLabDb(lab: string) {
    switch (lab) {
      case LAB.BW200:
        return kqBW200dDb;
      case LAB.Access2:
        return kqAccess2dDb;
      case LAB.SysmexXP100:
        return kqSysmexXP100dDb;
      case LAB.BioSystemA15:
        return kqBioSystemA15dDb;
    }
  },

  autoSendHis(connectId: number, id: number, data: any) {
    const connection = connectManageDb.getById(connectId);
    if (connection && connection.autosendhis) {
      this.sendHis(connectId, id, data);
    }
  },

  async sendHis(connectId: number, id: number, data: any) {
    const result = await this.send(connectId, id, data);
    sendMessage(IpcChannel.HIS_SENT, connectId, id, result);
    return result;
  },

  async send(connectId: number, id: number, data: any) {
    try {
      const connection = connectManageDb.getById(connectId);
      const kqLabDb = this.getKqLabDb(connection.lab);

      const kqxetnghiem = [];
      const logKetqua = [];
      const dmChiso = dmKhopmaDb.getByLab(connection.lab);
      if (dmChiso) {
        for (const chiso of dmChiso) {
          if (chiso.maxn in data) {
            kqxetnghiem.push({
              chiso_id: chiso.macs,
              maxn: chiso.maxn,
              ketqua: data[chiso.maxn],
            });
            if (data[chiso.maxn]) {
              logKetqua.push(`${chiso.maxn}:${data[chiso.maxn]}`);
            }
          }
        }
      }

      const postData = {
        mamay: connection.lab,
        barcode: data.barcode_edit || data.barcode,
        kqxetnghiem,
        ngaythuchien: data.date_time,
        loaidongbo: connection.loaidongbo,
      };
      hisLogger.log('Send data to HIS', postData);
      const result = await axios.post(
        'https://demo.tclinic.io/api/xetnghiem/lis-sync',
        postData,
        { validateStatus: null },
      );
      hisLogger.log('Result send data to HIS', result.data);
      if (result && result.data) {
        logSendDb.create({
          lab: connection.lab,
          barcode: getBarcode(data.barcode, data.date_time),
          barcode_edit: data.barcode_edit,
          ds_ketqua: logKetqua.join('-'),
          message: result.data.message,
        });
        if (result.data.success) {
          kqLabDb.update(id, { sendhis: 1 });
          return {
            success: true,
            message: result.data.message,
          };
        }
        return {
          success: false,
          message: result.data.message,
        };
      }
      return {
        success: false,
        message: 'Đông bộ kết quả không thành công',
      };
    } catch (error) {
      hisLogger.log('Error send data to HIS', error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  async cancelHis(connectId: number, id: number, data: any) {
    const result = await this.cancel(connectId, id, data);
    sendMessage(IpcChannel.HIS_CANCELED, connectId, id, result);
    return result;
  },

  async cancel(connectId: number, id: number, data: any) {
    try {
      const connection = connectManageDb.getById(connectId);
      const kqLabDb = this.getKqLabDb(connection.lab);

      const postData = {
        mamay: connection.lab,
        barcode: data.barcode_edit || data.barcode,
        ngaythuchien: data.date_time,
      };
      hisLogger.log('Cancel result of HIS', postData);
      const result = await axios.delete(
        'https://demo.tclinic.io/api/xetnghiem/lis-sync-delete',
        { data: postData, validateStatus: null },
      );
      hisLogger.log('Result cancel result of HIS', result.data);
      if (result && result.data) {
        if (result.data.success) {
          kqLabDb.update(id, { sendhis: 0 });
          return {
            success: true,
            message: result.data.message,
          };
        }
        return {
          success: false,
          message: result.data.message,
        };
      }
      return {
        success: false,
        message: 'Huỷ kết quả không thành công',
      };
    } catch (error) {
      hisLogger.log('Error cancel result of HIS', error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
};
