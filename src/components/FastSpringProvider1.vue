<script setup>
import { provide, onMounted } from "vue";
import { useFastSpring } from "../composables/useFastSpring1";
import { useFastSpringStore } from "../store/useFastSpringStore1";

// const fastSpring = useFastSpring();
// const fastSpringStore = useFastSpringStore(); // Pinia store instance

// Sync store with fetched FastSpring data
// onMounted(() => {
//   fastSpringStore.setFastSpringData(fastSpring.data);
// });

const {products, data, isTestMode, toggleStorefront, storefront, loadFastSpringScripts} = useFastSpring();

// Provide FastSpring context
provide("FastSpringContext", {products, data, isTestMode, toggleStorefront, storefront, loadFastSpringScripts});
// provide("FastSpringStore", fastSpringStore);
</script>

<template>
  <slot></slot>
</template>
