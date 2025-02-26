<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/Auth"
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = () => {
  authStore.login();
  router.push("/"); // Redirect to home after login
};
</script>

<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 80vh">
    <v-card class="pa-5" width="400">
      <v-card-title class="text-center text-h5 font-weight-bold">Login</v-card-title>

      <v-form @submit.prevent="handleLogin">
        <v-text-field 
          v-model="email"
          label="Email address"
          type="email"
          variant="outlined"
          required
        />

        <v-text-field 
          v-model="password"
          label="Password"
          type="password"
          variant="outlined"
          required
        />

        <v-btn type="submit" block color="primary" class="mt-3">Login</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
