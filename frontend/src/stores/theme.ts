import { defineStore } from "pinia";
import { ref, onMounted } from "vue";

export type Theme = "dark" | "light" | "system";

export const useThemeStore = defineStore("theme", () => {
    const currentTheme = ref<Theme>("system");
    let mediaQuery: MediaQueryList | null = null;

    function updateTheme(theme: Theme) {
        const html = document.documentElement;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (theme === "dark") {
            html.classList.add("dark");
            currentTheme.value = "dark";
        } else if (theme === "light") {
            html.classList.remove("dark");
            currentTheme.value = "light";
        } else {
            if (systemPrefersDark) html.classList.add("dark");
            else html.classList.remove("dark");
            currentTheme.value = "system";
        }

        localStorage.setItem("theme", theme);
    }

    function initTheme() {
        const saved = localStorage.getItem("theme") as Theme | null;
        if (saved === "dark" || saved === "light" || saved === "system") {
            updateTheme(saved);
        } else {
            updateTheme("system");
        }
    }

    function setupSystemListener() {
        mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", handleSystemChange);
    }

    function handleSystemChange() {
        // Only update if system theme is used
        const saved = localStorage.getItem("theme") as Theme | null;
        if (!saved || saved === "system") {
            updateTheme("system");
        }
    }

    function removeSystemListener() {
        if (mediaQuery) {
            mediaQuery.removeEventListener("change", handleSystemChange);
            mediaQuery = null;
        }
    }

    if (typeof window !== "undefined") {
        onMounted(() => {
            initTheme();
            setupSystemListener();
        });
    }

    return {
        currentTheme,
        updateTheme,
        initTheme,
        setupSystemListener,
        removeSystemListener
    };
});
