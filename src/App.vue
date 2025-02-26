<template>
  <v-app>
  <FastSpringProvider>
    <NavBar />
    <!-- <toogleMode /> -->
    <router-view />
  </FastSpringProvider>
  </v-app>
   
</template>

<script setup>
import  FastSpringProvider  from "./components/FastSpringProvider1.vue";
import NavBar from "./components/Navbar.vue";
// import toogleMode from "./components/toogleMode.vue";

</script>
