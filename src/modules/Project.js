class Project {
  constructor(title) {
    this.title = title;
    this.tasks = [];
    this.default = false;
  }

  get getName() {
    return this.title;
  }

  set setName(input) {
    return this.title = input;
  }

  get getTasks() {
    return this.tasks;
  }

  setDefault(boolean) {
    this.default = boolean;
    return this;
  }

  addTask (newTask) {
    this.tasks.push(newTask);
  }

  getTaskIndex(task) {
    return this.tasks.indexOf(task)
  }

  removeTask (task) {
    return this.tasks.splice(this.getTaskIndex(task), 1);
  }
}

export { Project };