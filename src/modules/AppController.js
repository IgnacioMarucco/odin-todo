import { Project } from "./Project";
import { Task } from "./Task";

const AppController = (() => {
  const projectList = [];
  let currentProject = null;

  const createProject = () => {
    const projectTitle = document.querySelector('#project_title').value;
    return projectList.push(new Project(projectTitle));
  }

  const createTask = () => {
    const taskTitle = document.querySelector('#task_title').value;
    const taskDescription = document.querySelector('#task_description').value;
    console.log(taskTitle, taskDescription)
    currentProject.addTask(new Task(taskTitle, taskDescription))
  }

  const changeCurrentProject = (project) => {
    currentProject = project;
  }

  const getProjectsList = () => projectList;

  const getCurrentProject = () => currentProject;

  return { createProject, createTask, getProjectsList, changeCurrentProject, getCurrentProject}
})();

export { AppController }