<template>
    <v-app-bar app color="primary" elevation="4">
        <!-- Left-side hamburger menu for small screens -->
        <!-- <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none">
            <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
        </v-app-bar-nav-icon> -->

        <!-- Logo / Title -->
        <v-toolbar-title>
            <v-img :width="50" :src="imgSrc"></v-img>
        </v-toolbar-title>

        <!-- Spacer to push items to the right -->
        <!-- <v-spacer></v-spacer> -->

        <!-- Full Navbar Links for Large Screens -->
        <v-btn v-for="(item, i) in navItems" :key="i" :to="item.to" class="d-none d-md-flex d-lg-flex" text
            @click="handleNavClick(item)">
            {{ item.text }}
        </v-btn>
        <v-spacer></v-spacer>

        

        <!-- Cart Button -->
        <v-btn prepend-icon="mdi-cart" outlined dark to="/checkout">
             <span class="ms-1" id="order-total">{{ data.originalTotal }}</span>
        </v-btn>

        <v-menu transition="slide-x-transition">
            <template v-slot:activator="{ props }">
                <v-btn prepend-icon="mdi-dots-vertical" v-bind="props" class="d-lg-none d-md-none">

                </v-btn>
            </template>

            <v-list>
                <v-list-item v-for="(item, i) in navItems" :key="i">
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>

    <!-- Sidebar for Small Screens -->
    <!-- <v-navigation-drawer v-model="drawer" temporary app style="opacity: 11000;">
        <v-list style="opacity: 11000;">
            <v-list-item v-for="(item, i) in navItems" :key="i" :to="item.to" @click="handleNavClick(item, true)">
                <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item> -->

            <!-- Cart in Sidebar
            <v-list-item to="/checkout">
                <v-list-item-icon>
                    <v-icon>mdi-cart</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Cart: {{ data.originalTotal }}</v-list-item-title>
            </v-list-item> -->
        <!-- </v-list>
    </v-navigation-drawer> -->
</template>

<script setup>
import { ref, watch, computed, inject } from "vue";
import logo from "../assets/logo.png";
import { useAuthStore } from "../store/Auth";
import { useRouter } from "vue-router";
import { mdi } from "vuetify/iconsets/mdi";

// Router instance
const router = useRouter();
const authStore = useAuthStore();

// inject FastSpringContext
const fastSpringContext = inject("FastSpringContext");

if (!fastSpringContext) {
  console.error("FastSpringContext not found. Ensure FastSpringProvider is wrapping this component.");
}

//  Destructure injected values
const { data } = fastSpringContext || { data: ref({}) }; // Default to empty object if not found

// Correctly define cart total
const cartTotal = computed(() => {
  return data?.originalTotal ? `$${data.originalTotal.toFixed(2)}` : "$0.00";
});

//  Watch for cart updates
watch(
  () => data.originalTotal,
  (newTotal) => {
    cartTotal.value = newTotal ? `$${newTotal.toFixed(2)}` : "$0.00";
  },
  { immediate: true }
);

// Logout function
const logout = () => {
  authStore.logout();
  router.push("/");
};

// Function to dynamically get navigation items
const navItems = ref(getNavItems(authStore.isLogged));

function getNavItems(isLogged) {
  return [
    { text: "Home", to: "/" },
    { text: "About", to: "/about" },
    { text: "Settings", to: "/settings" },
    isLogged ? { text: "Logout", to: "#", action: logout } : { text: "Login", to: "/login" },
  ];
}

// Watch for authentication changes
watch(
  () => authStore.isLogged,
  (newVal) => {
    navItems.value = getNavItems(newVal);
  }
);

// Handle navigation click
const handleNavClick = (item, isMobile = false) => {
  if (item.action) {
    item.action();
  }
  if (isMobile) {
    drawer.value = false; // Close drawer on mobile
  }
};

// Logo source
const imgSrc = ref(logo);

// Drawer state for mobile menu
const drawer = ref(false);
</script>
