class Task {
  constructor(title, description, priority) {
    this._title = title;
    this._description = description;
    this._priority = priority;
    this._done = false;
    // this.dueDate = dueDate;
  }

  toggleDoneStatus() {
    this._done = !this._done;
  }

  get title() {
    return this._title;
  }

  set title(input) {
    this._title = input;
  }

  get description() {
    return this._description;
  }

  set description(input) {
    this._description = input;
  }

  get priority() {
    return this._priority;
  }

  set priority(input) {
    this._priority = input;
  }

  get done() {
    return this._done;
  }

}

export { Task };