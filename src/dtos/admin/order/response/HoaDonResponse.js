export default class HoaDonResponse {
constructor({
    id = null,
    ma = '',
    loaiHoaDon = '', // "TAI_QUAY"
    giaGoc = 0,
    giaGiamGia = 0,
    thanhTien = 0,
    soTienThanhToan = 0,
    trangThaiHoaDon = '',
    phuongThuc = '',
    ngayTao = null,
    ngaySua = null,
    maNhanVien = '',
    maKhachHang = '',
    chiTietList = [],
  } = {}) {
    this.id = id;                    // UUID
    this.ma = ma;                    // String
    this.loaiHoaDon = loaiHoaDon;    // String
    this.giaGoc = giaGoc;            // BigDecimal -> Number
    this.giaGiamGia = giaGiamGia;    // BigDecimal -> Number
    this.thanhTien = thanhTien;      // BigDecimal -> Number
    this.soTienThanhToan = soTienThanhToan; // BigDecimal -> Number
    this.trangThaiHoaDon = trangThaiHoaDon; // String
    this.phuongThuc = phuongThuc;    // String
    this.ngayTao = ngayTao;          // LocalDateTime -> String hoặc Date
    this.ngaySua = ngaySua;          // LocalDateTime -> String hoặc Date
    this.maNhanVien = maNhanVien;    // String
    this.maKhachHang = maKhachHang;  // String
    this.chiTietList = chiTietList;  // List<HoaDonChiTietResponse>
  }
}