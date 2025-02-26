import { ref, provide, inject, watch, onMounted, onUnmounted, defineComponent } from "vue";
import { useRoute } from "vue-router";

const FastSpringContextSymbol = Symbol("FastSpringContext");

export const useFastSpring = () => {
  const context = inject(FastSpringContextSymbol);
  if (!context) {
    throw new Error("useFastSpring must be used within a FastSpringProvider");
  }
  return context;
};

export const FastSpringProvider = defineComponent({
  name: "FastSpringProvider",
  setup(_, { slots }) {
    const products = ref([]);
    const data = ref({});
    const route = useRoute();

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

    // Function to load the embedded SBL script for checkout
    const loadCheckoutScript = () => {
      const scriptId = "fsc-api-second";
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.id = scriptId;
        script.setAttribute("data-continuous", "true");
        script.src = "https://sbl.onfastspring.com/sbl/0.9.5/fastspring-builder.min.js";
        script.dataset.storefront = "assignmentse.test.onfastspring.com/embedded-test";
        document.body.appendChild(script);
      }
      return script;
    };

    // Function to remove the embedded SBL script
    const removeCheckoutScript = () => {
      const scriptId = "fsc-api-second";
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };

    // Function to reload the embedded SBL script
    const reloadCheckoutScript = () => {
      removeCheckoutScript();
      loadCheckoutScript();
    };

    // Function to add the main FastSpring SBL script
    const addSBL = () => {
      const scriptId = "fsc-api";
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.id = scriptId;
        script.setAttribute("data-continuous", "true");
        script.src = "https://sbl.onfastspring.com/sbl/0.9.5/fastspring-builder.min.js";
        script.dataset.storefront = "assignmentse.test.onfastspring.com/embedded-test";
        script.setAttribute("data-data-callback", "fastSpringCallBack");
        script.setAttribute("data-popup-webhook-received", "dataPopupWebhookReceived");
        document.body.appendChild(script);
      }
    };

    onMounted(() => {
      window.fastSpringCallBack = (fastSpringData) => {
        data.value = fastSpringData;
        products.value = fastSpringData.groups?.flatMap((group) => group.items) || [];
        console.log(fastSpringData);
      };

      addSBL();

      if (route.path === "/checkout") {
        // Load EmbeddedSBL only on the checkout page
        const checkoutScript = loadCheckoutScript();
        checkoutScript.onload = () => {
          setTimeout(() => {
            setOpacityToZero();
          }, 1500);
        };
      } else {
        // Remove EmbeddedSBL on other pages
        removeCheckoutScript();
      }
    });

    onUnmounted(() => {
      const scriptToCleanUp = document.getElementById("fsc-api");
      if (scriptToCleanUp) {
        scriptToCleanUp.remove();
      }
      removeCheckoutScript();
    });

    provide(FastSpringContextSymbol, { products, data, reloadCheckoutScript });

    return () => slots.default?.();
  },
});
