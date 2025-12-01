export type Theme = "dark" | "light" | "system";

export function applyTheme(theme: Theme): void {
    const html = document.documentElement;

    if (theme === "dark") {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        html.classList.remove("dark");
        localStorage.removeItem("theme");
    }
}

export function initTheme(): void {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (systemPrefersDark) {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }
}
