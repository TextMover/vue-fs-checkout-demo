<template>
  <!-- Hero Banner -->
  <v-container fluid class="banner">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" class="text-center">
        <h1 class="text-h5 text-md-h4 text-lg-h3 text-white">
          Effect plugins for music production
        </h1>
        <v-btn color="primary" class="mt-3" large @click="resetCart">Reset Cart</v-btn>
      </v-col>
    </v-row>
  </v-container>

  <!-- Products Section -->
  <v-container fluid>
    <v-row class="justify-space-around">
      <!-- <v-col cols="12" class="text-center">
        <h2 class="text-h4">Our Products</h2>
      </v-col> -->
      <v-col
        v-for="product in products"
        :key="product.path"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="pa-4 d-flex"
      >
        <v-skeleton-loader :loading="loading" class="w-75 border rounded-lg" type="image, heading, subtitle, button">
          <v-card class="d-flex flex-column fill-height" width="100%">
            <!-- Image Fix: Full Width + Aspect Ratio -->
            <v-img 
              :src="product.image || 'https://via.placeholder.com/500x300'"
              width="100%"
              aspect-ratio="16/9"
              class="rounded-t-lg"
            ></v-img>
            <v-card-title class="text-h6">{{ product.display || 'Product Title' }}</v-card-title>
            <v-card-subtitle class="text-subtitle-2">
              {{ product.price ? `${product.price}` : 'Price Unavailable' }}
            </v-card-subtitle>
            <v-spacer></v-spacer>
            <v-card-actions class="d-flex justify-center">
                <v-btn variant="outlined" color="primary" @click="buyProduct(product.path)">Add to Cart</v-btn>
            </v-card-actions>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { ref, onMounted, computed, inject } from "vue";

// Inject FastSpringContext
const fastSpringContext = inject("FastSpringContext");

if (!fastSpringContext) {
  console.error("FastSpringContext not found. Ensure FastSpringProvider is wrapping this component.");
}

// access `products`
const products = computed(() => fastSpringContext?.products?.value ?? []);


const loading = ref(true);

console.log("Products are :", products.value);

//  Simulate a loading delay
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
    console.log("Products after loading:", products.value);
  }, 2000);
});

//  Function to reset the FastSpring cart
const resetCart = () => {
  if (window.fastspring?.builder) {
    window.fastspring.builder.reset();
  } else {
    console.error("FastSpring is not loaded.");
  }
};

// Function to add a product to the cart
const buyProduct = (path) => {
  const newProduct = { path, quantity: 1 };
  const payload = { products: [newProduct] };

  if (window.fastspring?.builder) {
    window.fastspring.builder.push(payload);
  } else {
    console.error("FastSpring is not loaded.");
  }
};
</script>


<style scoped>
.banner {
  height: 400px;
  background: url("../assets/hero.jpg") no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
