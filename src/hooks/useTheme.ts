import { useEffect, useState } from "react";

export type Theme = "default" | "seo-dark";

const THEME_STORAGE_KEY = "offer-copilot-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as Theme) || "default";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.removeAttribute("data-theme");
    
    // Apply new theme
    if (theme === "seo-dark") {
      root.setAttribute("data-theme", "seo-dark");
    }
    
    // Save to storage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return { theme, setTheme };
}
