import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1/san-pham-chi-tiet",
  // withCredentials: true, // nếu cần
  headers: {
    "Content-Type": "application/json",
  },
});

// SanPhamChiTiet
export const getAllSanPhamChiTiet = () => api.get("/");
export const getAllSanPhamChiTietPage = (page = 0, size = 10) =>
  api.get(`/page?page=${page}&size=${size}`);
export const searchSanPhamChiTiet = (
  keyword = "",
  trangThai = null,
  page = 0,
  size = 10
) => {
  const params = new URLSearchParams({ keyword, page, size });
  if (trangThai !== null) params.append("trangThai", trangThai);
  return api.get(`/search?${params.toString()}`);
};
export const createSanPhamChiTiet = (data) => api.post("/add", data);
export const updateSanPhamChiTiet = (id, data) =>
  api.put(`/update/${id}`, data);
export const deleteSanPhamChiTiet = (id) => api.delete(`/delete/${id}`);

// === LOOKUP (nếu backend có các controller riêng) ===
const apiLookup = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getHangGiay = () => apiLookup.get("/hang-giay");
export const getDanhMuc = () => apiLookup.get("/danh-muc");
export const getMauSac = () => apiLookup.get("/mau-sac");
export const getKichThuoc = () => apiLookup.get("/kich-thuoc");
export const getChatLieu = () => apiLookup.get("/chat-lieu");
export const getDeGiay = () => apiLookup.get("/de-giay");
export const getSanPham = () => apiLookup.get("/san-pham");

// Lấy toàn bộ lookup song song (nếu bạn cần map UUID → tên)
export const getAllLookups = async () => {
  const calls = await Promise.allSettled([
    getHangGiay(),
    getDanhMuc(),
    getMauSac(),
    getKichThuoc(),
    getChatLieu(),
    getDeGiay(),
    getSanPham(),
  ]);
  const results = calls.map((c) =>
    c.status === "fulfilled" ? c.value.data : []
  );
  return {
    hangGiay: results[0],
    danhMuc: results[1],
    mauSac: results[2],
    kichThuoc: results[3],
    chatLieu: results[4],
    deGiay: results[5],
    sanPham: results[6],
  };
};
