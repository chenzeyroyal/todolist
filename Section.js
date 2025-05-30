import Task from "./Task.js";
export default class Section {
  constructor(title = "") {
    this.id = `section-${Date.now()}`;
    this.title = title;
    this.tasks = [];
  }

  addTask(text, priority = 1) {
    const task = new Task(text, priority);
    this.tasks.push(task);
    return task;
  }
}
