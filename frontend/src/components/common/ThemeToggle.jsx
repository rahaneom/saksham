import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const normalizeTheme = (value) => {
  if (value === "dark") return "dracula";
  if (value === "light") return "winter";
  if (value === "dracula" || value === "winter" || value === "synthwave") {
    return value;
  }
  return "winter";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => normalizeTheme(localStorage.getItem("theme")));

  useEffect(() => {
    const normalizedTheme = normalizeTheme(theme);
    document.documentElement.setAttribute("data-theme", normalizedTheme);
    localStorage.setItem("theme", normalizedTheme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (normalizeTheme(prevTheme) === "winter" ? "dracula" : "winter"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-sm btn-circle btn-ghost"
      aria-label="Toggle theme"
      title="Toggle light and dark mode"
    >
      {normalizeTheme(theme) === "dracula" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
