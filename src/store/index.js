import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: { name: 'Admin', role: 'admin' }
  }),
  actions: {
    logout() {
      this.user = null
      // In real app you'd clear tokens etc.
    }
  }
})
