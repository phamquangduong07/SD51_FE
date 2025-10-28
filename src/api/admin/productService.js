import axios from "axios";

// =======================
// Cấu hình API chính
// =======================
const api = axios.create({
  baseURL: "http://localhost:8081/api/v1/san-pham-chi-tiet",
  headers: {
    "Content-Type": "application/json",
  },
});

const apiLookup = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: { "Content-Type": "application/json" },
});

const apiImage = axios.create({
  baseURL: "http://localhost:8081/api/v1/hinh-anh-san-pham",
});

// =======================
// SanPhamChiTiet API
// =======================
const productServiceApi = {
  getAllSanPhamChiTiet() {
    return api.get("/");
  },

  getAllSanPhamChiTietPage(page = 0, size = 10) {
    return api.get(`/page?page=${page}&size=${size}`);
  },

  searchSanPhamChiTiet(keyword = "", trangThai = null, page = 0, size = 10) {
    const params = new URLSearchParams({ keyword, page, size });
    if (trangThai !== null) params.append("trangThai", trangThai);
    return api.get(`/search?${params.toString()}`);
  },

  getSanPhamChiTietById(id) {
    return api.get(`/${id}`);
  },

  createSanPhamChiTiet(data) {
    return api.post("/add", data);
  },

  updateSanPhamChiTiet(id, data) {
    return api.put(`/update/${id}`, data);
  },

  deleteSanPhamChiTiet(id) {
    return api.delete(`/delete/${id}`);
  },
};

// =======================
// LOOKUP API
// =======================
const productServiceLookup = {
  getHangGiay() {
    return apiLookup.get("/hang-giay");
  },
  getDanhMuc() {
    return apiLookup.get("/danh-muc");
  },
  getMauSac() {
    return apiLookup.get("/mau-sac");
  },
  getKichThuoc() {
    return apiLookup.get("/kich-thuoc");
  },
  getChatLieu() {
    return apiLookup.get("/chat-lieu");
  },
  getDeGiay() {
    return apiLookup.get("/de-giay");
  },
  getSanPham() {
    return apiLookup.get("/san-pham");
  },
  searchSanPham(keyword = "", trangThai = null, page = 0, size = 10) {
    const params = new URLSearchParams({ keyword, page, size });
    if (trangThai !== null) params.append("trangThai", trangThai);
    return apiLookup.get(`/san-pham/search?${params.toString()}`);
  },
};

// =======================
// Hình ảnh sản phẩm API
// =======================
const imageService = {
  // Lấy danh sách hình ảnh theo chi tiết sản phẩm ID
  getImagesByChiTietId(chiTietId) {
    return apiImage.get(`/${chiTietId}`);
  },

  // Upload 1 hình ảnh (form-data)
  uploadImage(file, ma, ten, trangThai, chiTietSanPham) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("ma", ma);
    formData.append("ten", ten);
    formData.append("trangThai", trangThai);
    formData.append("chiTietSanPham", chiTietSanPham);

    return apiImage.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload nhiều hình ảnh
  uploadMultipleImages(chiTietId, files) {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    return apiImage.post(`/upload/${chiTietId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // CRUD cơ bản (nếu bạn cần)
  getAll() {
    return apiImage.get("/");
  },
  getPage(page = 0, size = 10) {
    return apiImage.get(`/page?page=${page}&size=${size}`);
  },
  deleteImage(id) {
    return apiImage.delete(`/delete/${id}`);
  },
};

// =======================
// Hợp nhất lookup
// =======================
export const getAllLookups = async () => {
  const [hangGiay, danhMuc, mauSac, kichThuoc, chatLieu, deGiay, sanPham] =
    await Promise.all([
      productServiceLookup.getHangGiay(),
      productServiceLookup.getDanhMuc(),
      productServiceLookup.getMauSac(),
      productServiceLookup.getKichThuoc(),
      productServiceLookup.getChatLieu(),
      productServiceLookup.getDeGiay(),
      productServiceLookup.getSanPham(),
    ]);

  return {
    hangGiay: hangGiay.data,
    danhMuc: danhMuc.data,
    mauSac: mauSac.data,
    kichThuoc: kichThuoc.data,
    chatLieu: chatLieu.data,
    deGiay: deGiay.data,
    sanPham: sanPham.data,
  };
};

// =======================
// Export tổng hợp
// =======================
export const productService = {
  ...productServiceApi,
  ...productServiceLookup,
  ...imageService,
  getAllLookups,
};

export default productService;
