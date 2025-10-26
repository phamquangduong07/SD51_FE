import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import Products from '@/views/admin/Products.vue'
import Order from '@/views/admin/Order.vue'
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'AdminDashboard', component: Dashboard },
      { path: 'products', name: 'AdminProducts', component: Products },
      {path: 'order', name: 'AdminOrders', component: Order }
    ]
  },
  { path: '/', redirect: '/admin' },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
