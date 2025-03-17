<template>
    <!-- <h1>Cart (will remove this)</h1> -->
    <v-btn prepend-icon="mdi-cart" v-if="selectedProducts.length" fab bottom right color="primary" class="floating-cart"
        @click="showCart = !showCart">
         {{ selectedProducts.length }}
    </v-btn>

    <v-dialog v-model="showCart" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar>
                <v-toolbar-title>Your Cart</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="showCart = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
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
                                <v-list-item-subtitle class="text-caption">
                                    Price: {{ product.price }} x {{ product.quantity }} = {{ product.total }}
                                </v-list-item-subtitle>
                                <template v-slot:append>
                                    <v-btn icon color="blue" @click="updateQuantity(product, -1)" :disabled="product.quantity <= 1">
                                        <v-icon>mdi-minus</v-icon>
                                    </v-btn>
                                    <span class="px-2">{{ product.quantity }}</span>
                                    <v-btn icon color="blue" @click="updateQuantity(product, 1)">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                    <v-btn icon color="red" @click.prevent="removeProduct(product.path)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                            </v-list-item>
                        </v-list>

                        <v-list v-else>
                            <v-alert type="info" variant="outlined" class="mt-3">Your Shopping Cart is Empty</v-alert>
                        </v-list>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-card class="pa-5" elevation="3">
                            <v-card-title class="text-h5 font-weight-bold">Order Summary</v-card-title>
                            <v-divider class="mb-3"></v-divider>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-title>Subtotal</v-list-item-title>
                                    <v-list-item-subtitle>{{ data.subtotal ? data.subtotal : 0}}</v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-title>Tax ({{ data.taxRate ? data.taxRate : 0 }})</v-list-item-title>
                                    <v-list-item-subtitle>{{ data.taxValue ? data.taxValue : 0 }}</v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-title>Total</v-list-item-title>
                                    <v-list-item-subtitle>{{ data.totalWithTax ? data.totalWithTax : 0 }}</v-list-item-subtitle>
                                </v-list-item>
                            </v-list>
                            <v-btn block color="primary" @click="checkout" class="mt-5">Checkout</v-btn>
                            <v-btn block color="secondary" class="mt-3" @click="resetCart">Clear Cart</v-btn>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, inject, ref, watch } from "vue";
import router from "../router";
import Checkout from "../views/checkout.vue";

const fastSpringStore = inject("FastSpringContext");
const products = computed(() => fastSpringStore?.products.value ?? []);
const data = computed(() => fastSpringStore?.data.value ?? {});
const selectedProducts = ref([]);
const showCart = ref(false);

watch(
    products,
    () => {
        selectedProducts.value = products.value
            .filter((product) => product.selected === true)
            .map((p) => ({
                ...p,
                quantity: p.quantity || 1, // Track quantity per product
            }));
    },
    { immediate: true }
);

// const totalPrice = computed(() => {
//     return selectedProducts.value.reduce((acc, product) => acc + product.price * product.quantity, 0);
// });


// const updateQuantity = (product, change) => {
//     const updatedQuantity = product.quantity + change;
//     if (updatedQuantity < 1) return;

//     product.quantity = updatedQuantity;

//     window.fastspring.builder.push({
//         reset: true,
//         products: [
//             {
//                 path: product.path,
//                 quantity: updatedQuantity,
//             },
//         ],
//     });
// };

const checkout = () => {
    showCart.value = false;
    router.push("/checkout");
};

const updateQuantity = (product, change) => {
    const updatedProducts = selectedProducts.value.map((p) => {
        if (p.path === product.path) {
            return { ...p, quantity: p.quantity + change };
        }
        return p;
    });

    selectedProducts.value = updatedProducts;

    // Send updated quantities to FastSpring
    var mySession = {
        products: updatedProducts.map((p) => ({
            path: p.path,
            quantity: p.quantity,
        })),
    };

    // Update FastSpring cart with new quantities
    window.fastspring.builder.push(mySession);
};


const removeProduct = (path) => {
    window.fastspring.builder.remove(path);
    selectedProducts.value = selectedProducts.value.filter((p) => p.path !== path);
};

const resetCart = () => {
    if (window.fastspring?.builder) {
        window.fastspring.builder.reset();
        selectedProducts.value = [];
    }
};
</script>

<style scoped>
.floating-cart {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999;
}
</style>
