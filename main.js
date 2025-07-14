import TodoController from "./scripts/controllers/TodoController.js";
import EventBinder from "./scripts/events/TodoEventHandler.js";

const todo = new TodoController();
const binder = new EventBinder(todo);
binder.bindEvents();
