import { ScreenController } from "./ScreenController";
import { Project } from "./Project";
import { Task } from "./Task";

const AppController = (() => {
  const projectList = [new Project('Study'), new Project('Work')];
  let currentProject = null;

  function createProject() {
    const projectTitle = document.querySelector('#project_title').value;
    projectList.push(new Project(projectTitle));
    ScreenController.changeSidePanelContent();
    console.log(projectList)
    // return projectList.push(new Project(projectTitle));
  }

  function createTask() {
    const taskTitle = document.querySelector('#task_title').value;
    const taskDescription = document.querySelector('#task_description').value;
    const taskPriority = document.querySelector('input[name="priority"]:checked').value;
    console.log(taskTitle, taskDescription,taskPriority)
    currentProject.addTask(new Task(taskTitle, taskDescription, taskPriority))
    ScreenController.changeCurrentViewContent(currentProject);
  }

  function editTask(project, task) {
    const taskTitle = document.querySelector('#edit_task_title').value;
    const taskDescription = document.querySelector('#edit_task_description').value;
    const taskPriority = document.querySelector('input[name="priority"]:checked').value;
    console.log({taskTitle, taskDescription, taskPriority})
    console.log(projectList.find(element => element == project).getTasks.find(element => element == task))

    const taskToModify = projectList.find(element => element == project).getTasks.find(element => element == task);
    taskToModify.title = taskTitle;
    taskToModify.description = taskDescription;
    taskToModify.priority = taskPriority;


    ScreenController.changeCurrentViewContent(currentProject);
  }

  function deleteTask(project, task) {
    project.removeTask(task);
  }

  function changeCurrentProject(project) {
    currentProject = project;
    // ScreenController.changeCurrentViewContent(currentProject);
  }

  const getProjectsList = () => projectList;

  const getCurrentProject = () => currentProject;

  projectList[0].addTask(new Task('Learn React', 'Watch coderhouse Videos', 'medium-priority'))
  projectList[0].addTask(new Task('Learn Angular', 'Udemy', 'low-priority'))

  projectList[1].addTask(new Task('Clean Kitchen', 'Use cif', 'high-priority'))
  projectList[1].addTask(new Task('Go to donwtown', 'Pick up stuff', 'low-priority'))

  // projectList[0].deleteTask()

  return { createProject, createTask, editTask, deleteTask, getProjectsList, changeCurrentProject, getCurrentProject}
})();

export { AppController }