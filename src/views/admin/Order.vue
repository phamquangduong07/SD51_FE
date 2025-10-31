<template>
  <div
    class="container-fluid bg-light p-2"
    style="font-size: 14px; max-width: 1200px"
  >
    <div class="row">
      <!-- CỘT TRÁI: ĐƠN HÀNG -->
      <div class="col-md-8 d-flex flex-column position-relative">
        <!-- PHẦN HIỂN THỊ DANH SÁCH HÓA ĐƠN TREO -->
        <!-- DANH SÁCH HÓA ĐƠN TREO DẠNG BUTTON -->
        <div v-if="danhSachTreo.length" class="mb-2 d-flex flex-wrap gap-1">
          <button
            v-for="(order, index) in danhSachTreo"
            :key="order.code"
            class="btn btn-sm btn-warning"
            @click="resumeOrder(index)"
          >
            {{ order.code }}
          </button>
        </div>

        <div class="flex-grow-1 overflow-auto" style="max-height: 70vh">
          <!-- HÀNG TIÊU ĐỀ -->
          <div class="d-flex align-items-center border p-1 bg-white mb-1">
            <div class="me-3 fw-bold">Hóa đơn: {{ currentOrder.code }}</div>
          </div>

          <!-- BẢNG DANH SÁCH HÀNG -->
          <table
            class="table table-bordered table-sm mb-1 align-middle text-center bg-white"
          >
            <thead class="table-primary">
              <tr>
                <th style="width: 40%">Tên sản phẩm</th>
                <th style="width: 10%">SL</th>
                <th style="width: 15%">Giá</th>
                <th style="width: 20%">Thành tiền</th>
                <th style="width: 10%">Xóa</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in currentOrder.items" :key="index">
                <td class="text-start">{{ item.tenSanPham }}</td>
                <td>
                  <input
                    type="number"
                    class="form-control form-control-sm text-center"
                    v-model.number="item.soLuong"
                    min="1"
                    :max="item.soLuongTon"
                    @change="capNhatSoLuong(item)"
                  />
                </td>
                <td>{{ formatCurrency(item.donGia) }}</td>
                <td class="text-primary fw-bold">
                  {{ formatCurrency(item.soLuong * item.donGia) }}
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-danger py-0 px-2"
                    @click="xoaSanPham(item.hoaDonChiTietId)"
                  >
                    x
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- TỔNG TIỀN -->
          <div
            class="d-flex border bg-white p-2 align-items-center mb-5 justify-content-between"
          >
            <div>
              <label class="fw-bold me-1">Số lượng:</label>
              <input
                type="text"
                class="form-control form-control-sm text-end d-inline-block"
                style="width: 70px"
                :value="tongSoLuong"
                readonly
              />
            </div>
            <div>
              <label class="fw-bold me-1">Tổng tiền:</label>
              <input
                type="text"
                class="form-control form-control-sm text-end text-primary d-inline-block"
                style="width: 120px"
                :value="formatCurrency(tongTien)"
                readonly
              />
            </div>
          </div>
        </div>

        <!-- POPUP NHẬP KHÁCH HÀNG -->
        <div
          v-if="showCustomerInput"
          class="position-absolute w-100 d-flex justify-content-center align-items-center"
          style="
            top: 0;
            left: 0;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 1000;
          "
        >
          <div class="bg-white rounded shadow p-3" style="width: 300px">
            <h6 class="text-center text-primary mb-3">Thông tin khách hàng</h6>
            <div class="mb-2">
              <label class="form-label fw-bold small mb-1"
                >Số điện thoại:</label
              >
              <input
                type="text"
                v-model="customerPhone"
                class="form-control form-control-sm"
                placeholder="Nhập số điện thoại..."
              />
            </div>
            <div class="text-end mt-3">
              <button
                class="btn btn-sm btn-secondary me-2"
                @click="showCustomerInput = false"
              >
                Hủy
              </button>
              <button class="btn btn-sm btn-primary" @click="handleKhachHang">
                Xác nhận
              </button>
            </div>
          </div>
        </div>

        <!-- POPUP THANH TOÁN -->
   <!-- POPUP THANH TOÁN -->
<div
  v-if="showCheckout"
  class="position-absolute w-100 d-flex justify-content-center align-items-center"
  style="
    top: 0;
    left: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
  "
>
  <div class="bg-white rounded shadow p-3" style="width: 480px">
    <h6 class="text-center text-primary mb-3">Thanh toán</h6>

    <!-- TỔNG TIỀN -->
    <div class="mb-3">
      <div class="d-flex justify-content-between mb-1">
        <span class="fw-bold">Tổng tiền:</span>
        <span class="text-primary fw-bold">{{ formatCurrency(tongTien) }}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span class="fw-bold">Còn lại:</span>
        <span class="fw-bold text-danger">{{
          formatCurrency(Math.max(tongTien - ((tienMat || 0) + (tienChuyenKhoan || 0)), 0))
        }}</span>
      </div>
    </div>

    <hr />

    <!-- HÌNH THỨC THANH TOÁN -->
    <div class="fw-bold mb-2">Hình thức thanh toán</div>
    <div class="d-flex flex-wrap gap-2 justify-content-center mb-3">
      <button
        class="btn flex-fill"
        :class="{
          'btn-primary': selectedPayment === 'TIEN_MAT',
          'btn-outline-primary': selectedPayment !== 'TIEN_MAT',
        }"
        @click="selectedPayment = 'TIEN_MAT'"
      >
        Tiền mặt
      </button>
      <button
        class="btn flex-fill"
        :class="{
          'btn-primary': selectedPayment === 'CHUYEN_KHOAN',
          'btn-outline-primary': selectedPayment !== 'CHUYEN_KHOAN',
        }"
        @click="selectedPayment = 'CHUYEN_KHOAN'"
      >
        Chuyển khoản
      </button>
      <button
        class="btn flex-fill"
        :class="{
          'btn-primary': selectedPayment === 'KET_HOP',
          'btn-outline-primary': selectedPayment !== 'KET_HOP',
        }"
        @click="selectedPayment = 'KET_HOP'"
      >
        Kết hợp
      </button>
    </div>

    <!-- Ô NHẬP SỐ TIỀN -->
    <div class="border rounded p-2 mb-3 bg-light">
      <div
        v-if="selectedPayment === 'TIEN_MAT' || selectedPayment === 'KET_HOP'"
        class="mb-2"
      >
        <label class="fw-bold small mb-1">Tiền mặt:</label>
        <input
          type="number"
          min="0"
          class="form-control form-control-sm text-end"
          v-model.number="tienMat"
        />
      </div>

      <div
        v-if="selectedPayment === 'CHUYEN_KHOAN' || selectedPayment === 'KET_HOP'"
        class="mb-2"
      >
        <label class="fw-bold small mb-1">Tiền chuyển khoản:</label>
        <input
          type="number"
          min="0"
          class="form-control form-control-sm text-end"
          v-model.number="tienChuyenKhoan"
        />
      </div>

      <div class="d-flex justify-content-between">
        <span class="fw-bold">Tiền thừa:</span>
        <span class="text-success fw-bold">{{
          formatCurrency(Math.max(tienThua, 0))
        }}</span>
      </div>
    </div>

    <!-- NÚT XÁC NHẬN -->
    <div class="text-end mt-3">
      <button
        class="btn btn-sm btn-secondary me-2"
        @click="showCheckout = false"
      >
        Đóng
      </button>
      <button class="btn btn-sm btn-success" @click="handleThanhToan">
        Xác nhận
      </button>
    </div>
  </div>
</div>


        <!-- THANH NÚT CỐ ĐỊNH -->
        <div class="pos-inner-fixed shadow mt-2">
          <div class="d-flex text-center">
            <button
              class="flex-fill py-2 btn text-white border-0"
              style="background-color: #6c757d"
              @click="handleTaoHoaDon"
              :disabled="!canCreateOrder"
            >
              Tạo đơn
            </button>
            <button
              class="flex-fill py-2 btn text-white border-0"
              style="background-color: #17a2b8"
              @click="handleTreoPhieu"
              :disabled="!orderActive"
            >
              Treo phiếu
            </button>
            <button
              class="flex-fill py-2 btn border-0"
              style="background-color: red; color: black"
              @click="handleXoaDon"
              :disabled="!orderActive"
            >
              Xóa đơn
            </button>
            <button
              class="flex-fill py-2 btn text-white border-0"
              style="background-color: #007bff"
              @click="handleKhachHang"
              :disabled="!orderActive"
            >
              Khách hàng
            </button>
            <button
              class="flex-fill py-2 btn text-white border-0"
              style="background-color: #28a745"
              @click="handleTinhTien"
              :disabled="!orderActive || currentOrder.items.length === 0"
            >
              Tính tiền
            </button>
          </div>
        </div>
      </div>

      <!-- CỘT PHẢI: TÌM KIẾM -->
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white py-2">
            <strong>Tìm kiếm sản phẩm</strong>
          </div>
          <div class="card-body p-2">
            <input
              type="text"
              class="form-control form-control-sm mb-2"
              placeholder="Mã sản phẩm..."
              @keyup.enter="handleNhapMaSanPham"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import orderService from "../../api/admin/orderService.js";
import { onMounted } from "vue";

const showCustomerInput = ref(false);
const canCreateOrder = ref(true);
const customerPhone = ref("");
const showCheckout = ref(false);
const orderActive = ref(false);
const tienKhachDua = ref(0); // Tiền khách đưa
const selectedPayment = ref("TIEN_MAT"); // phương thức thanh toán mặc định
const tienMat = ref(0);
const tienChuyenKhoan = ref(0);
const tongSoLuong = computed(() =>
  currentOrder.value.items.reduce((sum, item) => sum + (item.soLuong || 0), 0)
);

const tongTien = computed(() =>
  currentOrder.value.items.reduce(
    (sum, item) => sum + (item.soLuong * item.donGia || 0),
    0
  )
);

const currentOrder = ref({
  code: "",
  items: [],
});
const danhSachTreo = ref([]);
watch(
  danhSachTreo,
  (newValue) => {
    localStorage.setItem("danhSachTreo", JSON.stringify(newValue));
  },
  { deep: true }
);
onMounted(() => {
  const savedOrders = localStorage.getItem("danhSachTreo");
  if (savedOrders) {
    danhSachTreo.value = JSON.parse(savedOrders);
    console.log(
      "Khôi phục danh sách treo từ localStorage:",
      danhSachTreo.value
    );
  }
});

const formatCurrency = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v
  );

const handleTaoHoaDon = async () => {
  try {
    const response = await orderService.createHoaDon("ND001");
    currentOrder.value = {
      code: response.data.ma,
      items: [],
    };
    orderActive.value = true;
    alert(`Đã tạo hóa đơn mới: ${response.data.ma}`);
    canCreateOrder.value = false;
    console.log("Hóa đơn trả về từ backend:", response.data);
  } catch (error) {
    console.error("Lỗi khi tạo hóa đơn:", error);
    alert("Không thể tạo hóa đơn mới. Vui lòng thử lại sau.");
  }
};

const handleXoaDon = async () => {
  if (!currentOrder.value || !currentOrder.value.code) return;

  if (confirm("Bạn có chắc chắn muốn xóa hóa đơn hiện tại không?")) {
    try {
      // Gọi API xóa hóa đơn trên BE
      await orderService.deleteHoaDon(currentOrder.value.code);

      // Reset hóa đơn trên FE
      currentOrder.value = { code: "", items: [] };
      orderActive.value = false;
      canCreateOrder.value = true;
      alert("Hóa đơn đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      alert("Không thể xóa hóa đơn. Vui lòng thử lại.");
    }
  }
};

const handleKhachHang = async () => {
  if (!currentOrder.value || !currentOrder.value.code) {
    alert("Chưa có hóa đơn để gán khách hàng!");
    return;
  }

  if (showCustomerInput.value) {
    // Nếu popup đang mở và có số điện thoại, gọi API thêm khách hàng
    if (!customerPhone.value) {
      alert("Vui lòng nhập số điện thoại khách hàng!");
      return;
    }

    try {
      const response = await orderService.addKhachhang(
        currentOrder.value.code,
        customerPhone.value
      );

      // Cập nhật khách hàng trên FE
      currentOrder.value.khachHang = response.data.khachHang || {
        soDienThoai: customerPhone.value,
      };

      alert(
        `Khách hàng ${currentOrder.value.khachHang.soDienThoai} đã được thêm vào hóa đơn`
      );

      // Đóng popup
      showCustomerInput.value = false;
      customerPhone.value = "";
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error);
      alert("Không thể thêm khách hàng. Vui lòng thử lại.");
    }
  } else {
    // Mở popup nếu đang đóng
    showCustomerInput.value = true;
  }
  canCreateOrder.value = false;
};
const handleTinhTien = async () => {
  if (
    !currentOrder.value ||
    !currentOrder.value.code ||
    currentOrder.value.items.length === 0
  ) {
    alert("Hóa đơn chưa có sản phẩm!");
    return;
  }

  try {
    const response = await orderService.tinhTien(currentOrder.value.code);
    // Cập nhật hóa đơn và danh sách chi tiết
    currentOrder.value = {
      ...currentOrder.value,
      ...response.data,
      items: response.data.chiTietList || [],
    };

    showCheckout.value = true;
  } catch (error) {
    console.error(error);
    alert("Không thể tính tiền. Vui lòng thử lại.");
  }
};

// Xác nhận thanh toán
const handleThanhToan = async () => {
  if (!currentOrder.value || !currentOrder.value.code) return;

  const payload = {
    tienMat: tienMat.value,
    chuyenKhoan: tienChuyenKhoan.value,
    phuongThucVnp:
      selectedPayment.value === "CHUYEN_KHOAN" ? "VNPAY" : null,
  };

  const tongThanhToan =
    (payload.tienMat || 0) + (payload.chuyenKhoan || 0);

  if (tongThanhToan <= 0) {
    alert("Số tiền thanh toán phải lớn hơn 0");
    return;
  }

  if (tongThanhToan < tongTien.value) {
    if (!confirm("Số tiền thanh toán nhỏ hơn tổng tiền. Tiếp tục?")) return;
  }

  try {
    const response = await orderService.thanhToan(
      currentOrder.value.code,
      payload
    );
    alert("Thanh toán thành công!");
     await handleInHoaDon();
    showCheckout.value = false;
    orderActive.value = false;
    canCreateOrder.value = true;
    currentOrder.value = { code: "", items: [] };
    tienMat.value = 0;
    tienChuyenKhoan.value = 0;
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    alert(error?.response?.data || "Thanh toán thất bại!");
  }
};

// Tính tiền thừa

const resumeOrder = (index) => {
  if (currentOrder.value && currentOrder.value.code) {
    const currentCode = currentOrder.value.code;
    const resumeCode = danhSachTreo.value[index].code;

    if (currentCode !== resumeCode) {
      // Tìm index hóa đơn hiện tại trong danh sách treo
      const existingIndex = danhSachTreo.value.findIndex(
        (order) => order.code === currentCode
      );

      if (existingIndex !== -1) {
        // Cập nhật lại
        danhSachTreo.value[existingIndex] = { ...currentOrder.value };
      } else {
        // Thêm mới
        danhSachTreo.value.push({ ...currentOrder.value });
      }
    }
  }

  // Resume hóa đơn được chọn
  currentOrder.value = { ...danhSachTreo.value[index] };
  orderActive.value = true;

  // Xóa hóa đơn vừa được resume khỏi danh sách treo
  danhSachTreo.value.splice(index, 1);

  canCreateOrder.value = false;
};
const handleTreoPhieu = () => {
  if (!currentOrder.value || !currentOrder.value.code) return;

  const index = danhSachTreo.value.findIndex(
    (order) => order.code === currentOrder.value.code
  );

  if (index !== -1) {
    // Nếu đã tồn tại → cập nhật lại
    danhSachTreo.value[index] = { ...currentOrder.value };
    alert(`Hóa đơn ${currentOrder.value.code} đã được treo và cập nhật lại!`);
  } else {
    // Thêm mới vào danh sách treo
    danhSachTreo.value.push({ ...currentOrder.value });
    alert(`Hóa đơn ${currentOrder.value.code} đã được treo thành công!`);
  }

  // Reset hóa đơn hiện tại
  currentOrder.value = { code: "", items: [] };
  orderActive.value = false;
  canCreateOrder.value = true;
};

const handleNhapMaSanPham = async (event) => {
  const maSP = event.target.value.trim();
  if (!maSP) return;
  if (!currentOrder.value || !currentOrder.value.code) {
    alert("Vui lòng tạo hóa đơn trước khi thêm sản phẩm!");
    return;
  }

  try {
    const response = await orderService.addSanPham(currentOrder.value.code, {
      maCTSP: maSP,
      soLuong: 1,
    });

     const added = response.data;

   
    const existingItem = currentOrder.value.items.find(
      (item) => item.hoaDonChiTietId === added.hoaDonChiTietId
    );

    const donGiaFromBE = added.donGia;
    const donGiaValid =
      typeof donGiaFromBE === "number" &&
      !isNaN(donGiaFromBE) &&
      donGiaFromBE > 0;

    if (existingItem) {
      existingItem.soLuong = Number(added.soLuong ?? existingItem.soLuong + 1);
      if (donGiaValid) existingItem.donGia = donGiaFromBE;
    } else {
      currentOrder.value.items.push({
        ...added,
        donGia: donGiaValid ? donGiaFromBE : added.donGia ?? 0,
      });
    }

    event.target.value = "";
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);

    // ✅ Nếu backend trả thông báo lỗi 400
    if (error.response && error.response.status === 400) {
      const message = error.response.data || "Không tìm thấy sản phẩm!";
      alert(typeof message === "string" ? message : "Không tìm thấy sản phẩm!");
    } else {
      alert("Không thể thêm sản phẩm. Vui lòng thử lại.");
    }
  } finally {
    event.target.value = ""; // ✅ Reset ô nhập sau mỗi lần nhập
  }
};

const xoaSanPham = async (hoaDonChiTietId) => {
  if (!hoaDonChiTietId) return;

  try {
    // Gọi API xóa sản phẩm
    await orderService.deleteSanPham(hoaDonChiTietId);

    // Cập nhật lại danh sách sản phẩm trên FE
    currentOrder.value.items = currentOrder.value.items.filter(
      (item) => item.hoaDonChiTietId !== hoaDonChiTietId
    );

    // Nếu muốn, có thể cập nhật tongTien và tongSoLuong tự động nhờ computed
    alert("Sản phẩm đã được xóa khỏi hóa đơn.");
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    alert("Không thể xóa sản phẩm. Vui lòng thử lại.");
  }
};
const tienThua = computed(() => {
  const tongThanhToan = (tienMat.value || 0) + (tienChuyenKhoan.value || 0);
  return tongThanhToan - tongTien.value;
});
const capNhatSoLuong = async (item) => {
  // Kiểm tra số lượng không vượt quá tồn kho
  if (item.soLuong > item.soLuongTon) {
    alert(
      `Số lượng nhập (${item.soLuong}) vượt quá tồn kho (${item.soLuongTon})`
    );
    item.soLuong = item.soLuongTon; // Reset về mức tối đa cho phép
    return;
  }

  if (item.soLuong < 1) {
    alert("Số lượng phải lớn hơn 0");
    item.soLuong = 1;
    return;
  }

  try {
    const response = await orderService.updateSoLuong(
      item.hoaDonChiTietId,
      item.soLuong
    );

    const updated = response.data;
    const index = currentOrder.value.items.findIndex(
      (p) => p.hoaDonChiTietId === updated.hoaDonChiTietId
    );

    if (index !== -1) {
      currentOrder.value.items[index].soLuong = updated.soLuong;
    }

    console.log("Đã cập nhật số lượng:", updated.soLuong);
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
    alert("Không thể cập nhật số lượng. Vui lòng thử lại!");
  }
};

const handleInHoaDon = async () => {
  try {
    const response = await orderService.downloadHoaDonPDF(currentOrder.value.id);

    // Tạo blob PDF
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);

    // Mở tab mới
    window.open(fileURL);
  } catch (error) {
    console.error(error);
    alert("Không thể tải PDF.");
  }
};

</script>

<style scoped>
.pos-inner-fixed {
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #ccc;
}
.pos-inner-fixed button {
  font-weight: 500;
  font-size: 15px;
  border-radius: 0;
  transition: all 0.2s;
}
.pos-inner-fixed button:hover {
  filter: brightness(1.1);
}
.list-group-item {
  cursor: pointer;
  transition: background-color 0.15s;
}
.list-group-item:hover {
  background-color: #f0f8ff;
}
</style>
