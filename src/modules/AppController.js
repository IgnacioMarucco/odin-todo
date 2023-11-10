import { ScreenController } from "./ScreenController";
import { List } from "./List";
import { Project } from "./Project";
import { Task } from "./Task";

const AppController = (() => {
  const list = new List();
  let currentProject = null;

  function createProject(projectTitle) {
    const newProject = new Project(projectTitle);
    list.addProject(newProject);
    changeCurrentProject(newProject);
  }

  function editProject(project, projectTitle) {
    const projectToModify = list.projects.find(element => element == project);
    projectToModify.title = projectTitle;
  }

  function deleteProject(project) {
    list.removeProject(project);
  }

  function createTask(taskTitle, taskDescription, taskPriority) {
    currentProject.addTask(new Task(taskTitle, taskDescription, taskPriority))
  }

  function editTask(project, task, taskTitle, taskDescription, taskPriority) {
    const taskToModify = list.projects.find(element => element == project).tasks.find(element => element == task);

    taskToModify.title = taskTitle;
    taskToModify.description = taskDescription;
    taskToModify.priority = taskPriority;
  }

  function toggleDone(project, task) {
    const taskToModify = list.projects.find(element => element == project).tasks.find(element => element == task);
    taskToModify.toggleDoneStatus();
  }

  function deleteTask(project, task) {
    project.removeTask(task);
  }

  function changeCurrentProject(project) {
    currentProject = project;

    // ScreenController.renderProject(currentProject);
  }

  const getProjectsList = () => list.projects;

  const getCurrentProject = () => currentProject;

  list.projects[0].addTask(new Task('Learn React', 'Watch coderhouse Videos', 'medium-priority'))
  list.projects[0].addTask(new Task('Learn Angular', 'Udemy', 'low-priority'))

  list.projects[1].addTask(new Task('Lamao', 'ROFL', 'high-priority'))
  list.projects[1].addTask(new Task('Go to donwtown', 'Pick up stuff', 'low-priority'))

  return { createProject, editProject, deleteProject, createTask, editTask, deleteTask, toggleDone, getProjectsList, changeCurrentProject, getCurrentProject}
})();

export { AppController }