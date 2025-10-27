import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/api/order', // URL backend Spring Boot chẳng hạn
  headers: {
    'Content-Type': 'application/json',
  },
});
const DEFAULT_MA_NHAN_VIEN = 'ND001';
const orderService = {
  createHoaDon(maNhanVien) {
    return axiosClient.post(`/${maNhanVien}`, { maNhanVien });
  },

}
export default orderService;