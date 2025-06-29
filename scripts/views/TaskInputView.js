import {
  createElementFromTemplate,
  toggleVisibility,
  addVisibility,
} from "../utils/dom.js";

export default class TaskInputView {
  constructor(templateSelector) {
    this.el = this.renderTaskInputField(templateSelector);

    this.input = this.el.querySelector("[data-js-taskInput]");
    this.submitButton = this.el.querySelector("[data-js-submitTaskButton]");
    this.cancelButton = this.el.querySelector("[data-js-cancelTaskButton]");
    this.priorityButton = this.el.querySelector("[data-js-priorityButton]");
    this.priorityList = this.el.querySelector("[data-js-priorityList]");

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-js-sectiontitlecontainer]")) this.remove();
    });
  }

  renderTaskInputField(templateSelector) {
    const taskInputEl = document.createElement("div");
    taskInputEl.classList.add("todo__list-input-field");

    const fragment = createElementFromTemplate(templateSelector);

    taskInputEl.append(fragment);

    return taskInputEl;
  }

  onSubmit(callback) {
    this.submitButton?.addEventListener("click", () => {
      this.focus();

      const value = this.input.value.trim();
      if (!value) return;
      callback(value);

      this.clear();
    });

    this.input?.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      this.focus();

      const value = this.input.value.trim();
      if (!value) return;
      callback(value);
      this.clear();
    });
  }
  onSubmitEdit(callback) {
    this.submitButton?.addEventListener("click", () => {
      const value = this.input.value.trim();
      if (!value) return;
      callback(value);
    });

    this.input?.addEventListener("keydown", (e) => {
      const value = this.input.value.trim();
      if (!value) return;
      callback(value);
    });
  }

  onCancel(callback) {
    this.cancelButton?.addEventListener("click", () => {
      this.clear();
      callback?.();
    });

    this.input?.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      this.clear();
      callback?.();
    });
  }

  onSelectPriority(callback) {
    this.priorityButton.addEventListener("click", () => {
      toggleVisibility(this.priorityList, true);
    });

    this.priorityList.addEventListener("click", (e) => {
      const label = e.target.closest("LABEL");
      if (!label) return;
      addVisibility(this.priorityList, true);
      this.focus();

      const input = label.querySelector("input");
      if (!input) return;
      this.priorityButton.setAttribute("priority", input.value);

      callback(input.value);
    });
  }

  clear() {
    this.input.value = "";
    this.priorityButton.setAttribute("priority", "");
  }

  focus() {
    this.input.focus();
  }

  remove() {
    this.el.remove();
  }

  appendTo(parentEl) {
    parentEl.appendChild(this.el);
  }
}
