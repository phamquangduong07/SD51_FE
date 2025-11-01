import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/order", // URL backend Spring Boot chẳng hạn

  headers: {
    "Content-Type": "application/json",
  },
});
const DEFAULT_MA_NHAN_VIEN = "ND001";
const DEFAULT_MA_KHACH_HANG = "ND002";
const orderService = {
  createHoaDon(maNhanVien) {
    return axiosClient.post(`/${maNhanVien}`, { maNhanVien });
  },

  addKhachhang(maHoaDon, soDienThoai) {
    return axiosClient.patch(`/${maHoaDon}/${soDienThoai}`);
  },

  deleteHoaDon(maHoaDon) {
    return axiosClient.delete(`/${maHoaDon}`);
  },

  addSanPham(maHoaDon, sanPham) {
    return axiosClient.put(`/${maHoaDon}`, sanPham);
  },
  deleteSanPham(hoaDonChiTietId) {
    return axiosClient.delete(`/chi-tiet/${hoaDonChiTietId}`);
  },
  tinhTien(maHoaDon) {
    return axiosClient.put(`/${maHoaDon}/tinh-tien`);
  },

  // 🔹 Thanh toán hóa đơn
  // 🔹 Thanh toán hóa đơn (đã fix)
  thanhToan(maHoaDon, thanhToanRequest) {
    return axiosClient.put(`/thanh-toan/${maHoaDon}`, thanhToanRequest);
  },

  updateSoLuong(hoaDonChiTietId, soLuong) {
    return axiosClient.put(`/update-so-luong/${hoaDonChiTietId}`, { soLuong });
  },
  downloadHoaDonPDF(hoaDonId) {
      return axiosClient.get(`/${hoaDonId}/invoice`, {
    responseType: 'blob' // bắt buộc để nhận file PDF
  });
  },
};

export default orderService;
