export class SectionEventHandler {
  constructor(
    section,
    selectors,
    titleEditor,
    visibilityController,
    controller
  ) {
    this.section = section;
    this.selectors = selectors;
    this.titleEditor = titleEditor;
    this.visibilityController = visibilityController;
    this.controller = controller;

    this.classes = {
      topReached: "--top-reached",
      bottomReached: "--bottom-reached",
    };
  }

  init() {
    this.onSubmit();
    this.onCancel();
    this.onEdit();
    this.onShowTaskInput();
    this.onScroll();
    this.onSortTasks();
    this.onDelete();
  }

  onSubmit() {
    this.selectors.submitButton.addEventListener("click", () => {
      if (this.selectors.input.value.trim() === "") return;
      this.titleEditor.saveTitle();
      this.visibilityController.handleEditingView();
      this.controller.saveToLocalStorage();
    });

    this.selectors.input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      if (this.selectors.input.value.trim() === "") return;
      this.titleEditor.saveTitle();
      this.controller.saveToLocalStorage();
    });
  }

  onCancel() {
    this.selectors.cancelButton.addEventListener("click", () => {
      if (this.section.title === "") {
        this.controller.removeSection(this.section.id);
      }
      this.visibilityController.handleEditingView(false);
    });

    this.selectors.input.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (this.section.title === "") {
        this.controller.removeSection(this.section.id);
      }
      this.visibilityController.handleEditingView(false);
    });
  }

  onEdit() {
    this.selectors.titleContainer.addEventListener("click", () => {
      this.visibilityController.handleEditingView(true);
    });
  }

  onShowTaskInput() {
    this.selectors.showTaskFieldButton.addEventListener("click", () => {
      this.controller.showTaskInput(this.section.id);
    });
  }

  onScroll() {
    this.selectors.taskList.addEventListener("scroll", () => {
      const { scrollTop, scrollHeight, clientHeight } = this.selectors.taskList;
      const isScrolable = scrollHeight > clientHeight;

      if (scrollTop === 0 && isScrolable) {
        this.selectors.taskList.classList.add(this.classes.topReached);
        setTimeout(() => {
          this.selectors.taskList.classList.remove(this.classes.topReached);
        }, 500);
        this.selectors.taskList.classList.remove(this.classes.bottomReached);
      } else {
        this.selectors.taskList.classList.remove(this.classes.topReached);
      }

      if (scrollTop + clientHeight >= scrollHeight - 1 && isScrolable) {
        this.selectors.taskList.classList.add(this.classes.bottomReached);
        setTimeout(() => {
          this.selectors.taskList.classList.remove(this.classes.bottomReached);
        }, 500);
        this.selectors.taskList.classList.remove(this.classes.topReached);
      } else {
        this.selectors.taskList.classList.remove(this.classes.bottomReached);
      }
    });
  }

  onSortTasks() {
    const sortSelect = this.selectors.sortSelect;
    if (!sortSelect) return;

    sortSelect.addEventListener("click", (e) => {
      if (e.target.tagName !== "INPUT") return;

      const input = e.target.closest("input");
      const value = input.value;
      if (value) {
        this.controller.sortTasks(this.section.id, value);
      }
    });
  }

  onDelete() {
    if (this.selectors.deleteButton) {
      this.selectors.deleteButton.addEventListener("click", () => {
        this.controller.removeSection(this.section.id);
        this.controller.saveToLocalStorage();
      });
    }
  }
}
