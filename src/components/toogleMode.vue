<script setup>
import { useFastSpring } from "../store/useFastSpring";

const { isTestMode, toggleMode } = useFastSpring();
</script>

<template>
  <div class="toggle-container">
    <span>Test Mode</span>
    <label class="switch">
      <input type="checkbox" v-model="isTestMode" @change="toggleMode" />
      <span class="slider"></span>
    </label>
    <span>Real Mode</span>
  </div>
</template>

<style scoped>
.toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;
}

input:checked + .slider {
  background-color: #4caf50;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider:before {
  transform: translateX(20px);
}
</style>
