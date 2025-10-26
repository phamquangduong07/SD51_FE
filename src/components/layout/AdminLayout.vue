<template>
  <div id="wrapper" class="d-flex">
    <!-- Sidebar -->
    <nav
      id="sidebar"
      class="bg-gradient-primary sidebar sidebar-dark accordion "
    >
      <div
        class="sidebar-brand d-flex align-items-center justify-content-center py-3"
      >
        <router-link
          to="/admin"
          class="text-white text-decoration-none fw-bold"
        >
          <i class="fas fa-shoe-prints me-2"></i> SneakerShop
        </router-link>
      </div>

      <hr class="sidebar-divider my-0" />

      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/admin">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span class="ms-2">Dashboard</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link text-white" to="/admin/products">
            <i class="fas fa-fw fa-shoe-prints"></i>
            <span class="ms-2">Products</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link text-white" to="/admin/order">
            <i class="fas fa-fw fa-shopping-cart"></i>
            <span class="ms-2">Orders</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="flex-fill d-flex flex-column bg-light">
      <!-- Topbar -->
      <nav
        class="navbar navbar-expand navbar-light bg-white topbar shadow-sm px-3"
      >
        <button
          class="btn btn-link d-md-none rounded-circle me-3"
          @click="toggleSidebar"
        >
          <i class="fa fa-bars"></i>
        </button>

        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown no-arrow">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
            >
              <span class="me-2 d-none d-lg-inline text-gray-600 small"
                >Admin</span
              >
              <img
                class="img-profile rounded-circle"
                src="/sb-admin/img/undraw_profile.svg"
                alt="profile"
                width="32"
                height="32"
              />
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end shadow animated--grow-in"
              aria-labelledby="userDropdown"
            >
              <li>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i>
                  Profile
                </a>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item text-danger" @click="logout">
                  <i
                    class="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"
                  ></i>
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <!-- Main Content -->
      <main class="flex-fill container-fluid py-4">
        <router-view />
      </main>

      <!-- Footer -->
      <button
        v-show="showScrollTop"
        class="scroll-to-top rounded btn btn-primary position-fixed bottom-0 end-0 m-4"
        @click="scrollToTop"
      >
        <i class="fas fa-angle-up"></i>
      </button>

      <footer
        class="sticky-footer bg-white py-3 mt-auto border-top text-center"
      >
        <small>© {{ new Date().getFullYear() }} SneakerShop Admin</small>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/store";

const collapsed = ref(false);
const auth = useAuthStore();
const showScrollTop = ref(false);

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("toggled", collapsed.value);
};

const logout = () => {
  auth.logout();
  window.location.href = "/login";
};

const scrollHandler = () => {
  showScrollTop.value = window.scrollY > 100;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  // Initialize Bootstrap dropdowns (bootstrap is available via bundle import)
  try {
    if (typeof bootstrap !== "undefined" && bootstrap.Dropdown) {
      document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((el) => {
        new bootstrap.Dropdown(el);
      });
    }
  } catch (e) {
    // ignore if bootstrap not available globally
  }

  window.addEventListener("scroll", scrollHandler);
});

onUnmounted(() => {
  window.removeEventListener("scroll", scrollHandler);
});
</script>

<style scoped>
#wrapper {
  min-height: 100vh;
  overflow-x: hidden;
}

.sidebar {
   width: 240px;
  transition: width 0.2s;
  min-height: 100vh;   /* ít nhất bằng viewport */
  height: auto;        /* tự động kéo dài theo nội dung */
  overflow-y: auto; 
}

.sidebar.toggled {
  width: 80px;
}

.sidebar .nav-link {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
}

.sidebar .nav-link span {
  font-size: 0.9rem;
}

.sidebar .nav-link i {
  width: 20px;
  text-align: center;
}

.img-profile {
  object-fit: cover;
}
</style>
