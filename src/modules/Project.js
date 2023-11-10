class Project {
  constructor(title) {
    this._title = title;
    this._tasks = [];
  }

  get title() {
    return this._title;
  }

  set title(input) {
    this._title = input;
  }

  get tasks() {
    return [...this._tasks];
  }

  addTask (newTask) {
    this._tasks.push(newTask);
  }

  getTaskIndex(task) {
    return this._tasks.indexOf(task)
  }

  removeTask (task) {
    this._tasks.splice(this.getTaskIndex(task), 1);
  }
}

export { Project };