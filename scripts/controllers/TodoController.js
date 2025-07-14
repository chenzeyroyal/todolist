import Section from "../models/Section.js";
import SectionView from "../views/section/SectionView.js";
import TaskView from "../views/task/TaskView.js";
import TaskInputView from "../views/task/TaskInputView.js";
import { $ } from "../utils/dom.js";
import { displayModal, onCloseAllSelects } from "../utils/ui.js";

export default class TodoController {
  constructor() {
    this.sections = [];
    this.taskViews = new Map();
    this.sectionViews = new Map();

    this.maxSections = 5;
    this.maxTasks = 15;

    this.defaultPriority = "3";

    this.selectors = {
      container: $("[data-js-todoSections]"),
      addSectionContainer: $("[data-js-addSectionContainer]"),
      sectionTemplate: $("[data-js-section]"),
      taskTemplate: $("[data-js-todoListItem]"),
      taskInputTemplate: $("[data-js-taskInputTemplate]"),
      date: $("[data-js-date]"),
      maxSectionsModal: $("[data-js-maxSectionsModal]"),
      maxTasksModal: $("[data-js-maxTasksModal]"),
    };
    this.loadFromLocalStorage();

    onCloseAllSelects();
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem("todoAppData");
    if (savedData) {
      const data = JSON.parse(savedData);

      data.sections.forEach((sectionData) => {
        const section = new Section(sectionData.title);
        section.id = sectionData.id;

        sectionData.tasks.forEach((taskData) => {
          const task = section.addTask(taskData.text, taskData.priority);
          task.id = taskData.id;
          task.isActive = taskData.isActive;
        });

        this.sections.push(section);

        const sectionView = new SectionView(
          section,
          this.selectors.sectionTemplate,
          this
        );

        this.sectionViews.set(section.id, sectionView);
        this.selectors.container.appendChild(sectionView.el);
        this.selectors.container.insertBefore(
          sectionView.el,
          this.selectors.addSectionContainer
        );

        section.tasks.forEach((task) => {
          this.renderTask(task, task.priority, section.id);
        });

        this.sortTasks(sectionData.id, "status");
      });

      const theme = localStorage.getItem("theme");
      if (!theme) return;
      document.documentElement.setAttribute("theme", theme);
    }
  }

  saveToLocalStorage() {
    const data = {
      sections: this.sections.map((section) => ({
        id: section.id,
        title: section.title,
        tasks: section.tasks.map((task) => ({
          id: task.id,
          text: task.text,
          priority: task.priority,
          createdAt: task.createdAt,
          isActive: task.isActive,
        })),
      })),
    };
    localStorage.setItem("todoAppData", JSON.stringify(data));
  }

  addSection(title = "") {
    this.sectionViews.forEach((view) => {
      if (view.taskInputView?.isActive) {
        view.clearTaskInputView();
      }
    });
    if (this.hasUnfinishedSection()) return;

    if (this.sectionViews.size > this.maxSections) {
      displayModal(this.selectors.maxSectionsModal);
      return;
    }

    const section = new Section(title);
    this.sections.push(section);

    const sectionView = new SectionView(
      section,
      this.selectors.sectionTemplate,
      this
    );

    this.sectionViews.set(section.id, sectionView);
    this.selectors.container.appendChild(sectionView.el);
    this.selectors.container.insertBefore(
      sectionView.el,
      this.selectors.addSectionContainer
    );

    sectionView.setEditingState(true);
  }

  hasUnfinishedSection() {
    return Array.from(this.sectionViews.values()).some(
      (view) => view.isEditing
    );
  }

  removeSection(sectionId) {
    const section = this.sections.find((s) => s.id === sectionId);
    this.sections = this.sections.filter((s) => s.id !== sectionId);

    if (!section) return;

    const view = this.sectionViews.get(sectionId);
    if (view) {
      view.remove();
      this.sectionViews.delete(sectionId);
    }
  }

  renderTask(task, priority, sectionId) {
    const sectionView = this.sectionViews.get(sectionId);

    if (!sectionView) return;
    const taskView = new TaskView(
      task,
      this.selectors.taskTemplate,
      this,
      sectionView
    );
    this.taskViews.set(task.id, taskView);
    taskView.el.setAttribute("priority", priority);

    sectionView.addTaskView(taskView);

    taskView.show();
  }

  showTaskInput(sectionId) {
    const sectionView = this.sectionViews.get(sectionId);

    if (this.taskViews.size > this.maxTasks) {
      displayModal(this.selectors.maxTasksModal);

      return;
    }

    this.closeAllInputs();
    if (!sectionView || sectionView.isEditing) return;

    const taskInputField = new TaskInputView(this.selectors.taskInputTemplate);
    taskInputField.isActive = true;

    sectionView.setTaskInputView(taskInputField);

    taskInputField.appendTo(sectionView.el);
    taskInputField.focus();

    let priority = this.defaultPriority;

    taskInputField.onSelectPriority((value) => (priority = value));

    taskInputField.onSubmit((text) => {
      const section = this.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const task = section.addTask(text, priority);

      this.renderTask(task, task.priority, sectionId);

      sectionView.clearTaskInputView();
      this.sortTasks(sectionId, "status");
    });

    taskInputField.onCancel(() => {
      sectionView.clearTaskInputView();
    });
  }

  showTaskEditingInput(sectionId, taskId) {
    const section = this.sections.find((s) => s.id === sectionId);
    const task = section?.tasks.find((t) => t.id === taskId);

    if (!task) return;

    const taskView = this.taskViews.get(taskId);

    const sectionView = this.sectionViews.get(sectionId);

    if (!sectionView || sectionView.isEditing || sectionView.taskInputView)
      return;

    const taskInputField = new TaskInputView(this.selectors.taskInputTemplate);
    taskInputField.isActive = true;

    sectionView.setTaskInputView(taskInputField);

    taskView.el.after(taskInputField.el);
    taskInputField.focus();

    taskInputField.input.value = task.text;
    taskInputField.priorityButton.setAttribute("priority", task.priority);

    let priority = task.priority;

    taskInputField.onSelectPriority((value) => (priority = value));

    taskInputField.onSubmit((text) => {
      task.text = text;
      task.priority = priority;

      taskView.update(text, priority);
      sectionView.clearTaskInputView();
      this.saveToLocalStorage();
    });

    taskInputField.onCancel(() => {
      sectionView.clearTaskInputView();
      this.saveToLocalStorage();
    });
  }

  removeTask(taskId, sectionId) {
    const section = this.sections.find((s) => s.id === sectionId);
    if (!section) return;

    section.tasks = section.tasks.filter((t) => t.id !== taskId);

    const view = this.taskViews.get(taskId);
    if (view) {
      view.remove();
      this.taskViews.delete(taskId);

      const sectionView = this.sectionViews.get(sectionId);

      setTimeout(() => {
        if (sectionView) {
          this.sortTasks(sectionId, "status");
        }
      }, view.animationTime);
    }
  }

  sortTasks(sectionId, criterion) {
    const section = this.sections.find((s) => s.id === sectionId);
    const sectionView = this.sectionViews.get(sectionId);

    if (!section || !sectionView) return;

    const sortedTasks = section.getSortedTasks(criterion);

    const taskListEl = sectionView.selectors.taskList;

    sortedTasks.forEach((task) => {
      const view = this.taskViews.get(task.id);

      if (view) {
        taskListEl.appendChild(view.el);
        view.slide();
      }
    });
    this.saveToLocalStorage();
  }

  closeAllInputs() {
    this.sectionViews.forEach((view) => {
      if (view.taskInputView?.isActive) {
        view.clearTaskInputView();
      }

      if (view.isEditing) {
        view.cancelEditing();
      }
    });
  }
}
