const todo = {
  container: document.querySelector("[data-js-container]"),

  input: document.querySelector("[data-js-nameInput]"),

  list: document.querySelector("[data-js-taskList]"),
  listRadio: document.querySelector("[data-js-customRadio]"),

  addButton: document.querySelector("[data-js-addButton]"),
  sortButton: document.querySelector("[data-js-sortButton]"),
  select: document.querySelector("[data-js-priorityFilter]"),

  priorityList: document.querySelector("[data-js-priorityList]"),
  priorityRadio: document.querySelectorAll("[data-js-priorityRadio]"),

  dateContainer: document.querySelector("[data-js-todayDate]"),

  sortStatus: {
    states: ["disabled", "priorityUp", "priorityDown"],
    state: "disabled",
    methods: {
      disabled: (a, b) => a.id - b.id,
      priorityUp: (a, b) => a.priority - b.priority,
      priorityDown: (a, b) => b.priority - a.priority,
    },
  },
};

const today = new Date();
const options = {
  day: "numeric",
  month: "long",
  weekday: "short",
};
const formattedDate = today.toLocaleDateString("ru-RU", options);

todo.dateContainer.append(formattedDate);

let tasks = [];

let priority = 3;
todo.priorityRadio[0].checked = true;

todo.priorityRadio.forEach((radio) => {
  radio.addEventListener("click", () => {
    priority = radio.value;
    todo.input.focus();
  });
});
function createTaskElement(task) {
  const listItem = document.createElement("li");
  listItem.classList.add("todo__list-item");

  const modifierClass = task.isActive
    ? "todo__list-item--active"
    : "todo__list-item--inactive";

  listItem.classList.add(modifierClass);

  listItem.textContent = task.text;

  if (task.isActive) {
    const radioButton =
      todo.listRadio.content.firstElementChild.cloneNode(true);
    radioButton.id = task.id;
    radioButton.classList.add(`priority-${task.priority}`);

    listItem.append(radioButton);
  } else {
    const backButton = document.createElement("button");
    backButton.classList.add("todo__list-back-button");
    backButton.id = task.id;
    listItem.append(backButton);
  }
  return listItem;
}

function getFilteredTasks() {
  const filter = todo.select.value;
  return tasks.filter((task) =>
    filter === "active"
      ? task.isActive
      : filter === "inactive"
      ? !task.isActive
      : true
  );
}

function renderList() {
  todo.list.innerHTML = "";
  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    taskElement.classList.add("hide");
    todo.list.append(taskElement);
    requestAnimationFrame(() => {
      taskElement.classList.remove("hide");
    });
  });
}

todo.list.addEventListener("click", (e) => {
  const label = e.target.closest("label");
  if (label) {
    if (label.matches(".todo__list-item-radio")) {
      const id = +e.target.closest("label").id;
      const toComplete = tasks.find((item) => item.id === id);
      toComplete.isActive = false;
      const listItem = e.target.closest(".todo__list-item");
      listItem.classList.add("hide", "delayed");
      listItem.addEventListener(
        "transitionend",
        () => {
          renderList();
        },
        { once: true }
      );
    }
  } else if (e.target.matches(".todo__list-back-button")) {
    const id = +e.target.closest("button").id;
    const toUncomplete = tasks.find((item) => item.id === id);
    toUncomplete.isActive = true;
    listItem = e.target.closest(".todo__list-item");
    listItem.classList.add("hide", "delayed");
    listItem.addEventListener(
      "transitionend",
      () => {
        renderList();
      },
      { once: true }
    );
  } else return;
});

todo.addButton.addEventListener("click", () => {
  const inputText = todo.input.value;
  if (inputText.trim() === "") return;

  const task = {
    id: Date.now(),
    text: inputText,
    isActive: true,
    priority: +priority,
  };

  tasks.push(task);
  todo.input.value = "";
  todo.input.focus();

  const state = todo.sortStatus.state;
  const method = todo.sortStatus.methods[state];

  tasks.sort(method);
  tasks.reverse();

  renderList();
});

function sortTasks() {
  const currentIndex = todo.sortStatus.states.indexOf(todo.sortStatus.state);
  const nextIndex = (currentIndex + 1) % todo.sortStatus.states.length;
  const state = (todo.sortStatus.state = todo.sortStatus.states[nextIndex]);

  const method = todo.sortStatus.methods[state];

  tasks.sort(method);
  renderList();
}
todo.sortButton.addEventListener("click", sortTasks);
todo.select.addEventListener("change", renderList);

// THEME

const themeColors = document.querySelectorAll("[data-js-themeStyle]");
const themeStylesList = document.querySelector("[data-js-themeStylesList]");

themeColors.forEach((item) => {
  item.addEventListener("click", (e) => {
    const bgColor = getComputedStyle(e.currentTarget).backgroundColor;
    console.log(e.currentTarget);
    document.documentElement.style.setProperty("--color-accent", bgColor);
  });
});
const defaultStyle = document.querySelector("[data-js-defaultStyle]");
defaultStyle.checked = true;
console.log(defaultStyle);
