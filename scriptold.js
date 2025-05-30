// SIDEBAR
const sidebar = document.querySelector("[data-js-sidebar]");
const sidebarButton = document.querySelector("[data-js-sidebarCloseButton]");
const main = document.querySelector("[data-js-main]");

sidebarButton.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar--hidden");
  sidebarButton.classList.toggle("sidebar--hidden");
  main.classList.toggle("sidebar--hidden");
});

// TODOLIST

const sections = [
  {
    id: `section-${Date.now()}`,

    tasks: [],
  },
];

function createSection(section) {
  const sectionEl = document.createElement("div");
  sectionEl.classList.add("todo__sections-column");
  sectionEl.dataset.sectionId = section.id;

  sectionEl.innerHTML = `

  <div class="todo__sections-column-title">

          <input
            type="text"
            placeholder="Название раздела"
            maxlength="24"
            data-js-sectionTitleInput

          />

          <h4 data-js-sectionTitleContainer></h4>
          <button class="todo__sections-column-title-edit-button button" data-js-sectionTitleEditButton>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
        >
          <path
            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
          />
          <path d="m15 5 4 4" />
        </svg>
      </button>
        </div>

        <ul class="todo__list" data-js-todoList>
          ${section.tasks
            .map((task) => `<li class="todo__list-item">${task.text}</li>`)
            .join("")}
        </ul>
        <div class="todo__list-input-field" data-js-taskInputField>
          <div class="wrapper">
            <button class="todo-list-input-field-close-button button" data-js-inputFieldCloseButton>&times</button>

            <input
              type="text"
              name=""
              id=""
              data-js-taskInput
              placeholder="Название задачи"
            />
            <ul class="todo__list-priority-list">
              <li class="todo__list-priority-list-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" 
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-flag-icon lucide-flag"
                >
                  <path
                    d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
                  />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
              </li>
              <li class="todo__list-priority-list-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-flag-icon lucide-flag"
                >
                  <path
                    d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
                  />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
              </li>
              <li class="todo__list-priority-list-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-flag-icon lucide-flag"
                >
                  <path
                    d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
                  />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
              </li>
            </ul>
          </div>
        </div>
          <button class="todo__list-add-button button" data-js-addTaskButton>
            <div class="icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </div>
            Добавить задачу
          </button>  
`;

  const addTaskButton = sectionEl.querySelector("[data-js-addTaskButton]");
  const inputField = sectionEl.querySelector("[data-js-taskInputField]");
  const taskInput = sectionEl.querySelector("[data-js-taskInput]");

  const inputFieldCloseButton = sectionEl.querySelector(
    "[data-js-inputFieldCloseButton]"
  );
  function addTaskControl() {
    taskInput.focus();
    inputField.classList.add("--show");

    if (taskInput.value.trim() === "") return;

    addTask(section.id, taskInput.value);
    taskInput.value = "";
  }
  addTaskButton.addEventListener("click", addTaskControl);

  handleEnterBlur(taskInput);

  inputFieldCloseButton.addEventListener("click", () => {
    inputField.classList.remove("--show");
    taskInput.blur();
    taskInput.value = "";
  });

  const sectionTitleInput = sectionEl.querySelector(
    "[data-js-sectionTitleInput]"
  );
  const sectionTitleContainer = sectionEl.querySelector(
    "[data-js-sectionTitleContainer]"
  );
  const sectionTitleEditButton = sectionEl.querySelector(
    "[data-js-sectionTitleEditButton]"
  );

  sectionTitleInput.addEventListener("blur", () => {
    if (sectionTitleInput.value.trim() === "") return;

    sectionTitleContainer.textContent = sectionTitleInput.value;
    sectionTitleInput.classList.add("hide");
    sectionTitleContainer.classList.remove("hide");
    inputField.classList.add("--show");
    taskInput.focus();
  });

  sectionTitleEditButton.addEventListener("click", () => {
    sectionTitleContainer.classList.add("hide");
    sectionTitleInput.classList.remove("hide");
    sectionTitleEditButton.classList.toggle("hide");

    sectionTitleInput.focus();
  });

  handleEnterBlur(sectionTitleInput);

  return sectionEl;
}
const addSectionButton = document.querySelector("[data-js-addSectionButton]");
const container = document.querySelector("[data-js-todoSections]");
const addSectionContainer = document.querySelector(
  "[data-js-addSectionContainer]"
);

addSectionButton.addEventListener("click", () => {
  const newSection = {
    id: `section-${Date.now()}`,
    tasks: [],
  };

  sections.push(newSection);

  const sectionEl = createSection(newSection);
  container.insertBefore(sectionEl, addSectionContainer);

  const sectionTitleInput = sectionEl.querySelector(
    "[data-js-sectionTitleInput]"
  );
  sectionTitleInput.focus();
});

function renderSections() {
  sections.forEach((section) => {
    const el = createSection(section);
    container.insertBefore(el, addSectionContainer);
  });
}

function addTask(sectionId, taskText, priority = 1, isActive = true) {
  const section = sections.find((sec) => sec.id === sectionId);

  const newTask = {
    id: `task-${Date.now()}`,
    text: taskText,
    priority,
    isActive,
  };
  section.tasks.push(newTask);

  const ul = document.querySelector(
    `[data-section-id="${sectionId}"] [data-js-todoList]`
  );
  const li = document.createElement("li");

  const taskRadio = document
    .querySelector("[data-js-customTaskRadio]")
    .content.cloneNode(true);

  const taskRadioInput = taskRadio.querySelector("[data-js-todoRadio]");
  taskRadioInput.id = newTask.id;

  taskRadioInput.addEventListener("click", (e) => {
    if (e.currentTarget.id !== newTask.id) return;
    newTask.isActive = false;
    li.classList.add("--completed");
  });

  li.classList.add("todo__list-item");
  setTimeout(() => li.classList.add("--show"), 50);
  li.textContent = taskText;
  li.dataset.taskId = newTask.id;
  li.append(taskRadio);
  ul.appendChild(li);
}

function handleEnterBlur(input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
}

const sortTasksButton = document.querySelector("[data-js-sortTasksButton]");

function sortTasks() {
  sections.forEach((section) => {
    section.tasks.sort((a, b) => {
      if (a.isActive !== b.isActive) return b.isActive - a.isActive;
      return b.priority - a.priority;
    });

    const ul = document.querySelector(
      `[data-section-id="${section.id}"] [data-js-todoList]`
    );
    if (!ul) return;

    ul.innerHTML = "";

    section.tasks.forEach((task) => {
      const taskRadio = document
        .querySelector("[data-js-customTaskRadio]")
        .content.cloneNode(true);

      const taskRadioInput = taskRadio.querySelector("[data-js-todoRadio]");
      taskRadioInput.id = task.id;
      const li = document.createElement("li");

      taskRadioInput.addEventListener("click", (e) => {
        if (e.currentTarget.id !== newTask.id) return;
        task.isActive = false;
        li.classList.add("--completed");
      });
      li.classList.add("todo__list-item");
      setTimeout(() => li.classList.add("--show"), 50);
      li.textContent = task.text;
      li.dataset.taskId = task.id;
      li.append(taskRadio);
      ul.appendChild(li);
    });
  });
}
sortTasksButton.addEventListener("click", sortTasks);
