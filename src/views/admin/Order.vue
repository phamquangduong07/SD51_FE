<template>
  <div
    class="container-fluid bg-light p-2"
    style="font-size: 14px; max-width: 1200px"
  >
    <div class="row">
      <!-- CỘT TRÁI: ĐƠN HÀNG -->
      <div class="col-md-8 d-flex flex-column position-relative">
        <div class="flex-grow-1 overflow-auto" style="max-height: 70vh">
          <!-- DANH SÁCH ĐƠN HÀNG TREO -->
          <div v-if="heldOrders.length" class="mb-2">
            <div class="fw-bold mb-1 text-primary">Đơn hàng đã treo:</div>
            <div class="d-flex flex-wrap gap-2">
              <button
                v-for="(order, index) in heldOrders"
                :key="index"
                class="btn btn-sm btn-outline-primary"
                @click="selectHeldOrder(index)"
              >
                {{ order.code }} ({{ order.items.length }} sp)
              </button>
            </div>
            <hr class="my-2" />
          </div>

          <!-- HÀNG TIÊU ĐỀ -->
          <div class="d-flex align-items-center border p-1 bg-white mb-1">
            <div class="me-3 fw-bold">
              Đơn hàng
              <span
                v-if="currentOrder && currentOrder.code"
                class="text-primary"
                >({{ currentOrder.code }})</span
              >
            </div>
            <input
              v-model="searchCode"
              type="text"
              class="form-control form-control-sm"
              style="width: 120px"
              placeholder="Nhập mã sản phẩm..."
              @keyup.enter="addByCode"
              :disabled="!orderActive"
            />
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
              <tr v-if="!orderActive">
                <td colspan="5" class="text-muted text-center py-4">
                  Hãy nhấn <b>F2. Tạo đơn</b> để bắt đầu
                </td>
              </tr>
              <tr v-else-if="currentOrder.items.length === 0">
                <td colspan="5" class="text-muted text-center py-4">
                  Chưa có mặt hàng
                </td>
              </tr>
              <tr v-for="(item, index) in currentOrder.items" :key="index">
                <td class="text-start">{{ item.ten }}</td>
                <td>
                  <input
                    type="number"
                    class="form-control form-control-sm text-center"
                    v-model.number="item.soLuong"
                    min="1"
                    @input="updateTotals"
                    :disabled="!orderActive"
                  />
                </td>
                <td>{{ formatCurrency(item.gia) }}</td>
                <td class="text-primary fw-bold">
                  {{ formatCurrency(item.gia * item.soLuong) }}
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-danger py-0 px-2"
                    @click="removeItem(index)"
                    :disabled="!orderActive"
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
                :value="totalQuantity"
                readonly
              />
            </div>

            <div>
              <label class="fw-bold me-1">Tổng tiền:</label>
              <input
                type="text"
                class="form-control form-control-sm text-end text-primary d-inline-block"
                style="width: 120px"
                :value="formatCurrency(totalAmount)"
                readonly
              />
            </div>
          </div>
        </div>

        <!-- THANH NÚT CỐ ĐỊNH -->
        <div class="pos-inner-fixed shadow mt-2">
          <div class="d-flex text-center">
            <!-- F2: TẠO ĐƠN -->
            <button
              class="flex-fill py-2 btn text-white border-0"
              style="background-color: #6c757d"
              @click="handleNewOrder"
            >
              F2. Tạo đơn
            </button>

            <!-- F3: TREO PHIẾU -->
            <button
              class="flex-fill py-2 btn text-white border-0"
              style="background-color: #17a2b8"
              @click="handleHoldOrder"
              :disabled="!orderActive"
            >
              F3. Treo phiếu
            </button>

            <!-- F4: HỦY DÒNG -->
            <button
              class="flex-fill py-2 btn border-0"
              style="background-color: #ffc107; color: black"
              @click="handleCancelRow"
              :disabled="!orderActive"
            >
              F4. Hủy dòng
            </button>

            <!-- F5: KHÁCH HÀNG -->
            <button
              class="flex-fill py-2 btn text-white border-0"
              style="background-color: #007bff"
              @click="handleCustomer"
              :disabled="!orderActive"
            >
              F5. Khách hàng
            </button>

            <!-- F7: TÍNH TIỀN -->
            <button
              class="flex-fill py-2 btn text-white border-0"
              style="background-color: #28a745"
              @click="handleCheckout"
              :disabled="!orderActive"
            >
              F7. Tính tiền
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
              v-model="searchTerm"
              class="form-control form-control-sm mb-2"
              placeholder="Nhập tên hoặc mã sản phẩm..."
              :disabled="!orderActive"
            />

            <div class="list-group" style="max-height: 400px; overflow-y: auto">
              <button
                v-for="(product, index) in filteredProducts"
                :key="index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                @click="addToOrder(product)"
                :disabled="!orderActive"
              >
                <div>
                  <div class="fw-bold">{{ product.ten }}</div>
                  <div class="text-muted" style="font-size: 12px">
                    Mã: {{ product.ma }}
                  </div>
                </div>
                <span class="badge bg-success">{{
                  formatCurrency(product.gia)
                }}</span>
              </button>

              <div
                v-if="filteredProducts.length === 0"
                class="text-center text-muted py-3"
              >
                Không tìm thấy sản phẩm
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import orderService from "../../api/admin/orderService.js";

const orderActive = ref(false);
const searchTerm = ref("");
const searchCode = ref("");
const heldOrders = ref([]);

const products = ref([
  { ma: "SP001", ten: "Giày Nike Air", gia: 1500000 },
  { ma: "SP002", ten: "Giày Adidas Ultraboost", gia: 2200000 },
  { ma: "SP003", ten: "Giày Converse Classic", gia: 850000 },
  { ma: "SP004", ten: "Giày Vans Old Skool", gia: 950000 },
  { ma: "SP005", ten: "Giày Puma RS-X", gia: 1800000 },
]);

const currentOrder = ref({ code: "", items: [] });

const filteredProducts = computed(() => {
  if (!searchTerm.value) return products.value;
  return products.value.filter(
    (p) =>
      p.ten.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      p.ma.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const addToOrder = (product) => {
  if (!orderActive.value) return alert("Hãy tạo đơn trước khi thêm sản phẩm!");
  const existing = currentOrder.value.items.find((i) => i.ma === product.ma);
  if (existing) existing.soLuong++;
  else currentOrder.value.items.push({ ...product, soLuong: 1 });
};

const addByCode = () => {
  if (!orderActive.value) return alert("Hãy tạo đơn trước!");
  const product = products.value.find(
    (p) => p.ma.toLowerCase() === searchCode.value.toLowerCase()
  );
  if (product) {
    addToOrder(product);
    searchCode.value = "";
  } else alert("Không tìm thấy sản phẩm!");
};

const removeItem = (index) => currentOrder.value.items.splice(index, 1);

const totalQuantity = computed(() =>
  currentOrder.value.items.reduce((sum, i) => sum + i.soLuong, 0)
);
const totalAmount = computed(() =>
  currentOrder.value.items.reduce((sum, i) => sum + i.gia * i.soLuong, 0)
);

const formatCurrency = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v
  );

const handleNewOrder = async () => {
  try {
    const response = await orderService.createHoaDon('ND001');
    currentOrder.value = {
      code: response.data.ma,
      items: [],
    };
    orderActive.value = true;
    alert(`Đã tạo hóa đơn mới: ${response.data.ma}`);
    console.log("Hóa đơn trả về từ backend:", response.data);
  } catch (error) {
    console.error("Lỗi khi tạo hóa đơn:", error);
    alert("Không thể tạo hóa đơn mới. Vui lòng thử lại sau.");
  }
};

const handleHoldOrder = () => {
  if (!orderActive.value) return alert("Chưa có đơn để treo!");
  if (currentOrder.value.items.length === 0)
    return alert("Không có hàng để treo!");
  heldOrders.value.push({ ...currentOrder.value });
  alert("Đã treo đơn hàng: " + currentOrder.value.code);
  currentOrder.value = { code: "", items: [] };
  orderActive.value = false;
};

const selectHeldOrder = (index) => {
  currentOrder.value = heldOrders.value[index];
  heldOrders.value.splice(index, 1);
  orderActive.value = true;
};

const handleCancelRow = () => {
  if (!orderActive.value) return alert("Chưa có đơn!");
  removeItem(currentOrder.value.items.length - 1);
};

const handleCustomer = () => {
  if (!orderActive.value) return alert("Hãy tạo đơn trước!");
  alert("Mở popup khách hàng (đang phát triển)");
};

const handleCheckout = () => {
  if (!orderActive.value) return alert("Chưa có đơn để tính tiền!");
  alert(`Tổng tiền: ${formatCurrency(totalAmount.value)}`);
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
