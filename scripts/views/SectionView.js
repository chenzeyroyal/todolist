import {
  addVisibility,
  createElementFromTemplate,
  removeVisibility,
  toggleVisibility,
} from "../utils/dom.js";

export default class SectionView {
  constructor(section, templateSelector) {
    this.el = this.renderSection(section, templateSelector);
    this.isEditing = false;
    this.currentSort = "date";
    this.taskInputView = null;
    this.section = section;

    this.selectors = {
      titleContainer: this.el.querySelector("[data-js-sectionTitleContainer]"),
      title: this.el.querySelector("[data-js-sectionTitleText]"),
      input: this.el.querySelector("[data-js-sectionTitleInput]"),
      buttonContainer: this.el.querySelector(
        "[data-js-sectionTitleButtonContainer]"
      ),
      submitButton: this.el.querySelector("[data-js-submitSectionButton]"),
      cancelSectionButton: this.el.querySelector(
        "[data-js-cancelSectionButton]"
      ),
      showTaskFieldButton: this.el.querySelector(
        "[data-js-showTaskInputButton]"
      ),

      taskInputField: this.el.querySelector("[data-js-taskInputField]"),
      taskList: this.el.querySelector("[data-js-todoList]"),
      sortSelect: document.querySelector("[data-js-sortSelect]"),
    };

    this.classes = {
      inactiveButton: "--inactive",
    };
    this.onScroll();
    this.checkInput();
  }

  renderSection(section, templateSelector) {
    const sectionEl = document.createElement("div");
    sectionEl.classList.add("todo__sections-column");
    sectionEl.dataset.id = section.id;

    const fragment = createElementFromTemplate(templateSelector);
    sectionEl.append(fragment);

    return sectionEl;
  }

  onSubmit(section) {
    this.selectors.submitButton.addEventListener("click", () => {
      if (this.selectors.input.value.trim() === "") return;
      section.title = this.saveTitle();
      this.cancelEditing();
    });

    this.selectors.input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      if (this.selectors.input.value.trim() === "") return;
      section.title = this.saveTitle();

      this.cancelEditing();
    });
  }

  onCancel(controller, section) {
    this.selectors.cancelSectionButton.addEventListener("click", () => {
      if (section.title === "") {
        controller.sections = controller.sections.filter(
          (item) => item.id !== section.id
        );
        controller.sectionViews.delete(section.id);
      }
      this.cancelEditing();
      this.cancelTitle();
    });

    this.selectors.input.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;

      if (section.title === "") {
        controller.sections = controller.sections.filter(
          (item) => item.id !== section.id
        );
        controller.sectionViews.delete(section.id);
      }
      this.cancelEditing();
      this.cancelTitle();
    });
  }

  onEdit() {
    this.selectors.titleContainer.addEventListener("click", () => {
      this.isEditing = true;
      this.editTitle();
    });
  }

  onShowTaskInput(controller, section) {
    this.selectors.showTaskFieldButton.addEventListener("click", () => {
      controller.showTaskInput(section.id);
    });
  }

  onScroll() {
    this.selectors.taskList.addEventListener("scroll", () => {
      const { scrollTop, scrollHeight, clientHeight } = this.selectors.taskList;

      // Верх достигнут
      if (scrollTop === 0) {
        this.selectors.taskList.classList.add("--top-reached");
      } else {
        this.selectors.taskList.classList.remove("--top-reached");
      }

      // Низ достигнут
      if (scrollTop + clientHeight >= scrollHeight) {
        this.selectors.taskList.classList.add("--bottom-reached");
      } else {
        this.selectors.taskList.classList.remove("--bottom-reached");
      }
    });
  }

  onSortTasks(callback) {
    const sortSelect = this.selectors.sortSelect;
    if (!sortSelect) return;

    sortSelect.addEventListener("click", (e) => {
      if (e.target.tagName !== "INPUT") return;

      const input = e.target.closest("input");
      const value = input.value;
      if (value) {
        this.currentSort = input.value;
        callback(this.section.id, value);
      }
    });
  }

  checkInput() {
    this.selectors.input.addEventListener("input", () => {
      if (this.selectors.input.value.trim("") === "") {
        this.setSubmitToInactive();
      } else {
        this.setSubmitToActive();
      }
    });
  }

  setSubmitToActive() {
    this.selectors.submitButton.classList.remove(this.classes.inactiveButton);
  }

  setSubmitToInactive() {
    this.selectors.submitButton.classList.add(this.classes.inactiveButton);
  }

  saveTitle() {
    const value = this.selectors.input.value;
    this.selectors.title.textContent = value;

    toggleVisibility(this.selectors.input, false);
    toggleVisibility(this.selectors.title, true);
    toggleVisibility(this.selectors.buttonContainer, false);
    toggleVisibility(this.selectors.showTaskFieldButton, true);

    return value;
  }

  cancelTitle() {
    const title = this.selectors.title.textContent;
    this.selectors.input.value = title;

    toggleVisibility(this.selectors.input, false);
    toggleVisibility(this.selectors.title, true);
    toggleVisibility(this.selectors.buttonContainer, false);

    if (title === "") this.remove();
  }

  editTitle() {
    toggleVisibility(this.selectors.input, true);
    toggleVisibility(this.selectors.title, false);

    this.selectors.input.focus();
    this.selectors.input.setSelectionRange(
      this.selectors.input.value.length,
      this.selectors.input.value.length
    );

    removeVisibility(this.selectors.buttonContainer, true);
  }

  showAddTaskButton() {
    removeVisibility(this.selectors.showTaskFieldButton, true);
  }

  hideAddTaskButton() {
    addVisibility(this.selectors.showTaskFieldButton, true);
  }

  setTaskInputView(view) {
    this.taskInputView = view;
    this.hideAddTaskButton();
  }

  clearTaskInputView() {
    if (this.taskInputView) {
      this.taskInputView.remove();
      this.taskInputView = null;
      this.showAddTaskButton();
    }
  }

  addTaskView(view) {
    this.selectors.taskList.appendChild(view.el);
    this.selectors.taskList.scrollTop = this.selectors.taskList.scrollHeight;
  }

  cancelEditing() {
    if (this.isEditing) {
      this.isEditing = false;
      this.cancelTitle();
    }
  }
  remove() {
    this.el.remove();
  }
}
