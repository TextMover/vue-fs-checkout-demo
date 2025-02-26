import { defineStore } from "pinia";
import { ref, watch } from "vue";

// load initial state from localStorage
const storedAuthState = JSON.parse(localStorage.getItem("authState")) || { isLogged: false };

export const useAuthStore = defineStore("auth", () => {
    const isLogged = ref(storedAuthState.isLogged);
    
    watch(isLogged, (newVal) => {
        localStorage.setItem("authState", JSON.stringify({ isLogged: newVal }));
    });

    // actions
    const login = () => {
        isLogged.value = true;
    };

    const logout = () => {
        isLogged.value = false;
    };

    return {
        isLogged,
        login,
        logout,
    };
});
