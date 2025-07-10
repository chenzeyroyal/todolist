import { handleSelects, setButtonToActive } from "../../utils/dom.js";
export class TaskEventHandler {
  constructor(task, selectors, taskView, sectionView, controller) {
    this.taskView = taskView;
    this.sectionView = sectionView;
    this.task = task;
    this.selectors = selectors;
    this.controller = controller;

    this.classes = {
      completed: "--completed",
    };
  }

  init() {
    this.onCompleteTask();
    this.onEdit();
    this.onDelete();
  }

  onCompleteTask() {
    this.selectors.radio.addEventListener("change", () => {
      if (this.selectors.radio.checked) {
        this.taskView.classList.add(this.classes.completed);
        this.task.isActive = false;

        setTimeout(() => {
          this.sectionView.clearTaskInputView();
          this.controller.sortTasks(this.sectionView.section.id, "status");
        }, 1000);

        this.controller.saveToLocalStorage();
      } else {
        this.taskView.classList.remove(this.classes.completed);
        this.task.isActive = true;
        this.controller.showTaskEditingInput(
          this.sectionView.section.id,
          this.task.id
        );
      }
    });
  }

  onEdit() {
    this.selectors.editButton.addEventListener("click", (e) => {
      if (e.target.closest("label")) return;
      this.controller.showTaskEditingInput(
        this.sectionView.section.id,
        this.task.id
      );
      setButtonToActive(this.sectionView.taskInputView?.submitButton);
      this.controller.saveToLocalStorage();
    });

    handleSelects(this.selectors.selectButton, this.selectors.select);
  }

  onDelete() {
    if (this.selectors.deleteButton) {
      this.selectors.deleteButton.addEventListener("click", () => {
        this.sectionView.clearTaskInputView();
        this.controller.removeTask(this.task.id, this.sectionView.section.id);
        this.controller.saveToLocalStorage();
      });
    }
  }
}
