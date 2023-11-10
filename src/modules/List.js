import { Project } from "./Project";

class List {
  constructor() {
    this._projects = [new Project('Study'), new Project('Work')];
  }

  get projects() {
    return [...this._projects];
  }

  addProject (newProject) {
    this._projects.push(newProject);
  }

  getProjectIndex(project) {
    return this._projects.indexOf(project)
  }

  removeProject (project) {
    this._projects.splice(this.getProjectIndex(project), 1);
  }

}

export { List }