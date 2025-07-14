import { $ } from "../utils/dom.js";
import { toggleSelectVisibility, toggleSidebar } from "../utils/ui.js";
import { toggleTheme } from "../utils/theme.js";

export default class EventBinder {
  constructor(controller) {
    this.controller = controller;

    this.addSectionButton = $("[data-js-addSectionButton]");

    this.sidebarButton = $("[data-js-sidebarButton]");
    this.sidebar = $("[data-js-sidebar]");

    this.sortButton = $("[data-js-sortButton]");
    this.sortSelect = $("[data-js-sortSelect]");
    this.themeButton = $("[data-js-themeButton]");
  }

  bindEvents() {
    this.sidebarButton?.addEventListener("click", () =>
      toggleSidebar(this.sidebar)
    );

    this.addSectionButton?.addEventListener("click", () =>
      this.controller.addSection()
    );

    this.themeButton.addEventListener("click", () => toggleTheme());

    toggleSelectVisibility(this.sortButton, this.sortSelect);
  }
}
