// import { useEffect, useState } from "react";

// function ThemeToggle() {
//   const [theme, setTheme] = useState("winter");

//   useEffect(() => {
//     const saved = localStorage.getItem("theme") || "winter";
//     setTheme(saved);
//     document.querySelector("html").setAttribute("data-theme", saved);
//   }, []);

//   const handleChange = (e) => {
//     const checked = e.target.checked;
//     const newTheme = checked ? "dracula" : "winter";
//     setTheme(newTheme);
//     document.querySelector("html").setAttribute("data-theme", newTheme);
//     localStorage.setItem("theme", newTheme);
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <label className="swap swap-rotate">
//         {/* hidden checkbox with daisyui controller for winter/dracula toggle */}
//         <input
//           type="checkbox"
//           value="dracula"
//           className="checkbox theme-controller"
//           checked={theme === "dracula"}
//           onChange={handleChange}
//         />
//         {/* Sun icon (light) */}
//         <svg
//           className="swap-off w-5 h-5"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.415 0l1.414 1.414a1 1 0 01-1.414 1.415L4.22 5.636a1 1 0 010-1.415zm11.314 0a1 1 0 010 1.415l-1.414 1.414a1 1 0 01-1.415-1.415l1.414-1.414a1 1 0 011.415 0zM10 12a2 2 0 100-4 2 2 0 000 4zm0-5a3 3 0 110 6 3 3 0 010-6zm7.78-2.78a1 1 0 01-1.415 1.415l-1.414-1.414a1 1 0 011.415-1.415l1.414 1.414zM5.636 15.364a1 1 0 010-1.415l1.414-1.414a1 1 0 111.415 1.415l-1.414 1.414a1 1 0 01-1.415 0z" />
//         </svg>
//         {/* Moon icon (dark) */}
//         <svg
//           className="swap-on w-5 h-5"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//         </svg>
//       </label>

//       {/* additional controller for synthwave theme */}
//       <input
//         type="checkbox"
//         value="synthwave"
//         className="checkbox theme-controller"
//         checked={theme === "synthwave"}
//         onChange={(e) => {
//           const newT = e.target.checked ? "synthwave" : theme;
//           setTheme(newT);
//           document.querySelector("html").setAttribute("data-theme", newT);
//           localStorage.setItem("theme", newT);
//         }}
//         title="Synthwave theme"
//       />
//     </div>
//   );
// }

// export default ThemeToggle;


import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={toggleTheme} className="btn btn-sm btn-circle btn-ghost">
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}