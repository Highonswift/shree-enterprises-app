"use client";

import { useEffect, useState } from "react";

// Names only: each theme's colours are defined in globals.css.
const THEMES = [
  { id: "midnight-gold", label: "Theme 2 – Midnight Navy & Champagne Gold" },
  { id: "graphite-copper", label: "Theme 3 – Graphite Black & Copper" },
  { id: "deep-ocean", label: "Theme 1 – Deep Ocean & Aqua Silver" },
];
// Keep equal to data-theme on <html> in layout.tsx.
const DEFAULT_THEME = "deep-ocean";
const STORAGE_KEY = "showcase-theme-v2";

function applyTheme(id: string) {
  const root = document.documentElement;
  root.dataset.theme = id;
  // Mobile browser bar colour, read from the active theme.
  const color = getComputedStyle(root).getPropertyValue("--color-primary").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

/** Client showcase tool: switches the colour theme without reloading. */
export function ThemeSwitcher() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [open, setOpen] = useState(false);

  // Restore the choice after a reload. Storage can be unavailable, e.g. in private windows.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && THEMES.some((item) => item.id === saved)) {
          applyTheme(saved);
          setTheme(saved);
        }
      } catch {}
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const select = (id: string) => {
    applyTheme(id);
    setTheme(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {}
  };

  return (
    <div className="theme-switch">
      <button type="button" className="theme-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Close themes" : "Themes"}
      </button>
      {open && (
        <div className="theme-panel" role="group" aria-label="Colour theme">
          {THEMES.map((item) => (
            <button key={item.id} type="button" data-theme-option={item.id} aria-pressed={item.id === theme} onClick={() => select(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
