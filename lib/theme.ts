export type Theme = "dark" | "light" | "system";

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light" || value === "system";
}

export function getStoredTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  return isTheme(saved) ? saved : "system";
}

/** Applies the theme to <html> and persists the choice. */
export function updateTheme(theme: Theme) {
  const dark = theme === "dark" ||
    (theme === "system" && globalThis.matchMedia(DARK_QUERY).matches);

  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Keeps the "system" theme in sync with the OS preference. Returns a cleanup
 * function that removes the listener.
 */
export function watchSystemTheme(onChange: (theme: Theme) => void) {
  const mediaQuery = globalThis.matchMedia(DARK_QUERY);

  const handler = () => {
    // Only update if the system theme is used
    if (getStoredTheme() === "system") {
      updateTheme("system");
      onChange("system");
    }
  };

  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
}

/** Inlined in <head> so the theme is applied before the first paint. */
export const themeScript =
  `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");` +
  `var d=t==="dark"||((t===null||t==="system")&&matchMedia("${DARK_QUERY}").matches);` +
  `document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
