// src/composables/useFastSpring.js
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
// import { useFastSpringStore } from "../store/useFastSpringStore1";

export function useFastSpring() {
  // const store = useFastSpringStore();
  const products = ref([]);
  const data = ref({});
  const isTestMode = ref(true);
  const storefront = ref("assignmentse.test.onfastspring.com/embedded-test");
  const route = useRoute();

  const scriptIdMain = "fsc-api";
  const scriptIdCheckout = "fsc-api-second";

  const toggleStorefront = () => {
    isTestMode.value = !isTestMode.value;
    storefront.value = isTestMode.value ? "assignmentse.test.onfastspring.com/embedded-test" : "assignmentse.onfastspring.com/embedded";
  };

  const setFastSpringData = (fastSpringData) => {

  };

  // Function to set opacity to 0 for elements with the same ID
  const setOpacityToZero = () => {
    const elements = document.querySelectorAll("#fsc-embedded-checkout-skeleton");
    elements.forEach((element) => {
      if (element.style.opacity !== "0") {
        element.style.opacity = "0";
        element.style.transition = "opacity 0.1s";
      }
    });
  };

  const addScript = (id, src, attributes = {}) => {
    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement("script");
      script.type = "text/javascript";
      script.id = id;
      script.src = src;
      Object.keys(attributes).forEach((key) => script.setAttribute(key, attributes[key]));
      script.dataset.storefront = storefront.value;
      document.body.appendChild(script);
    }
    return script;
  };

  const removeScript = (id) => {
    const script = document.getElementById(id);
    if (script) script.remove();
  };

  const cleanupScripts = () => {
    // if (window.fastspring) {
    //   window.fastspring.builder.reset(); // Ensure FastSpring session is reset
    // }
    if (window.fastspring?.builder) {
      window.fastspring.builder.reset();
    }
    removeScript(scriptIdMain);
    removeScript(scriptIdCheckout);
  };

  const loadCheckoutScript = () => {
    const checkoutScript = addScript(scriptIdCheckout, "https://sbl.onfastspring.com/sbl/0.9.5/fastspring-builder.min.js", {
      "data-continuous": "true",
    });

    checkoutScript.onload = () => {
      console.log("Checkout script fully loaded");
      setTimeout(() => setOpacityToZero(), 1500);
    };

    checkoutScript.onerror = () => {
      console.error("Failed to load checkout script");
    };
  };

  const loadFastSpringScripts = () => {
    const mainScript = addScript(scriptIdMain, "https://sbl.onfastspring.com/sbl/0.9.5/fastspring-builder.min.js", {
      "data-continuous": "true",
      "data-data-callback": "fastSpringCallBack",
      "data-popup-webhook-received": "dataPopupWebhookReceived",
    });

    // mainScript.onload = () => {
    //   console.log("Main script loaded");
    //   setTimeout(() => {
    //     setOpacityToZero();
    //   }, 1500);
    // };

    mainScript.onerror = () => {
      console.error("Failed to load main script");
    };

    if (route.path === "/checkout") {
      console.log("Adding checkout script");
      loadCheckoutScript();
    } else {
      console.log("Removing checkout script");
      removeScript(scriptIdCheckout);
    }
  };

  onMounted(() => {
    // Set the FastSpring callback before loading scripts
    window.fastSpringCallBack = (fastSpringData) => {
      // store.setFastSpringData(fastSpringData);
      data.value = fastSpringData;
      products.value = fastSpringData.groups?.flatMap((group) => group.items) || [];
      console.log("FastSpring Data:", fastSpringData);
    };

    loadFastSpringScripts();
  });

  onUnmounted(cleanupScripts);

  watch(() => storefront.value, () => {
    console.log("Storefront changed");
    cleanupScripts();
    loadFastSpringScripts();
  });

  // Watch for changes in route path (to load checkout script if needed)
  watch(
    () => route.path,
    async (newPath) => {
      if (newPath === "/checkout") {
        await loadCheckoutScript(); // Load checkout script if the path is "/checkout"
      } else {
        removeScript(scriptIdCheckout); // Remove the checkout script if on another route
      }
    });

  // watch(() => route.path, (newPath) => {
  //   console.log("Route changed to:", newPath);
  //   cleanupScripts();
  //   loadFastSpringScripts();
  // });

  return {products, data, setFastSpringData, isTestMode, toggleStorefront, storefront, loadFastSpringScripts };
}
