import { useEffect, useState } from "react";

// Singleton state supaya semua komponen sync
let listeners: Array<(dark: boolean) => void> = [];
let _isDark = localStorage.getItem("sp-theme") === "dark";

// Apply ke <html> tag
function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("sp-theme", dark ? "dark" : "light");
}

// Init on load
applyTheme(_isDark);

export function useTheme() {
  const [isDark, setIsDark] = useState(_isDark);

  useEffect(() => {
    listeners.push(setIsDark);
    return () => {
      listeners = listeners.filter((l) => l !== setIsDark);
    };
  }, []);

  const toggle = () => {
    _isDark = !_isDark;
    applyTheme(_isDark);
    listeners.forEach((l) => l(_isDark));
  };

  const setDark = (val: boolean) => {
    _isDark = val;
    applyTheme(_isDark);
    listeners.forEach((l) => l(_isDark));
  };

  return { isDark, toggle, setDark };
}