import { defineStore } from "pinia";
import { ref } from "vue";

export const useFastSpringStore = defineStore("fastSpring", () => {
  const products = ref([]);
  const data = ref({});
  const isTestMode = ref(true);
  const storefront = ref("assignmentse.test.onfastspring.com/embedded-test");

  const toggleStorefront = () => {
    isTestMode.value = !isTestMode.value;
    storefront.value = isTestMode.value ? "assignmentse.test.onfastspring.com/embedded-test" : "assignmentse.onfastspring.com/embedded";
  };

  const setFastSpringData = (fastSpringData) => {
    data.value = fastSpringData;
    products.value = fastSpringData.groups?.flatMap((group) => group.items) || [];
  };

  return { products, data, setFastSpringData, isTestMode, toggleStorefront, storefront };
});
