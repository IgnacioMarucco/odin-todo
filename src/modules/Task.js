class Task {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    // this.priority = priority;
    // this.dueDate = dueDate;
  }

  get getTitle() {
    return this.title;
  }

  set setTitle(input) {
    return this.title = input;
  }

}

export { Task };