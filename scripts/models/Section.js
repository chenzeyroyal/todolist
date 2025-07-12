import Task from "./Task.js";
export default class Section {
  constructor(title = "") {
    this.id = `section-${Date.now()}`;
    this.title = title;
    this.tasks = [];
  }

  addTask(text, priority) {
    const task = new Task(text, priority);
    this.tasks.push(task);

    return task;
  }

  getSortedTasks(criterion = "status") {
    return [...this.tasks].sort((a, b) => {
      switch (criterion) {
        case "priority":
          return a.priority - b.priority;
        case "name":
          return a.text.localeCompare(b.text);
        case "date":
          return a.createdAt - b.createdAt;
        case "status":
          return b.isActive - a.isActive;
        default:
          return 0;
      }
    });
  }
}
