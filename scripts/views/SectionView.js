import {
  addVisibility,
  createElementFromTemplate,
  removeVisibility,
  toggleVisibility,
} from "../utils/dom.js";

export default class SectionView {
  constructor(section, templateSelector) {
    this.el = this.render(section, templateSelector);
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
    this.getData();
  }

  getData() {
    this.selectors.title.textContent = this.section.title;

    if (!this.section.title) return;
    this.cancelTitle();
    if (this.isEditing) return;
    this.showAddTaskButton();
  }

  render(section, templateSelector) {
    const sectionEl = document.createElement("div");
    sectionEl.classList.add("todo__sections-column");
    sectionEl.dataset.id = section.id;

    const fragment = createElementFromTemplate(templateSelector);
    sectionEl.append(fragment);

    return sectionEl;
  }

  onSubmit(callback) {
    this.selectors.submitButton.addEventListener("click", () => {
      if (this.selectors.input.value.trim() === "") return;
      this.saveTitle();
      this.cancelEditing();
      callback();
    });

    this.selectors.input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;

      if (this.selectors.input.value.trim() === "") return;
      this.saveTitle();

      this.cancelEditing();
      callback();
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
      const isScrolalble = scrollHeight > clientHeight;

      if (scrollTop === 0 && isScrolalble) {
        this.selectors.taskList.classList.add("--top-reached");
        setTimeout(
          () => this.selectors.taskList.classList.remove("--top-reached"),
          500
        );
        this.selectors.taskList.classList.remove("--bottom-reached");
      } else {
        this.selectors.taskList.classList.remove("--top-reached");
      }

      if (scrollTop + clientHeight >= scrollHeight - 1 && isScrolalble) {
        this.selectors.taskList.classList.add("--bottom-reached");
        setTimeout(
          () => this.selectors.taskList.classList.remove("--bottom-reached"),
          500
        );
        this.selectors.taskList.classList.remove("--top-reached");
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
      if (this.selectors.input.value.trim() === "") {
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
    this.section.title = value;
    this.selectors.title.textContent = this.section.title;

    this.handleEditingView();
    toggleVisibility(this.selectors.showTaskFieldButton, true);
  }

  cancelTitle() {
    const title = this.selectors.title.textContent;
    this.selectors.input.value = title;

    this.handleEditingView();

    if (title === "") this.remove();
  }

  editTitle() {
    this.isEditing = true;

    this.handleEditingView();
  }

  handleEditingView() {
    if (this.isEditing) {
      toggleVisibility(this.selectors.input, true);
      toggleVisibility(this.selectors.title, false);

      this.selectors.input.focus();
      this.selectors.input.setSelectionRange(
        this.selectors.input.value.length,
        this.selectors.input.value.length
      );

      addVisibility(this.selectors.buttonContainer);
    } else {
      toggleVisibility(this.selectors.input, false);
      toggleVisibility(this.selectors.title, true);
      toggleVisibility(this.selectors.buttonContainer, false);
    }
  }

  showAddTaskButton() {
    addVisibility(this.selectors.showTaskFieldButton);
  }

  hideAddTaskButton() {
    removeVisibility(this.selectors.showTaskFieldButton, true);
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
