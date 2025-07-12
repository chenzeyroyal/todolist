export default class SectionEventHandler {
  constructor(handlers) {
    this.handlers = handlers;
    this.classes = {
      topReached: "--top-reached",
      bottomReached: "--bottom-reached",
    };
  }

  bindSubmitButton(button) {
    button.addEventListener("click", () => this.handlers.submit());
  }

  bindSubmitKey(key) {
    document.addEventListener("keydown", (e) => {
      if (e.key !== key) return;
      this.handlers.submit();
    });
  }
  bindCancelButton(button) {
    button.addEventListener("click", () => this.handlers.cancel());
  }

  bindСancelKey(key) {
    document.addEventListener("keydown", (e) => {
      if (e.key !== key) return;
      this.handlers.cancel();
    });
  }

  bindEditTitle(title) {
    title.addEventListener("click", () => this.handlers.edit());
  }

  bindDeleteButton(button) {
    button.addEventListener("click", () => this.handlers.delete());
  }

  bindShowTaskInputButton(button) {
    button.addEventListener("click", () => this.handlers.showTaskInput());
  }

  bindScrollList(list) {
    list.addEventListener("scroll", () => this.handlers.scroll());
  }

  bindSortSelect(button) {
    button.addEventListener("click", (e) => {
      if (e.target.tagName !== "INPUT") return;
      this.handlers.sort(e.target);
    });
  }
}
