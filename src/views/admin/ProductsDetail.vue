<template>
  <div class="container py-4" v-if="product">
    <button class="btn btn-secondary mb-3" @click="$router.back()">
      ← Quay lại
    </button>

    <div class="row">
      <div class="col-md-6">
        <img
          v-if="product.hinhAnhSanPhamUrls?.length"
          :src="product.hinhAnhSanPhamUrls[0]"
          class="img-fluid rounded shadow"
          alt="product"
        />
      </div>
      <div class="col-md-6">
        <h3 class="fw-bold mb-2">{{ getSanPhamName(product.sanPham) }}</h3>
        <p class="text-danger h5 mb-2">{{ formatPrice(product.giaBan) }}</p>
        <p><strong>Số lượng:</strong> {{ product.soLuong }}</p>
        <p><strong>Mô tả:</strong> {{ product.moTa }}</p>
        <p>
          <strong>Chất Liệu:</strong>
          {{ getName("chatLieu", product.chatLieu) }}
        </p>
        <p>
          <strong>Danh mục:</strong> {{ getName("danhMuc", product.danhMuc) }}
        </p>
        <p><strong>Đế giày:</strong> {{ getName("deGiay", product.deGiay) }}</p>
        <p>
          <strong>Hãng giày:</strong>
          {{ getName("hangGiay", product.hangGiay) }}
        </p>
        <p>
          <strong>Kích thước:</strong>
          {{ getName("kichThuoc", product.kichThuoc) }}
        </p>
        <p><strong>Màu sắc:</strong> {{ getName("mauSac", product.mauSac) }}</p>
      </div>
    </div>
  </div>

  <div v-else class="text-center mt-5">
    <p>Đang tải sản phẩm...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { productService } from "../../api/admin/productService";
import { useProductStore } from "../../store/ProductStore";

const route = useRoute();
const product = ref(null);
const store = useProductStore();

onMounted(async () => {
  try {
    const res = await productService.getSanPhamChiTietById(route.params.id);
    product.value = res.data;

    const imgs = await productService.getImagesByChiTietId(route.params.id);
    product.value.hinhAnhSanPhamUrls = imgs.data.map((x) => x.url);

    if (!store.lookups.sanPham) await store.fetchLookups();
  } catch (err) {
    console.error("Lỗi khi tải product by id:", err);
  }
});

const getName = (type, id) => {
  const list = store.lookups[type] || [];
  const item = list.find((x) => x.id === id);
  return item
    ? item.ten || item.tenMau || item.tenMauSac || item.tenKichThuoc
    : "—";
};

const getSanPhamName = (id) => {
  const item = store.lookups.sanPham?.find((x) => x.id === id);
  return item ? item.ten : "—";
};

const formatPrice = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n || 0);
</script>
