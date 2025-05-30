import Section from "./Section.js";

class Todo {
  constructor() {
    this.sections = [];

    this.selectors = this.getSelectors();

    document.addEventListener("click", (e) => {
      if (e.target !== this.selectors.addSectionButton) return;
      this.addSection();
    });
  }

  getSelectors() {
    const q = (selector) => document.querySelector(selector);
    return {
      container: q("[data-js-todoSections]"),
      addSectionContainer: q("[data-js-addSectionContainer]"),
      sectionTemplate: q("[data-js-section]"),
      addSectionButton: q("[data-js-addSectionButton]"),
      radioTemplate: q("[data-js-customTaskRadio]"),
    };
  }

  addSection(title) {
    const section = new Section(title);
    this.sections.push(section);
    const sectionEl = this.renderSection(section);
    this.selectors.container.insertBefore(
      sectionEl,
      this.selectors.addSectionContainer
    );

    this.handleSection(sectionEl, section);
    this.handleTasks(sectionEl, section);
    this.bindTaskInputHandlers(sectionEl, section);
  }

  renderSection(section) {
    const sectionEl = document.createElement("div");
    sectionEl.classList.add("todo__sections-column");
    sectionEl.dataset.id = section.id;
    const template = this.selectors.sectionTemplate.content.cloneNode(true);
    sectionEl.append(template);
    return sectionEl;
  }

  handleSection(sectionEl, sectionObj) {
    const ui = {
      input: sectionEl.querySelector("[data-js-sectionTitleInput]"),
      title: sectionEl.querySelector("[data-js-sectionTitleContainer]"),
      saveButton: sectionEl.querySelector("[data-js-saveTitleButton]"),
      cancelButton: sectionEl.querySelector("[data-js-cancelTitleButton]"),
      buttonContainer: sectionEl.querySelector(
        "[data-js-sectionTitleButtonContainer]"
      ),
      showInputButton: sectionEl.querySelector("[data-js-showTaskInputButton]"),
      taskInputField: sectionEl.querySelector("[data-js-taskInputField]"),
      closeInputFieldButton: sectionEl.querySelector("[data-js-cancelButton]"),
    };

    this.editSectionTitle(sectionObj, sectionEl, ui);
    this.closeTaskInputField(ui);
    this.handleEnterBlur(ui.title);
    ui.input.focus();
  }

  editSectionTitle(section, sectionEl, ui) {
    const inputContainer = sectionEl.querySelector(
      ".todo__sections-column-title-text"
    );
    inputContainer.addEventListener("click", () => {
      ui.title.classList.add("--hidden");
      ui.input.classList.remove("--hidden");
      ui.input.focus();
      ui.input.setSelectionRange(ui.input.value.length, ui.input.value.length);
      ui.buttonContainer.classList.remove("--hidden");
    });

    let currentTitle = section.title;

    ui.saveButton.addEventListener("click", () =>
      this.saveTitle(section, currentTitle, ui)
    );

    ui.input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      this.saveTitle(section, currentTitle, ui);
    });

    ui.cancelButton.addEventListener("click", () =>
      this.cancelTitle(section, currentTitle, ui)
    );
    ui.input.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      this.cancelTitle(section, currentTitle, ui);
      ui.input.blur();
    });

    ui.buttonContainer.classList.remove("--hidden");
  }

  saveTitle(section, currentTitle, ui) {
    if (ui.input.value.trim() === "") return;
    section.title = ui.input.value;
    currentTitle = ui.input.value;
    ui.title.textContent = section.title;

    ui.title.classList.remove("--hidden");
    ui.input.classList.add("--hidden");
    ui.buttonContainer.classList.add("--hidden");

    ui.showInputButton.classList.remove("--hidden");
  }

  cancelTitle(section, currentTitle, ui) {
    if (section.title === "") {
      document.querySelector(`[data-id="${section.id}"]`).remove();

      this.sections = this.sections.filter((item) => item.id !== section.id);
    }

    currentTitle = section.title;
    ui.input.value = currentTitle;
    ui.title.textContent = currentTitle;

    if (ui.title.textContent === "") {
      ui.buttonContainer.classList.add("--hidden");
    } else {
      ui.title.classList.remove("--hidden");
      ui.input.classList.add("--hidden");
      ui.buttonContainer.classList.add("--hidden");
    }
  }

  bindTaskInputHandlers(sectionEl, sectionObj) {
    sectionEl.addEventListener("click", (e) => {
      if (!e.target.closest("[data-js-showTaskInputButton]")) return;

      const taskInputField = sectionEl.querySelector(
        "[data-js-taskInputField]"
      );
      taskInputField.classList.remove("--hidden");

      const taskInput = sectionEl.querySelector("[data-js-taskInput]");
      taskInput.focus();
    });

    sectionEl.addEventListener("click", (e) => {
      if (!e.target.closest("[data-js-saveButton]")) return;

      const taskInputField = sectionEl.querySelector(
        "[data-js-taskInputField]"
      );
      taskInputField.classList.remove("--hidden");

      this.handleTasks(sectionEl, sectionObj);
    });

    sectionEl.addEventListener("click", (e) => {
      if (!e.target.closest("[data-js-cancelButton]")) return;
      const taskInputField = sectionEl.querySelector("[data-js-taskInputField");
      taskInputField.classList.add("--hidden");
    });

    sectionEl.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      this.handleTasks(sectionEl, sectionObj);
    });
  }

  closeTaskInputField(ui) {
    ui.closeInputFieldButton.addEventListener("click", () => {
      ui.taskInputField.classList.add("--hidden");
    });
  }

  handleTasks(sectionEl, sectionObj) {
    const taskInput = sectionEl.querySelector("[data-js-taskInput]");
    const taskText = taskInput.value.trim();

    if (taskText == "") return;

    const task = sectionObj.addTask(taskText);
    const list = sectionEl.querySelector("[data-js-todoList]");

    taskInput.value = "";
    taskInput.focus();
    this.renderTask(task, list);
    this.handleEnterBlur(taskInput);
  }

  renderTask(task, list) {
    const li = document.createElement("li");
    li.classList.add("todo__list-item");

    setTimeout(() => li.classList.add("--show"), 50);
    li.textContent = task.text;
    list.append(li);

    const radio = this.selectors.radioTemplate.content.cloneNode(true);
    const radioInput = radio.querySelector("[data-js-todoRadio]");
    radioInput.addEventListener("click", () =>
      this.completeTask(task, list, li)
    );
    li.append(radio);
  }

  handleEnterBlur(input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
  }

  completeTask(task, list, li) {
    li.classList.add("--completed");
    task.isActive = false;
    console.log(task);
  }
}

const todo = new Todo();
