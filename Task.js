export default class Task {
  constructor(text, priority = 1) {
    this.id = `task-${Date.now()}`;
    this.text = text;
    this.priority = priority;
  }
}
