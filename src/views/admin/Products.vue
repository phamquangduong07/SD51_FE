<template>
  <div>
    <h3>Products</h3>
    <p>List of products (static demo)</p>

    <div class="row">
      <div class="col-md-4 mb-3" v-for="i in 6" :key="i">
        <div class="card h-100 shadow">
          <img src="/sb-admin/img/product-placeholder.png" class="card-img-top" alt="product" />
          <div class="card-body">
            <h6 class="card-title">Sneaker {{ i }}</h6>
            <p class="text-muted">Price: $99</p>
            <button class="btn btn-sm btn-primary">Edit</button>
            <button class="btn btn-sm btn-danger ms-2">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.card-img-top { height: 180px; object-fit: cover; background: #eee; }
</style>
