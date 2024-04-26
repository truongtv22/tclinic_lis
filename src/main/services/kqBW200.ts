import axios from 'axios';
import { LAB } from 'shared/constants';
import kqBW200Db from 'main/database/kqBW200';
import dmKhopmaDb from 'main/database/dmKhopma';

export default {
  getAll(params = {}) {
    try {
      const result = kqBW200Db.queryAll(params);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, message: error };
    }
  },

  async sendHis(id: number, data: any) {
    try {
      const dmChiso = dmKhopmaDb.getByLab(LAB.BW200);
      const chisoById: { [key: string]: string } = {};
      for (const chiso of dmChiso) {
        chisoById[chiso.maxn] = chiso.macs;
      }

      const postData: { [key: string]: any } = {
        mamay: LAB.BW200,
        barcode: data.barcode_edit || data.barcode,
        kqxetnghiem: [],
        ngaythuchien: new Date(data.date_time).toISOString(),
        loaidongbo: 'ONE',
      };
      for (const chiso in chisoById) {
        const chisoId = chisoById[chiso];
        postData.kqxetnghiem.push({
          chiso_id: chisoId,
          maxn: chiso,
          ketqua: data[chiso],
        });
      }

      const result = await axios.post(
        'https://demo.tclinic.io/api/xetnghiem/lis-sync',
        postData,
      );
      if (result.data && result.data.success) {
        kqBW200Db.update(id, { sendhis: 1 });
        return {
          success: true,
          message: result.data.message,
        };
      }
      return {
        success: true,
        message: 'Đông bộ kết quả không thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
};
