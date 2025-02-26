<template>
  <v-container fluid class="py-5" style="margin-top: 10rem;">
    <v-row>
      <v-col cols="12">
        <!-- switch to live mode -->
        <!-- Toggle Switch -->
        <label class="switch">
          <input type="checkbox" :checked="isTestMode" @change="switchStorefront">
          <span class="slider"></span>
        </label>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-5" elevation="3">
          <v-card-title class="text-h5 font-weight-bold">Your Cart</v-card-title>
          <v-divider class="mb-3"></v-divider>

          <v-list v-if="selectedProducts.length > 0">
            <v-list-item v-for="product in selectedProducts" :key="product.path">
              <template v-slot:prepend>
                <v-avatar size="65">
                  <v-img :src="product.image" :alt="product.display"></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-1 font-weight-medium">
                {{ product.display }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">Price: {{ product.price }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn icon color="red" @click.prevent="removeProduct(product.path)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>

          <v-alert v-else type="info" variant="outlined" class="mt-3">No products available</v-alert>
        </v-card>

        <v-card v-if="isCrossSaleEligible && crossSale" class="mt-5 pa-3" elevation="3">
          <v-card-title class="text-subtitle-1 font-weight-bold">You might also be interested in...</v-card-title>
          <v-divider class="mb-3"></v-divider>

          <v-list-item :key="crossSale.path">
            <template v-slot:prepend>
              <v-avatar size="65">
                <v-img :src="crossSale.image" :alt="crossSale.display"></v-img>
              </v-avatar>
            </template>
            <v-list-item-title class="text-body-1 font-weight-medium">
              {{ crossSale.display }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">Price: {{ crossSale.price }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-btn color="primary" variant="outlined" @click="addProduct(crossSale.path)">
                Add to Cart
              </v-btn>
            </template>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <!-- <v-card class="pa-5 d-flex justify-center align-center" height="100%" elevation="3"> -->
        <div id="fsc-embedded-checkout-container" style="max-width: 500px; position: relative; min-height: 500px;">
        </div>
        <!-- </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
// import { useFastSpring } from "../store/fastSpringContext";
import { useFastSpringStore } from "../store/useFastSpringStore1";

const fastSpringStore = useFastSpringStore();

const products = computed(() => fastSpringStore.products);
const selectedProducts = ref([]);
const crossSale = ref(null);
const isTestMode = computed(() => fastSpringStore.isTestMode);

watch(
  products,
  () => {
    selectedProducts.value = products.value.filter((product) => product.selected === true);
    crossSale.value = products.value.find((product) => product.path === "fxlab-subscription") || null;
  },
  { immediate: true }
);

const switchStorefront = () => {
  fastSpringStore.toggleStorefront();
};

watch(
  isTestMode,
  () => {
    console.log("Refreshing FastSpring Checkout");
    console.log("mode", isTestMode.value);
    // window.fastspring.builder.reset();
    // window.fastspring.builder.checkout();
  },
  { immediate: true }
);

const isCrossSaleEligible = computed(() => {
  return !selectedProducts.value.some((product) => product.path === "fxlab-subscription");
});

const removeProduct = (path) => {
  window.fastspring.builder.remove(path);
};

const addProduct = (path) => {
  window.fastspring.builder.add(path);
};

// onMounted(() => {
//   window.dataPopupWebhookReceived = (orderReference) => {
//     if (orderReference) {
//       console.log(orderReference.id);
//       window.fastspring.builder.reset();
//       setTimeout(() => window.location.reload(), 5000);
//     } else {
//       console.log("No order ID");
//     }
//   };

// Function to try focusing on the FastSpring iframe
// const focusFastSpringIframe = () => {
//   document.addEventListener("click", () => {
//     const iframe = document.querySelector("iframe");
//     if (iframe) {
//       iframe.click();
//     }
//   }, { once: true });


// };

// Attempt focusing when the page loads
// focusFastSpringIframe();

// Try again when the user interacts with the page
// window.addEventListener("click", () => {
//   focusFastSpringIframe();
// });

// // Listen for messages from FastSpring's iframe
// window.addEventListener("message", (event) => {
//   if (event.data && event.data.fscPopupMessage) {
//     console.log("FastSpring Event:", event.data);
//     if (event.data.fscPopupMessage.action === "event") {
//       setTimeout(() => {
//         const iframe = document.querySelector("iframe");
//         if (iframe) {
//           iframe.click(); // Simulating interaction
//         }
//       }, 1000);
//     }
//   }
// });

// });

onMounted(() => {
  console.log("Initializing FastSpring Checkout");

  if (window.fastspring) {
    // window.fastspring.builder.reset();
    window.fastspring.builder.checkout();
  }

  // Handle order reference callback
  window.dataPopupWebhookReceived = (orderReference) => {
    if (orderReference) {
      console.log("OrderReference ID:", orderReference.id);
      window.fastspring.builder.reset();
      setTimeout(() => window.location.reload(), 5000);
    } else {
      console.log("No order ID received.");
    }
  };
});


onUnmounted(() => {
  delete window.dataPopupWebhookReceived;
});
</script>

<style scoped>
#fsc-popup-frame {
  position: relative !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 500px;
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}
</style>
