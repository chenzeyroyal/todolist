import { $, addVisibility } from "../utils/dom.js";

export default class EventBinder {
  constructor(controller) {
    this.controller = controller;

    this.addSectionButton = $("[data-js-addSectionButton]");

    this.sidebarToggle = $("[data-js-sidebarToggle]");
    this.sidebar = $("[data-js-sidebar]");

    this.sortButton = $("[data-js-sortButton]");
    this.sortSelect = $("[data-js-sortSelect]");
    this.themeButton = $("[data-js-themeButton]");
  }

  bindEvents() {
    this.sidebarToggle?.addEventListener("click", () => {
      this.sidebar?.classList.toggle("--closed");
    });

    this.addSectionButton?.addEventListener("click", () => {
      this.controller.addSection();
    });

    this.themeButton.addEventListener("click", () => {
      const theme = document.documentElement.getAttribute("theme");
      theme === "light"
        ? document.documentElement.setAttribute("theme", "dark")
        : document.documentElement.setAttribute("theme", "light");
    });

    document.addEventListener("click", (e) => {
      if (this.sortButton.contains(e.target)) {
        this.sortSelect.classList.toggle("--hidden");
      } else {
        addVisibility(this.sortSelect);
      }
    });
  }
}
