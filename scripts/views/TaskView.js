import {
  createElementFromTemplate,
  slide,
  show,
  unShow,
} from "../utils/dom.js";
export default class TaskView {
  constructor(task, templateSelector) {
    this.el = this.renderTask(task, templateSelector);
    this.task = task;

    this.text = this.el.querySelector("[data-js-taskTextContainer]");
    this.radio = this.el.querySelector("[data-js-todoRadio]");
    this.deleteButton = this.el.querySelector("[data-js-deleteTaskButton]");
  }

  renderTask(task, templateSelector) {
    const fragment = createElementFromTemplate(templateSelector);
    const li = fragment.querySelector("li");

    li.dataset.id = task.id;
    li.querySelector("[data-js-taskTextContainer]").textContent = task.text;
    return li;
  }

  onCompleteTask(callback) {
    this.radio.addEventListener("change", () => {
      if (this.radio.checked) {
        this.el.classList.add("--completed");
        this.task.isActive = false;
        callback();
      } else {
        this.el.classList.remove("--completed");
        this.task.isActive = true;
        callback();
      }
    });
  }

  onEdit(callback) {
    this.el.addEventListener("click", (e) => {
      if (e.target.closest("label") || e.target.closest("button")) return;
      callback(this.el.dataset.id);
    });
  }

  onDelete(callback) {
    if (this.deleteButton) {
      this.deleteButton.addEventListener("click", () => {
        callback?.(this.el.dataset.id);
      });
    }
  }

  update(text, priority) {
    this.task.text = text;
    this.task.priority = priority;
    this.text.textContent = text;
    this.el.setAttribute("priority", priority);
  }

  show() {
    show(this.el);
  }

  slide() {
    slide(this.el);
  }

  remove() {
    unShow(this.el);
    setTimeout(() => this.el.remove(), 200);
  }
}
