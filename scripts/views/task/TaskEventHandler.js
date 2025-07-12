export class TaskEventHandler {
  constructor(handlers) {
    this.handlers = handlers;
  }

  bindCompleteRadio(radio) {
    radio.addEventListener("change", () => this.handlers.complete());
  }

  // bindShowTaskSelectButton(button) {
  //   button.addEventListener("click", () => {
  //     this.handlers.showTaskSelect();
  //   });
  // }

  bindEditButton(button) {
    button.addEventListener("click", (e) => {
      if (e.target.closest("label")) return;

      this.handlers.edit();
    });
  }

  bindDeleteButton(button) {
    button.addEventListener("click", () => this.handlers.delete());
  }
}
