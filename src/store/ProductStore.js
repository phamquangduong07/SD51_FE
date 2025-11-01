import { defineStore } from "pinia";
import productService from "../api/admin/productService";

export const useProductStore = defineStore("ProductStore", {
  state: () => ({
    items: [],
    lookups: {},
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
        const res = await productService.getAllSanPhamChiTietPage(
          page,
          this.size
        );
        const products = res.data.content;

        // Gắn ảnh từ API hình ảnh sản phẩm
        const withImages = await Promise.all(
          products.map(async (p) => {
            try {
              const imgs = await productService.getImagesByChiTietId(p.id);
              p.hinhAnhSanPhamUrls = imgs.data.map((x) => x.url);
            } catch {
              p.hinhAnhSanPhamUrls = [];
            }
            return p;
          })
        );

        this.items = withImages;
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
        const res = await productService.searchSanPhamChiTiet(
          this.keyword,
          this.trangThai,
          this.page,
          this.size
        );
        const products = res.data.content;

        const withImages = await Promise.all(
          products.map(async (p) => {
            try {
              const imgs = await productService.getImagesByChiTietId(p.id);
              p.hinhAnhSanPhamUrls = imgs.data.map((x) => x.url);
            } catch {
              p.hinhAnhSanPhamUrls = [];
            }
            return p;
          })
        );

        this.items = withImages;
        this.totalPages = res.data.totalPages;
        this.totalElements = res.data.totalElements;
      } catch (e) {
        console.error("Lỗi tìm kiếm:", e);
      } finally {
        this.loading = false;
      }
    },

    async add(data, imageFile) {
      // 1. Tạo chi tiết sản phẩm
      const res = await productService.createSanPhamChiTiet(data);
      const newProduct = res.data;

      // 2. Nếu có ảnh → upload
      if (imageFile) {
        try {
          await productService.uploadImage(
            imageFile,
            `HA_${Date.now()}`, // mã ảnh tự động
            newProduct.ma || "Ảnh sản phẩm",
            1,
            newProduct.id
          );
        } catch (err) {
          console.error("Upload ảnh thất bại:", err);
        }
      }

      // 3. Lấy ảnh vừa upload để hiển thị
      const imgs = await productService.getImagesByChiTietId(newProduct.id);
      newProduct.hinhAnhSanPhamUrls = imgs.data.map((x) => x.url);

      this.items.unshift(newProduct);
    },

    async update(id, data) {
      const res = await productService.updateSanPhamChiTiet(id, data);
      const index = this.items.findIndex((i) => i.id === id);
      if (index !== -1) this.items[index] = res.data;
    },

    async remove(id) {
      await productService.deleteSanPhamChiTiet(id);
      this.items = this.items.filter((i) => i.id !== id);
    },

    async fetchLookups() {
      this.lookups = await productService.getAllLookups();
    },
  },
});
