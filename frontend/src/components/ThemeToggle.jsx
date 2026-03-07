

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const normalizeTheme = (value) => {
  if (value === "dark" || value === "dracula") return "dark";
  if (value === "light" || value === "winter") return "light";
  return "light";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? normalizeTheme(savedTheme) : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-sm btn-circle btn-ghost"
      aria-label="Toggle theme"
      title="Toggle light and dark mode"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}