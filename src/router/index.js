// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import login from '../views/login.vue';
import checkout from '../views/checkout.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/login', component: login },
  { path: '/checkout', component: checkout },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
