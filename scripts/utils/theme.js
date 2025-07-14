export function toggleTheme() {
  const theme = document.documentElement.getAttribute("theme");

  theme === "light"
    ? document.documentElement.setAttribute("theme", "dark")
    : document.documentElement.setAttribute("theme", "light");

  const newTheme = document.documentElement.getAttribute("theme");

  localStorage.setItem("theme", newTheme);
}
