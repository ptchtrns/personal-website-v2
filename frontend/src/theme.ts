import { ref } from "vue";

export type Theme = "dark" | "light" | "system";

export function useTheme() {
    const currentTheme = ref('system')

    function updateTheme(theme: Theme): void {
        const html = document.documentElement;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (theme === "dark") {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            currentTheme.value = "dark";
        } else if (theme === "light") {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            currentTheme.value = "light";
        } else if(systemPrefersDark) {
            html.classList.add("dark");
            localStorage.setItem("theme", "system");
            currentTheme.value = "system";
        } else {
            html.classList.remove("dark");
            localStorage.setItem("theme", "system");
            currentTheme.value = "system";
        }
    }

    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
        updateTheme(savedTheme);
    } else {
        updateTheme("system");
    }

    return { currentTheme, updateTheme }
}