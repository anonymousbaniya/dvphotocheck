"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>("light");

  useEffect(() => {
    // Strictly enforce light theme across the application
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("dv_theme");
    } catch {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => {}, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
