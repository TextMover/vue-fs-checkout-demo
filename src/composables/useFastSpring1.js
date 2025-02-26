// src/composables/useFastSpring.js
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useFastSpringStore } from "../store/useFastSpringStore1";

export function useFastSpring() {
  const store = useFastSpringStore();
  const route = useRoute();

  const scriptIdMain = "fsc-api";
  const scriptIdCheckout = "fsc-api-second";

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
      document.body.appendChild(script);
    }
    return script;
  };

  const removeScript = (id) => {
    const script = document.getElementById(id);
    if (script) script.remove();
  };

  const cleanupScripts = () => {
    if (window.fastspring) {
      window.fastspring.builder.reset(); // Ensure FastSpring session is reset
    }
    removeScript(scriptIdMain);
    removeScript(scriptIdCheckout);
  };

  const loadFastSpringScripts = () => {
    addScript(scriptIdMain, "https://sbl.onfastspring.com/sbl/0.9.5/fastspring-builder.min.js", {
      "data-continuous": "true",
      "data-storefront": store.storefront,
      "data-data-callback": "fastSpringCallBack",
      "data-popup-webhook-received": "dataPopupWebhookReceived",
    }).onload = () => {
      console.log("Main script loaded");
      setTimeout(() => {
        setOpacityToZero();
      }, 1500);
    };

    if (route.path === "/checkout") {
      let checkoutScript = addScript(scriptIdCheckout, "https://sbl.onfastspring.com/sbl/0.9.5/fastspring-builder.min.js", {
        "data-continuous": "true",
        "data-storefront": store.storefront,
      });

      checkoutScript.onload = () => {
        console.log("Checkout script fully loaded");
        setTimeout(() => setOpacityToZero(), 1000);
      };
    } else {
      console.log("Removing checkout script");
      removeScript(scriptIdCheckout);
    }
  };

  onMounted(() => {
    // Set the FastSpring callback before loading scripts
    window.fastSpringCallBack = (fastSpringData) => {
      store.setFastSpringData(fastSpringData);
      console.log("FastSpring Data:", fastSpringData);
    };

    loadFastSpringScripts();
  });

  onUnmounted(cleanupScripts);

  watch(() => store.storefront, () => {
    console.log("Storefront changed");
    cleanupScripts();
    loadFastSpringScripts();
  });

  // watch(() => route.path, (newPath) => {
  //   console.log("Route changed to:", newPath);
  //   cleanupScripts();
  //   loadFastSpringScripts();
  // });

  return { reloadCheckoutScript: loadFastSpringScripts };
}
