<script setup>
import { provide, onMounted } from "vue";
import { useFastSpring } from "../composables/useFastSpring1";
import { useFastSpringStore } from "../store/useFastSpringStore1";

const fastSpring = useFastSpring();
// const fastSpringStore = useFastSpringStore(); // Pinia store instance

// Sync store with fetched FastSpring data
// onMounted(() => {
//   fastSpringStore.setFastSpringData(fastSpring.data);
// });

// Provide FastSpring context
provide("FastSpringContext", fastSpring);
// provide("FastSpringStore", fastSpringStore);
</script>

<template>
  <slot></slot>
</template>
