import { $ } from "./tool.js";
import Todo from "./todo.js";

const TodoApp = (() => {
  const Private = Symbol();
  let size = 0;

  return class {
    constructor(parent) {
      if (typeof parent != "string" || !parent) throw "invalid param";
      this[Private] = { parent };
    }

    init(todos) {
      Object.assign(this[Private], { todos });
      const app = $(this[Private].parent);
      if (!app) throw "invalid parent";
      this._newTodoListen();
      this._render();
    }

    _save() {
      const { todos } = this[Private];
      localStorage.data = JSON.stringify({ todos });
      this._render();
    }

    _render() {
      const { todos } = this[Private];
      if (!todos.length) return;
      else {
        this._mainDisplay();
        const todo_list = this._create_todo_list();
        $("#todo-list").innerHTML = todo_list;
        $("#todo-count").innerHTML = this._todoCount();
      }
    }

    _create_todo_list() {
      // TODO: 필터링을 쿼리스트링으로 구분하되, render시 filter를 통해 구현할 수 있도록 해야 할 것

      return this[Private].todos
        .map(({ content, id }) => this._templatify(content, id))
        .join("");
    }

    _newTodoListen() {
      const new_todo = $("#new-todo");
      new_todo.addEventListener("keypress", ({ key, target: { value } }) => {
        if (key != "Enter" || value == "") return;
        else {
          this[Private].todos.push(new Todo(value, size++));
          this._save();
          new_todo.value = "";
          this._render();
        }
      });
    }

    _templatify(content, id) {
      return `<li data-key="${id}">
          <input class="toggle" type="checkbox" />
          <label>${content}</label>
          <button class="destroy">
        </button></li>`;
    }

    _mainDisplay() {
      const main = $("#main");
      if (main.style.display == "none") main.style.display = "block";
    }

    _todoCount() {
      const count = this[Private].todos.filter(v => v.status).length;
      return count == 0 || count == 1
        ? `${count} item left`
        : `${count} items left`;
    }
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  const todoapp = new TodoApp("#app");
  const { data } = localStorage;
  const { todos } =
    typeof data == "string" && Array.isArray(JSON.parse(data).todos)
      ? JSON.parse(data)
      : { todos: [] };
  todoapp.init(todos);
});