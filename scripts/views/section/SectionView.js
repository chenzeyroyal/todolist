import {
  createElementFromTemplate,
  addVisibility,
  removeVisibility,
} from "../../utils/dom.js";
import SectionTitleEditor from "./SectionTitleEditor.js";
import SectionVisibilityController from "./SectionVisibilityController.js";
import { SectionEventHandler } from "./SectionEventHandler.js";

export default class SectionView {
  constructor(section, templateSelector, controller) {
    this.el = this.render(section, templateSelector);
    this.section = section;
    this.controller = controller;
    this.taskInputView = null;
    this.isEditing = false;

    this.currentSort = "date";

    this.selectors = {
      titleContainer: this.el.querySelector("[data-js-sectionTitleContainer]"),
      title: this.el.querySelector("[data-js-sectionTitleText]"),
      input: this.el.querySelector("[data-js-sectionTitleInput]"),
      buttonContainer: this.el.querySelector(
        "[data-js-sectionTitleButtonContainer]"
      ),
      submitButton: this.el.querySelector("[data-js-submitSectionButton]"),
      cancelButton: this.el.querySelector("[data-js-cancelSectionButton]"),
      showTaskFieldButton: this.el.querySelector(
        "[data-js-showTaskInputButton]"
      ),

      taskInputField: this.el.querySelector("[data-js-taskInputField]"),
      taskList: this.el.querySelector("[data-js-todoList]"),
      deleteButton: this.el.querySelector("[data-js-deleteSectionButton]"),
      sortSelect: document.querySelector("[data-js-sortSelect]"),
    };

    this.titleEditor = new SectionTitleEditor(this.section, this.selectors);
    this.visibilityController = new SectionVisibilityController(
      this.selectors,
      this.isEditing
    );
    this.eventHandler = new SectionEventHandler(
      this.section,
      this.selectors,
      this.titleEditor,
      this.visibilityController,
      this.controller
    );
    this.eventHandler.init();

    this.load();
  }

  load() {
    if (!this.isEditing) {
      addVisibility(this.selectors.showTaskFieldButton);
    }
  }

  setEditingState(isEditing) {
    this.isEditing = isEditing;
    this.visibilityController.handleEditingView(isEditing);
  }

  render(section, templateSelector) {
    const sectionEl = document.createElement("div");
    sectionEl.classList.add("todo__sections-column");
    sectionEl.dataset.id = section.id;

    const fragment = createElementFromTemplate(templateSelector);
    sectionEl.append(fragment);

    return sectionEl;
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
  }

  remove() {
    this.el.remove();
  }
}
