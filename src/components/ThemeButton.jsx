import { useState } from "react";
import styles from "./css/ThemeButton.module.css";

function ThemeButton() {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`${styles.base} ${
        isDark ? styles.darkMode : styles.lightMode
      }`}
    >
      {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

export default ThemeButton;