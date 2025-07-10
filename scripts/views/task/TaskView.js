import {
  createElementFromTemplate,
  slide,
  show,
  unShow,
} from "../../utils/dom.js";
import { TaskEventHandler } from "./TaskEventHandler.js";

export default class TaskView {
  constructor(task, templateSelector, controller, sectionView) {
    this.el = this.render(task, templateSelector);
    this.sectionView = sectionView;
    this.task = task;
    this.animationTime = 200;
    this.controller = controller;

    this.selectors = {
      text: this.el.querySelector("[data-js-taskTextContainer]"),
      radio: this.el.querySelector("[data-js-todoRadio]"),
      select: this.el.querySelector("[data-js-taskSelect]"),
      selectButton: this.el.querySelector("[data-js-showTaskSelectButton]"),
      editButton: this.el.querySelector("[data-js-editTaskButton]"),
      deleteButton: this.el.querySelector("[data-js-deleteTaskButton]"),
    };

    this.eventHandler = new TaskEventHandler(
      this.task,
      this.selectors,
      this.taskView,
      this.sectionView,
      this.controller
    );
    this.eventHandler.init();
  }

  render(task, templateSelector) {
    const fragment = createElementFromTemplate(templateSelector);
    const li = fragment.querySelector("li");

    li.dataset.id = task.id;
    li.querySelector("[data-js-taskTextContainer]").textContent = task.text;
    return li;
  }

  update(text, priority) {
    this.task.text = text;
    this.task.priority = priority;
    this.selectors.text.textContent = text;
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
    setTimeout(() => this.el.remove(), this.animationTime);
  }
}
