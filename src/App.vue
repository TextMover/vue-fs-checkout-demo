<template>
  <v-app>
    <FastSpringProvider>
      <NavBar />
      <router-view />
      <!-- <SettingsPanel /> -->
    </FastSpringProvider>
  </v-app>
</template>

<script setup>
import FastSpringProvider from "./components/FastSpringProvider1.vue";
import NavBar from "./components/Navbar.vue";
import SettingsPanel from './components/SettingsPanel.vue';
</script>
