import { $, addVisibility, toggleVisibility } from "../utils/dom.js";

export default class EventBinder {
  constructor(controller) {
    this.controller = controller;

    this.addSectionButton = $("[data-js-addSectionButton]");

    this.sidebarToggle = $("[data-js-sidebarToggle]");
    this.sidebar = $("[data-js-sidebar]");
    this.main = $("[data-js-main]");

    this.sortButton = $("[data-js-sortButton]");
    this.sortSelect = $("[data-js-sortSelect]");
  }

  bindEvents() {
    this.sidebarToggle?.addEventListener("click", () => {
      this.sidebar?.classList.toggle("--open");
    });

    this.addSectionButton?.addEventListener("click", () => {
      this.controller.addSection();
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
