<template>
  <div class="p-4">
    <h3 class="text-2xl font-bold mb-3">Products</h3>

    <!-- Bộ chọn số lượng sản phẩm mỗi trang -->
    <div class="mb-3">
      <label>Số sản phẩm mỗi trang:</label>
      <select v-model.number="store.size" @change="store.fetchPage(0)">
        <option :value="3">3</option>
        <option :value="6">6</option>
        <option :value="9">9</option>
        <option :value="12">12</option>
      </select>
    </div>

    <div v-if="store.loading">Đang tải...</div>

    <div class="row">
      <div v-for="p in store.items" :key="p.id" class="col-md-4 mb-3">
        <div class="card shadow-sm h-100">
          <div class="img-wrapper">
            <img :src="getImage(p)" class="card-img-top" alt="product" />
          </div>
          <div class="card-body">
            <h6 class="card-title">{{ getSanPhamName(p.sanPham) }}</h6>
            <p class="text-muted mb-1">
              Giá: {{ formatPrice(p.giaBan) }} | Số lượng: {{ p.soLuong }}
            </p>
            <p class="text-muted mb-1">
              Màu: {{ getName("mauSac", p.mauSac) }} | Size:
              {{ getName("kichThuoc", p.kichThuoc) }}
            </p>
            <p class="text-muted mb-1">Mô tả: {{ p.moTa }}</p>

            <button class="btn btn-sm btn-primary" @click="openEdit(p)">
              Edit
            </button>
            <button
              class="btn btn-sm btn-danger ms-2"
              @click="handleDelete(p.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- PHÂN TRANG -->
    <nav v-if="store.totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: store.page === 0 }">
          <button class="page-link" @click="changePage(store.page - 1)">
            « Trước
          </button>
        </li>

        <li
          v-for="i in store.totalPages"
          :key="i"
          class="page-item"
          :class="{ active: store.page === i - 1 }"
        >
          <button class="page-link" @click="changePage(i - 1)">
            {{ i }}
          </button>
        </li>

        <li
          class="page-item"
          :class="{ disabled: store.page === store.totalPages - 1 }"
        >
          <button class="page-link" @click="changePage(store.page + 1)">
            Sau »
          </button>
        </li>
      </ul>
    </nav>

    <!-- Modal Edit -->
    <div v-if="showEdit" class="modal-backdrop">
      <div class="modal-content p-4 bg-white rounded shadow-lg">
        <h5 class="mb-3">Chỉnh sửa sản phẩm</h5>

        <div class="mb-2">
          <label>Mô tả</label>
          <input v-model="editData.moTa" class="form-control" />
        </div>

        <div class="mb-2">
          <label>Giá bán</label>
          <input
            v-model.number="editData.giaBan"
            type="number"
            class="form-control"
          />
        </div>

        <div class="mb-2">
          <label>Số lượng</label>
          <input
            v-model.number="editData.soLuong"
            type="number"
            class="form-control"
          />
        </div>

        <!-- Khóa ngoại -->
        <div class="mb-2">
          <label>Kích thước</label>
          <select v-model="editData.kichThuoc" class="form-select">
            <option
              v-for="k in store.lookups.kichThuoc"
              :key="k.id"
              :value="k.id"
            >
              {{ k.tenKichThuoc || k.ten }}
            </option>
          </select>
        </div>

        <div class="mb-2">
          <label>Màu sắc</label>
          <select v-model="editData.mauSac" class="form-select">
            <option v-for="k in store.lookups.mauSac" :key="k.id" :value="k.id">
              {{ k.tenMau || k.tenMauSac || k.ten }}
            </option>
          </select>
        </div>

        <!-- Upload ảnh -->
        <div class="mb-2">
          <label>Ảnh sản phẩm</label>
          <input type="file" accept="image/*" @change="handleImageUpload" />
          <div v-if="editData.hinhAnhSanPhamUrls?.length">
            <img
              :src="editData.hinhAnhSanPhamUrls[0]"
              width="100"
              class="mt-2 rounded shadow"
            />
          </div>
        </div>

        <div class="text-end mt-3">
          <button class="btn btn-secondary me-2" @click="showEdit = false">
            Hủy
          </button>
          <button class="btn btn-success" @click="saveEdit">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "../../store/ProductStore";
import { updateSanPhamChiTiet } from "../../api/admin/productService";
import { uploadImage } from "../../api/admin/uploadService";

const store = useProductStore();
const showEdit = ref(false);
const editData = ref({});

onMounted(async () => {
  await Promise.all([store.fetchPage(0), store.fetchLookups()]);
});

const getImage = (p) => {
  // Nếu có danh sách URL ảnh
  if (p.hinhAnhSanPhamUrls && p.hinhAnhSanPhamUrls.length > 0) {
    return p.hinhAnhSanPhamUrls[0];
  }

  // Nếu có publicId từ Cloudinary (trường hợp BE chỉ lưu publicId)
  if (p.hinhAnh && p.hinhAnh.publicId) {
    return `https://res.cloudinary.com/drtrpwvpc/image/upload/${p.hinhAnh.publicId}.jpg`;
  }

  // Ảnh mặc định nếu không có gì
  return "https://res.cloudinary.com/drtrpwvpc/image/upload/v1761559255/sgnnhkojguvru0w7hawk.jpg";
};

const formatPrice = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n || 0);

const getName = (type, id) => {
  const list = store.lookups[type] || [];
  const item = list.find((x) => x.id === id);
  return item
    ? item.ten ||
        item.tenHang ||
        item.tenMau ||
        item.tenMauSac ||
        item.tenKichThuoc
    : "—";
};

const getSanPhamName = (id) => {
  const list = store.lookups.sanPham || [];
  const item = list.find((x) => x.id === id);
  return item ? item.ten : "—";
};

// Chuyển trang
const changePage = async (page) => {
  if (page >= 0 && page < store.totalPages) {
    await store.fetchPage(page);
  }
};

// Upload ảnh
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const imageUrl = await uploadImage(file);
    // Đảm bảo luôn là string
    if (typeof imageUrl === "object" && imageUrl.url) {
      editData.value.hinhAnhSanPhamUrls = [imageUrl.url];
    } else {
      editData.value.hinhAnhSanPhamUrls = [imageUrl];
    }
    alert("Tải ảnh thành công!");
  } catch (err) {
    console.error("Lỗi khi upload ảnh:", err);
    alert("Không thể upload ảnh, vui lòng thử lại.");
  }
};

// Xóa có xác nhận
const handleDelete = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
    try {
      await store.remove(id);
      await store.fetchPage(store.page);
      alert("Đã xóa sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  }
};

// Mở form edit
const openEdit = (product) => {
  editData.value = { ...product,
    mauSacId: product.mauSac?.id,
    kichThuocId: product.kichThuoc?.id,
   };
  showEdit.value = true;
};

const payload = {
  mauSacId: editData.value.mauSacId,
  kichThuocId: editData.value.kichThuocId
};

// Lưu thay đổi
const saveEdit = async () => {
  try {
    const payload = {
      ma: editData.value.ma,
      giaBan: editData.value.giaBan,
      soLuong: editData.value.soLuong,
      moTa: editData.value.moTa,
      trangThai: editData.value.trangThai || 1,
      nguoiSua: "admin",

      mauSacId: editData.value.mauSac,
      kichThuocId: editData.value.kichThuoc,
      hangGiayId: editData.value.hangGiay,
      danhMucId: editData.value.danhMuc,
      sanPhamId: editData.value.sanPham,
      chatLieuId: editData.value.chatLieu,
      deGiayId: editData.value.deGiay,

      hinhAnhSanPhamUrls: editData.value.hinhAnhSanPhamUrls || [],
    };

    console.log("Payload gửi lên BE:", payload);
    await updateSanPhamChiTiet(editData.value.id, payload);
    alert("Cập nhật sản phẩm thành công!");
    showEdit.value = false;
    await store.fetchPage(store.page);
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    alert("Không thể cập nhật sản phẩm. Vui lòng kiểm tra lại dữ liệu!");
  }
};
</script>

<style scoped>
.img-wrapper {
  width: 100%;
  height: 380px; /* 👈 giảm chiều cao ảnh cho vừa vặn */
  overflow: hidden;
  border-radius: 8px;
  background: #f8f8f8;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover; /* giữ ảnh đầy khung, cắt vừa khéo */
  transition: transform 0.25s ease;
}

.card-img-top:hover {
  transform: scale(1.05); /* phóng nhẹ khi hover */
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  width: 400px;
  max-width: 95%;
}
</style>
