import { Project } from "./Project";

class List {
  constructor() {
    this.projects = [new Project('Study'), new Project('Work')];
  }

  get getProjects() {
    return this.projects;
  }

  addProject (newProject) {
    this.projects.push(newProject);
  }

  getProjectIndex(project) {
    return this.projects.indexOf(project)
  }

  removeProject (project) {
    return this.projects.splice(this.getProjectIndex(project), 1);
  }

}

export { List }