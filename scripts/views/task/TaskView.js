import { createElementFromTemplate } from "../../utils/dom.js";

import {
  slide,
  show,
  unShow,
  setButtonToActive,
  toggleSelectVisibility,
} from "../../utils/ui.js";

import { TaskEventHandler } from "../../events/TaskEventHandler.js";

export default class TaskView {
  constructor(task, templateSelector, controller, sectionView) {
    this.el = this.render(task, templateSelector);
    this.sectionView = sectionView;
    this.task = task;
    this.animationTime = 200;
    this.controller = controller;

    this.classes = {
      completed: "--completed",
      hide: "--hidden",
    };

    this.selectors = {
      text: this.el.querySelector("[data-js-taskTextContainer]"),
      radio: this.el.querySelector("[data-js-todoRadio]"),
      select: this.el.querySelector("[data-js-taskSelect]"),
      selectButton: this.el.querySelector("[data-js-showTaskSelectButton]"),
      editButton: this.el.querySelector("[data-js-editTaskButton]"),
      deleteButton: this.el.querySelector("[data-js-deleteTaskButton]"),
    };

    this.eventHandler = new TaskEventHandler({
      complete: this.onCompleteTask.bind(this),
      edit: this.onEdit.bind(this),
      delete: this.onDelete.bind(this),
    });
    this.eventHandler.bindCompleteRadio(this.selectors.radio);
    this.eventHandler.bindEditButton(this.selectors.editButton);
    this.eventHandler.bindDeleteButton(this.selectors.deleteButton);

    toggleSelectVisibility(this.selectors.selectButton, this.selectors.select);
    this.load();
  }

  render(task, templateSelector) {
    const fragment = createElementFromTemplate(templateSelector);
    const li = fragment.querySelector("li");

    li.dataset.id = task.id;
    li.querySelector("[data-js-taskTextContainer]").textContent = task.text;
    return li;
  }

  load() {
    if (this.task.isActive) {
      this.el.classList.remove(this.classes.completed);
      this.selectors.radio.checked = false;
    } else {
      this.el.classList.add(this.classes.completed);
      this.selectors.radio.checked = true;
    }
  }

  onCompleteTask() {
    if (this.selectors.radio.checked) {
      this.el.classList.add(this.classes.completed);
      this.task.isActive = false;
      setTimeout(() => {
        this.sectionView.clearTaskInputView();
        this.controller.sortTasks(this.sectionView.section.id, "status");
      }, 1000);

      this.controller.saveToLocalStorage();
    } else {
      this.el.classList.remove(this.classes.completed);
      this.task.isActive = true;
      this.controller.saveToLocalStorage();
    }
  }

  onEdit() {
    this.controller.showTaskEditingInput(
      this.sectionView.section.id,
      this.task.id
    );

    setButtonToActive(this.sectionView.taskInputView?.submitButton);
    this.controller.saveToLocalStorage();
  }

  onDelete() {
    this.sectionView.clearTaskInputView();
    this.controller.removeTask(this.task.id, this.sectionView.section.id);
    this.controller.saveToLocalStorage();
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
