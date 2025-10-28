<template>
  <div class="p-4">
    <h3 class="text-2xl font-bold mb-3">Quản lý sản phẩm</h3>

    <!-- Thanh tìm kiếm + thêm mới -->
    <div class="row mb-4 align-items-center">
      <div class="col-md-4">
        <input
          v-model="store.keyword"
          @keyup.enter="store.searchSanPham"
          type="text"
          class="form-control"
          placeholder="Tìm theo tên hoặc mã sản phẩm..."
        />
      </div>
      <div class="col-md-2">
        <button class="btn btn-primary w-100" @click="store.search">
          Tìm kiếm
        </button>
      </div>
      <div class="col-md-2">
        <button class="btn btn-success w-100" @click="openAdd">
          ➕ Thêm mới
        </button>
      </div>
      <div class="col-md-4 text-end">
        <label>Số sản phẩm / trang:</label>
        <select v-model.number="store.size" @change="store.fetchPage(0)">
          <option :value="3">3</option>
          <option :value="6">6</option>
          <option :value="9">9</option>
          <option :value="12">12</option>
        </select>
      </div>
    </div>

    <div v-if="store.loading">Đang tải dữ liệu...</div>

    <!-- Danh sách sản phẩm -->
    <div class="row">
      <div v-for="p in store.items" :key="p.id" class="col-md-2 mb-4">
        <div
          class="card shadow-sm h-100 hover-card"
          @click="$router.push(`/admin/products/${p.id}`)"
        >
          <div class="img-wrapper">
            <img :src="getImage(p)" class="card-img-top" alt="product" />
          </div>
          <div class="card-body text-center">
            <h6 class="fw-bold mb-1">{{ getSanPhamName(p.sanPham) }}</h6>
            <p class="text-danger mb-2">{{ formatPrice(p.giaBan) }}</p>
            <div class="d-flex justify-content-center gap-2">
              <button
                class="btn btn-sm btn-outline-primary"
                @click.stop="openEdit(p)"
              >
                Sửa
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click.stop="openDelete(p)"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PHÂN TRANG -->
    <nav v-if="store.totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: store.page === 0 }">
          <button class="page-link" @click="changePage(store.page - 1)">
            «
          </button>
        </li>
        <li
          v-for="i in store.totalPages"
          :key="i"
          class="page-item"
          :class="{ active: store.page === i - 1 }"
        >
          <button class="page-link" @click="changePage(i - 1)">{{ i }}</button>
        </li>
        <li
          class="page-item"
          :class="{ disabled: store.page === store.totalPages - 1 }"
        >
          <button class="page-link" @click="changePage(store.page + 1)">
            »
          </button>
        </li>
      </ul>
    </nav>

    <!--  Modal Thêm / Sửa -->
    <div v-if="showForm" class="modal-backdrop">
      <div class="modal-content p-4 bg-white rounded shadow-lg">
        <h5 class="mb-3">
          {{ editData.id ? "Sửa sản phẩm" : "Thêm sản phẩm" }}
        </h5>

        <div class="mb-2">
          <label>Mã sản phẩm</label>
          <input v-model="editData.ma" class="form-control" />
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

        <div class="mb-2">
          <label>Mô tả</label>
          <textarea v-model="editData.moTa" class="form-control"></textarea>
        </div>

        <div class="mb-2">
          <label>Chất liệu</label>
          <select v-model="editData.chatLieuId" class="form-control">
            <option disabled value="">-- Chọn chất liệu --</option>
            <option
              v-for="c in store.lookups.chatLieu"
              :key="c.id"
              :value="c.id"
            >
              {{ c.ten }}
            </option>
          </select>
        </div>

        <div class="mb-2">
          <label>Danh mục</label>
          <select v-model="editData.danhMucId" class="form-control">
            <option disabled value="">-- Chọn danh mục --</option>
            <option
              v-for="d in store.lookups.danhMuc"
              :key="d.id"
              :value="d.id"
            >
              {{ d.ten }}
            </option>
          </select>
        </div>

        <div class="mb-2">
          <label>Đế giày</label>
          <select v-model="editData.deGiayId" class="form-control">
            <option disabled value="">-- Chọn đế giày --</option>
            <option v-for="d in store.lookups.deGiay" :key="d.id" :value="d.id">
              {{ d.ten }}
            </option>
          </select>
        </div>

        <div class="mb-2">
          <label>Hãng giày</label>
          <select v-model="editData.hangGiayId" class="form-control">
            <option disabled value="">-- Chọn hãng --</option>
            <option
              v-for="h in store.lookups.hangGiay"
              :key="h.id"
              :value="h.id"
            >
              {{ h.ten }}
            </option>
          </select>
        </div>

        <div class="mb-2">
          <label>Kích thước</label>
          <select v-model="editData.kichThuocId" class="form-control">
            <option disabled value="">-- Chọn size --</option>
            <option
              v-for="k in store.lookups.kichThuoc"
              :key="k.id"
              :value="k.id"
            >
              {{ k.ten }}
            </option>
          </select>
        </div>

        <div class="mb-2">
          <label>Màu sắc</label>
          <select v-model="editData.mauSacId" class="form-control">
            <option disabled value="">-- Chọn màu sắc --</option>
            <option v-for="m in store.lookups.mauSac" :key="m.id" :value="m.id">
              {{ m.ten }}
            </option>
          </select>
        </div>

        <div class="mb-2">
          <label>Sản phẩm gốc</label>
          <select v-model="editData.sanPhamId" class="form-control">
            <option disabled value="">-- Chọn sản phẩm gốc --</option>
            <option
              v-for="s in store.lookups.sanPham"
              :key="s.id"
              :value="s.id"
            >
              {{ s.ten }}
            </option>
          </select>
        </div>

        <div class="mb-2">
          <label>Ảnh sản phẩm</label>
          <input type="file" accept="image/*" @change="handleImageUpload" />
          <div v-if="editData.preview" class="mt-2">
            <img :src="editData.preview" class="preview-img" />
          </div>
        </div>

        <div class="text-end mt-3">
          <button class="btn btn-secondary me-2" @click="showForm = false">
            Hủy
          </button>
          <button class="btn btn-success" @click="saveForm">Lưu</button>
        </div>
      </div>
    </div>

    <!--  Modal Xóa -->
    <div v-if="showDelete" class="modal-backdrop">
      <div class="modal-content p-4 bg-white rounded shadow-lg text-center">
        <h5 class="mb-3 text-danger">Xác nhận xóa?</h5>
        <p>
          Bạn có chắc muốn xóa sản phẩm
          <strong>{{ deleteTarget?.ma }}</strong> không?
        </p>
        <div class="d-flex justify-content-center gap-3 mt-3">
          <button class="btn btn-secondary" @click="showDelete = false">
            Hủy
          </button>
          <button class="btn btn-danger" @click="confirmDelete">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductStore } from "../../store/ProductStore";
import { uploadImage } from "../../api/admin/uploadService";

const store = useProductStore();
const showForm = ref(false);
const showDelete = ref(false);
const editData = ref({});
const deleteTarget = ref(null);
const fileUpload = ref(null); // lưu file ảnh

onMounted(async () => {
  await Promise.all([store.fetchPage(0), store.fetchLookups()]);
});

//  Ảnh
const getImage = (p) =>
  p.hinhAnhSanPhamUrls?.[0] ||
  "https://res.cloudinary.com/drtrpwvpc/image/upload/v1761559255/sgnnhkojguvru0w7hawk.jpg";

// Giá
const formatPrice = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n || 0
  );

// Tên sản phẩm
const getSanPhamName = (id) => {
  const item = (store.lookups.sanPham || []).find((x) => x.id === id);
  return item ? item.ten : "—";
};

// Trang
const changePage = async (page) => {
  if (page >= 0 && page < store.totalPages) await store.fetchPage(page);
};

// Upload ảnh
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  fileUpload.value = file;
  const reader = new FileReader();
  reader.onload = () => {
    editData.value.preview = reader.result;
  };
  reader.readAsDataURL(file);
};

// Thêm sản phẩm + upload ảnh
const saveForm = async () => {
  try {
    // Xóa field rỗng trước khi gửi lên API
    const cleanData = { ...editData.value };

    // Nếu rỗng hoặc chuỗi, thì xóa
    if (
      !cleanData.hinhAnhSanPhamUrls ||
      cleanData.hinhAnhSanPhamUrls.length === 0 ||
      cleanData.hinhAnhSanPhamUrls === ""
    ) {
      delete cleanData.hinhAnhSanPhamUrls;
    }

    if (cleanData.id) {
      await store.update(cleanData.id, cleanData);
      alert("Cập nhật thành công!");
    } else {
      await store.add(cleanData, fileUpload.value);
      alert("Thêm mới thành công!");
    }

    showForm.value = false;
    await store.fetchPage(store.page);
  } catch (err) {
    console.error(err);
    alert("Lưu thất bại!");
  }
};

// Thêm
const openAdd = () => {
  editData.value = {
    ma: "",
    giaBan: 0,
    soLuong: 0,
    moTa: "",
    trangThai: 1,
    chatLieuId: "",
    danhMucId: "",
    deGiayId: "",
    hangGiayId: "",
    kichThuocId: "",
    mauSacId: "",
    sanPhamId: "",
    hinhAnhSanPhamUrls: [],
  };
  showForm.value = true;
};

// ✏️ Sửa
const openEdit = (p) => {
  editData.value = {
    id: p.id,
    ma: p.ma,
    giaBan: p.giaBan,
    giaNhap: p.giaNhap,
    soLuong: p.soLuong,
    moTa: p.moTa,
    trangThai: p.trangThai,
    hinhAnhSanPhamUrls: p.hinhAnhSanPhamUrls || [],

    // Ưu tiên lấy id trong object trước, fallback về id rời
    chatLieuId: p.chatLieu?.id || p.chatLieuId || "",
    danhMucId: p.danhMuc?.id || p.danhMucId || "",
    deGiayId: p.deGiay?.id || p.deGiayId || "",
    hangGiayId: p.hangGiay?.id || p.hangGiayId || "",
    kichThuocId: p.kichThuoc?.id || p.kichThuocId || "",
    mauSacId: p.mauSac?.id || p.mauSacId || "",
    sanPhamId: p.sanPham?.id || p.sanPhamId || "",
  };
  // Preview ảnh
  editData.value.preview = p.hinhAnhSanPhamUrls?.[0] || "";
  showForm.value = true;
};

// Xóa
const openDelete = (p) => {
  deleteTarget.value = p;
  showDelete.value = true;
};
const confirmDelete = async () => {
  try {
    await store.remove(deleteTarget.value.id);
    showDelete.value = false;
    await store.fetchPage(store.page);
    alert("Đã xóa sản phẩm!");
  } catch (err) {
    console.error(err);
    alert("Không thể xóa!");
  }
};
</script>

<style scoped>
.img-wrapper {
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 8px;
  background: #f8f8f8;
}
.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}
.hover-card:hover .card-img-top {
  transform: scale(1.05);
}
.preview-img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #ddd;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  width: 500px;
  max-height: 90vh; /* Giới hạn chiều cao theo viewport */
  overflow-y: auto; /* Cho phép cuộn nếu nội dung quá dài */
  display: flex;
  flex-direction: column;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
}

.modal-footer {
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  text-align: right;
}
</style>
