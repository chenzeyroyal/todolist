import { createElementFromTemplate } from "../../utils/dom.js";
import {
  addVisibility,
  removeVisibility,
  addTopBorder,
  addBotBorder,
} from "../../utils/ui.js";
import SectionTitleEditor from "./SectionTitleEditor.js";
import SectionVisibilityController from "./SectionVisibilityController.js";
import SectionEventHandler from "../../events/SectionEventHandler.js";

export default class SectionView {
  constructor(section, templateSelector, controller) {
    this.el = this.render(section, templateSelector);
    this.section = section;
    this.controller = controller;
    this.taskInputView = null;
    this.isEditing = false;

    this.selectors = {
      titleContainer: this.el.querySelector("[data-js-sectionTitleContainer]"),
      title: this.el.querySelector("[data-js-sectionTitleText]"),
      input: this.el.querySelector("[data-js-sectionTitleInput]"),

      buttonContainer: this.el.querySelector("[data-js-sectionTitleButtons]"),
      submitButton: this.el.querySelector("[data-js-submitSectionButton]"),
      cancelButton: this.el.querySelector("[data-js-cancelSectionButton]"),

      taskInputField: this.el.querySelector("[data-js-taskInputField]"),
      showTaskFieldButton: this.el.querySelector("[data-js-showTaskInputBtn]"),

      taskList: this.el.querySelector("[data-js-todoList]"),

      deleteButton: this.el.querySelector("[data-js-deleteSectionButton]"),

      sortSelect: document.querySelector("[data-js-sortSelect]"),
    };

    this.titleEditor = new SectionTitleEditor(this.section, this.selectors);
    this.visibilityController = new SectionVisibilityController(
      this.selectors,
      this.isEditing
    );

    this.eventHandler = new SectionEventHandler({
      submit: this.onSubmit.bind(this),
      cancel: this.onCancel.bind(this),
      edit: this.onEdit.bind(this),
      showTaskInput: this.onShowTaskField.bind(this),
      scroll: this.onScroll.bind(this),
      sort: this.onSortTasks.bind(this),
      delete: this.onDelete.bind(this),
    });

    this.eventHandler.bindSubmitButton(this.selectors.submitButton);
    this.eventHandler.bindSubmitKey("Enter");
    this.eventHandler.bindCancelButton(this.selectors.cancelButton);
    this.eventHandler.bindСancelKey("Escape");
    this.eventHandler.bindEditTitle(this.selectors.titleContainer);
    this.eventHandler.bindShowTaskInputButton(
      this.selectors.showTaskFieldButton
    );
    this.eventHandler.bindScrollList(this.selectors.taskList);
    this.eventHandler.bindSortSelect(this.selectors.sortSelect);
    this.eventHandler.bindDeleteButton(this.selectors.deleteButton);
  }

  setEditingState(isEditing) {
    this.isEditing = isEditing;

    this.visibilityController.handleEditingView(isEditing);
  }

  render(section, templateSelector) {
    const sectionEl = document.createElement("div");
    sectionEl.classList.add("todo__section");
    sectionEl.dataset.id = section.id;

    const fragment = createElementFromTemplate(templateSelector);
    sectionEl.append(fragment);

    return sectionEl;
  }

  onSubmit() {
    if (this.selectors.input.value.trim() === "") return;
    this.titleEditor.saveTitle();
    this.visibilityController.handleEditingView();
    this.controller.saveToLocalStorage();
    this.cancelEditing();
  }

  onCancel() {
    if (this.section.title === "") {
      this.controller.removeSection(this.section.id);
    }
    this.visibilityController.handleEditingView(false);
    this.cancelEditing();
  }

  onEdit() {
    this.visibilityController.handleEditingView(true);
  }

  onShowTaskField() {
    this.controller.showTaskInput(this.section.id);
  }

  onScroll() {
    const { scrollTop, scrollHeight, clientHeight } = this.selectors.taskList;
    const isScrolable = scrollHeight > clientHeight;

    if (scrollTop === 0 && isScrolable) {
      addTopBorder(this.selectors.taskList);
    }

    if (scrollTop + clientHeight >= scrollHeight - 1 && isScrolable) {
      addBotBorder(this.selectors.taskList);
    }
  }

  onSortTasks(target) {
    const input = target.closest("input");
    const value = input.value;
    if (value) {
      this.controller.sortTasks(this.section.id, value);
    }
  }

  onDelete() {
    if (this.selectors.deleteButton) {
      this.controller.removeSection(this.section.id);
      this.controller.saveToLocalStorage();
    }
  }

  cancelEditing() {
    if (this.isEditing) {
      this.isEditing = false;
      this.titleEditor.cancelTitle();
      this.visibilityController.handleEditingView(this.isEditing);

      if (this.selectors.title.textContent === "") this.remove();
    }
  }

  setTaskInputView(view) {
    this.taskInputView = view;
    removeVisibility(this.selectors.showTaskFieldButton, true);
  }

  clearTaskInputView() {
    if (this.taskInputView) {
      this.taskInputView.remove();
      this.taskInputView = null;
      addVisibility(this.selectors.showTaskFieldButton);
    }
  }

  addTaskView(view) {
    this.selectors.taskList.appendChild(view.el);
    this.selectors.taskList.scrollTop = this.selectors.taskList.scrollHeight;
    document.documentElement.scrollLeft = 0;
  }

  remove() {
    this.el.remove();
  }
}
