import { defineStore } from "pinia";
import {
  getAllSanPhamChiTietPage,
  searchSanPhamChiTiet,
  createSanPhamChiTiet,
  updateSanPhamChiTiet,
  deleteSanPhamChiTiet,
  getAllLookups,
} from "../api/admin/productService";

export const useProductStore = defineStore("ProductStore", {
  state: () => ({
    items: [],
    lookups: {}, // chứa danh sách lookup (hãng, màu, ...)
    totalPages: 0,
    totalElements: 0,
    page: 0,
    size: 6,
    loading: false,
    keyword: "",
    trangThai: null,
  }),

  actions: {
    async fetchPage(page = 0) {
      this.loading = true;
      try {
        const res = await getAllSanPhamChiTietPage(page, this.size);
        this.items = res.data.content;
        this.totalPages = res.data.totalPages;
        this.totalElements = res.data.totalElements;
        this.page = page;
      } catch (e) {
        console.error("Lỗi tải sản phẩm:", e);
      } finally {
        this.loading = false;
      }
    },

    async search() {
      this.loading = true;
      try {
        const res = await searchSanPhamChiTiet(
          this.keyword,
          this.trangThai,
          this.page,
          this.size
        );
        this.items = res.data.content;
        this.totalPages = res.data.totalPages;
      } finally {
        this.loading = false;
      }
    },

    async add(data) {
      const res = await createSanPhamChiTiet(data);
      this.items.unshift(res.data);
    },

    async update(ma, data) {
      const res = await updateSanPhamChiTiet(ma, data);
      const index = this.items.findIndex((i) => i.ma === ma);
      if (index !== -1) this.items[index] = res.data;
    },

    async remove(ma) {
      await deleteSanPhamChiTiet(ma);
      this.items = this.items.filter((i) => i.ma !== ma);
    },

    async fetchLookups() {
      this.lookups = await getAllLookups();
    },
  },
});
