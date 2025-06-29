export default class Task {
  constructor(text, priority) {
    this.id = `task-${Date.now()}`;
    this.text = text;
    this.priority = priority;
    this.createdAt = new Date();
    this.isActive = true;
  }
}
