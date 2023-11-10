import '../css/header.css';
import '../css/main.css';
import '../css/footer.css';

import { AppController } from './AppController';
import { DOMElement } from "./DOMElement";

const ScreenController = (() => {
  const header = new DOMElement('header').annexTextContent('TODO List').build();
  const footer = new DOMElement('footer').annexTextContent('Created by Ignacio Marucco').build();
  const main = new DOMElement('main').build();
  const sidePanel = new DOMElement('nav').annexAttributes({id: 'side-panel'}).build();
  const currentView = new DOMElement('div').annexAttributes({id: 'current-view'}).build();

  function renderSidePanel() {
    sidePanel.innerHTML = '';
    const projectsListArray = AppController.getProjectsList();
    const projectsListElement = new DOMElement('ul').annexAttributes({id: 'projects-list'});

    projectsListArray.forEach(project => 
      projectsListElement
        .annexChild(new DOMElement('li')
          .annexChild(new DOMElement('button')
            .annexTextContent(`${project.title}`)
            .annexEventListener('click', () => {
              AppController.changeCurrentProject(project);
              }
            )
          )
        )
    )

    // Home Project Button
    const homeProjectBtn = new DOMElement('button').annexTextContent('Home').annexEventListener('click', () => {
      renderAllProjects();
    });

    // New Project Button
    const newProjectBtn = new DOMElement('button').annexTextContent('New Project').annexEventListener('click', () => {
      renderForm('newProject');
    });

    sidePanel.appendChild(homeProjectBtn.build());
    sidePanel.appendChild(projectsListElement.build());
    sidePanel.appendChild(newProjectBtn.build());
  }

  function renderForm(formType, projectToModify, taskToModify) {
    currentView.innerHTML = '';

    switch (formType) {
      case 'newProject':
        currentView.appendChild(newProjectForm().build());
        break;
      case 'newTask':
        currentView.appendChild(newTaskForm().build());
        break;
      case 'editProject':
        currentView.appendChild(editProjectForm(projectToModify).build());
        break;
      case 'editTask':
        currentView.appendChild(editTaskForm(projectToModify, taskToModify).build());
        break;
    }
  }

  function renderAllProjects() {
    currentView.innerHTML = '';

    currentView.appendChild(new DOMElement('h4').annexTextContent('All Projects:').build());

    const projectsArray = AppController.getProjectsList();
    projectsArray.forEach(project => renderProject(project, true));
  }

  function renderProject(currentProject, isHome) {
    if (!isHome) {
    currentView.innerHTML = '';
    }

    const currentProjectIndex = AppController.getProjectsList().indexOf(currentProject);
    const projectTasksArray = currentProject.tasks;

    const projectDetails = new DOMElement('div').annexAttributes({id: 'project-details'}).annexAttributes({["data-projectIndex"]: `${currentProjectIndex}`})
    const projectTitle = new DOMElement('h4').annexTextContent(`${currentProject.title}`);
    const projectTasksElement = new DOMElement('ul');

    const editProjectBtn = new DOMElement('button')
      .annexTextContent('Edit Project')
      .annexAttributes({["data-projectIndex"]: `${currentProjectIndex}`})
      .annexEventListener('click', (e) => editProject(e));

    const deleteProjectBtn = new DOMElement('button')
      .annexTextContent('Delete Project')
      .annexAttributes({["data-projectIndex"]: `${currentProjectIndex}`})
      .annexEventListener('click', (e) => deleteProject(e));
    projectTasksArray.forEach(task => console.log(task))
    projectTasksArray.forEach(task =>
      projectTasksElement
        .annexChild(new DOMElement('li')
          .annexAttributes({class: `task ${task.priority}`, ["data-projectIndex"]: `${currentProjectIndex}`, ["data-taskIndex"]: `${currentProject.getTaskIndex(task)}`})
          .annexChild(new DOMElement('h5')
            .annexTextContent(`${task.title}`)
          )
          .annexChild(new DOMElement('input')
            .annexAttributes({type: 'checkbox',["data-projectIndex"]: `${currentProjectIndex}`, ["data-taskIndex"]: `${currentProject.getTaskIndex(task)}`, checked: task.done === true ? "checked" : null,})
            .annexEventListener('change', (e) => toggleDone(e))
          )
          .annexChild(new DOMElement('p')
            .annexAttributes({class: 'task-description', style: 'display: none'})
            .annexTextContent(`${task.description}`)
          )
          .annexChild(new DOMElement('button')
            .annexTextContent('Description')
            .annexAttributes({["data-projectIndex"]: `${currentProjectIndex}`, ["data-taskIndex"]: `${currentProject.getTaskIndex(task)}`})
            .annexEventListener('click', (e) => toggleDescription(e))
          )
          .annexChild(new DOMElement('button')
            .annexTextContent('Edit Task')
            .annexAttributes({["data-projectIndex"]: `${currentProjectIndex}`, ["data-taskIndex"]: `${currentProject.getTaskIndex(task)}`})
            .annexEventListener('click', (e) => editTask(e))
          )
          .annexChild(new DOMElement('button')
            .annexAttributes({["data-projectIndex"]: `${currentProjectIndex}`, ["data-taskIndex"]: `${currentProject.getTaskIndex(task)}`})
            .annexTextContent('Delete Task')
            .annexEventListener('click', (e) => deleteTask(e))
          )
        )
    )

    const projectNewTaskBtn = new DOMElement('button')
      .annexTextContent('New Task')
      .annexEventListener('click', () => {
        renderForm('newTask');
      })

    if (isHome === true) {
      projectDetails.annexChild(projectTasksElement)
      currentView.appendChild(projectDetails.build());
      return
    }
    projectDetails.annexChild(projectTitle).annexChild(editProjectBtn).annexChild(deleteProjectBtn).annexChild(projectTasksElement).annexChild(projectNewTaskBtn)
    currentView.appendChild(projectDetails.build());
  }

  function editProject(e) {
    const projectToModify = AppController.getProjectsList()[e.target.attributes["data-projectIndex"].value];
    renderForm('editProject', projectToModify)
  }

  function deleteProject(e) {
    const projectToDelete = AppController.getProjectsList()[e.target.attributes["data-projectIndex"].value];
    AppController.deleteProject(projectToDelete);
    renderSidePanel();
    renderAllProjects();
  }

  function editTask(e) {
    const projectToModify = AppController.getProjectsList()[e.target.attributes["data-projectIndex"].value];
    const taskToModify = projectToModify.getTasks[e.target.attributes["data-taskIndex"].value];
    renderForm('editTask', projectToModify, taskToModify);
  }

  function deleteTask(e) {
    const projectToModify = AppController.getProjectsList()[e.target.attributes["data-projectIndex"].value];
    const taskToDelete = projectToModify.getTasks[e.target.attributes["data-taskIndex"].value];

    AppController.deleteTask(projectToModify, taskToDelete);

    if (AppController.getCurrentProject()) {
      renderProject(AppController.getCurrentProject());
    } else {
      renderAllProjects();
    }
    
  }

  function toggleDone(e) {
    const projectToModify = AppController.getProjectsList()[e.target.attributes["data-projectIndex"].value];
    const taskToModify = projectToModify.getTasks[e.target.attributes["data-taskIndex"].value];
    AppController.toggleDone(projectToModify, taskToModify);
  }

  function toggleDescription(e) {
    const projectIndex = e.target.attributes["data-projectIndex"].value;
    const taskIndex = e.target.attributes["data-taskIndex"].value;
    const project = document.querySelector(`[data-projectIndex='${projectIndex}']`);
    const task = project.querySelector(`[data-taskIndex='${taskIndex}']`);

    const descriptionElement = task.querySelector('.task-description');
    descriptionElement.style.display === "none" ? descriptionElement.style.display = "block" : descriptionElement.style.display = "none";
  }

  function newProjectForm() {
    return new DOMElement('form')
          .annexChild(new DOMElement('h2').annexTextContent('New Project'))
          .annexChild(new DOMElement('label').annexAttributes({for: 'project_title'}).annexTextContent('Title:'))
          .annexChild(new DOMElement('input').annexAttributes({type: 'text', name: 'project_title', id: 'project_title', placeholder: 'Project Title'}))
          .annexChild(new DOMElement('button').annexTextContent('Add Project').annexEventListener('click', (e) => {
            e.preventDefault()
            const projectTitle = document.querySelector('#project_title').value
            AppController.createProject(projectTitle);
            renderSidePanel();
          }))
  }

  function editProjectForm(project) {
    return new DOMElement('form')
        .annexChild(new DOMElement('h2').annexTextContent('New Project'))
        .annexChild(new DOMElement('label').annexAttributes({for: 'project_title'}).annexTextContent('Title:'))
        .annexChild(new DOMElement('textarea').annexAttributes({name: 'project_title', id: 'edit_project_title'}).annexTextContent(`${project.title}`))
        .annexChild(new DOMElement('button').annexTextContent('Edit Project').annexEventListener('click', (e) => {
          e.preventDefault()
          const projectTitle = document.querySelector('#edit_project_title').value;
          AppController.editProject(project, projectTitle);

          renderSidePanel();
          renderProject(AppController.getCurrentProject());
        }))
  }

  function newTaskForm() {
    return new DOMElement('form')
          .annexChild(new DOMElement('h2').annexTextContent('Task'))
          .annexChild(new DOMElement('label').annexAttributes({for: 'task_title'}).annexTextContent('Title:'))
          .annexChild(new DOMElement('input').annexAttributes({type: 'text', name: 'task_title', id: 'task_title', placeholder: 'Task Title'}))
          .annexChild(new DOMElement('label').annexAttributes({for: 'task_description'}).annexTextContent('Description:'))
          .annexChild(new DOMElement('input').annexAttributes({type: 'text', name: 'task_description', id: 'task_description', placeholder: 'Task Description'}))
          .annexChild(new DOMElement('fieldset')
            .annexChild(new DOMElement('legend').annexTextContent('Select a Priority:'))
            .annexChild(new DOMElement('div')
              .annexChild(new DOMElement('input').annexAttributes({type: 'radio', id: 'low-priority', name: 'priority', value: 'low-priority'}))
              .annexChild(new DOMElement('label').annexAttributes({for: 'low-priority'}).annexTextContent('Low Priority'))
            )
            .annexChild(new DOMElement('div')
            .annexChild(new DOMElement('input').annexAttributes({type: 'radio', id: 'medium-priority', name: 'priority', value: 'medium-priority', checked: 'true'}))
            .annexChild(new DOMElement('label').annexAttributes({for: 'medium-priority'}).annexTextContent('Medium Priority'))
            )
            .annexChild(new DOMElement('div')
            .annexChild(new DOMElement('input').annexAttributes({type: 'radio', id: 'high-priority', name: 'priority', value: 'high-priority'}))
            .annexChild(new DOMElement('label').annexAttributes({for: 'high-priority'}).annexTextContent('High Priority'))
            )
          )
          .annexChild(new DOMElement('button').annexTextContent('Confirm').annexEventListener('click', (e) => {
            e.preventDefault();

            const taskTitle = document.querySelector('#task_title').value;
            const taskDescription = document.querySelector('#task_description').value;
            const taskPriority = document.querySelector('input[name="priority"]:checked').value;
            AppController.createTask(taskTitle, taskDescription, taskPriority);
            renderProject(AppController.getCurrentProject());
          }))
  }

  function editTaskForm(project, task) {
    return new DOMElement('form')
          .annexChild(new DOMElement('h2').annexTextContent('Edit Task'))
          .annexChild(new DOMElement('label').annexAttributes({for: 'task_title'}).annexTextContent('Title:'))
          .annexChild(new DOMElement('textarea').annexAttributes({name: 'task_title', id: 'edit_task_title'}).annexTextContent(`${task.title}`))
          .annexChild(new DOMElement('label').annexAttributes({for: 'task_description'}).annexTextContent('Description:'))
          .annexChild(new DOMElement('textarea').annexAttributes({name: 'task_description', id: 'edit_task_description'}).annexTextContent(`${task.description}`))
          .annexChild(new DOMElement('fieldset')
            .annexChild(new DOMElement('legend').annexTextContent('Select a Priority:'))
            .annexChild(new DOMElement('div')
              .annexChild(new DOMElement('input').annexAttributes({type: 'radio', id: 'low-priority', name: 'edit_priority', value: 'low-priority', checked: task.priority === "low-priority" ? "checked" : null,}))
              .annexChild(new DOMElement('label').annexAttributes({for: 'low-priority'}).annexTextContent('Low Priority'))
            )
            .annexChild(new DOMElement('div')
              .annexChild(new DOMElement('input').annexAttributes({type: 'radio', id: 'medium-priority', name: 'edit_priority', value: 'medium-priority', checked: task.priority === "medium-priority" ? "checked" : null,}))
              .annexChild(new DOMElement('label').annexAttributes({for: 'medium-priority'}).annexTextContent('Medium Priority'))
            )
            .annexChild(new DOMElement('div')
              .annexChild(new DOMElement('input').annexAttributes({type: 'radio', id: 'high-priority', name: 'edit_priority', value: 'high-priority',checked: task.priority === "high-priority" ? "checked" : null,}))
              .annexChild(new DOMElement('label').annexAttributes({for: 'high-priority'}).annexTextContent('High Priority'))
            )
          )
          .annexChild(new DOMElement('button').annexTextContent('Confirm').annexEventListener('click', (e) => {
            e.preventDefault();

            const taskTitle = document.querySelector('#edit_task_title').value;
            const taskDescription = document.querySelector('#edit_task_description').value;
            const taskPriority = document.querySelector('input[name="edit_priority"]:checked').value;


            AppController.editTask(project, task, taskTitle, taskDescription, taskPriority);
            // TODO add new function to no repeat this
            if (AppController.getCurrentProject()) {
              renderProject(AppController.getCurrentProject());
            } else {
              renderAllProjects();
            }
          }))
  }

  function renderBody() {
    document.body.appendChild(header);
    document.body.appendChild(main);
    document.body.appendChild(footer);

    main.appendChild(sidePanel);
    main.appendChild(currentView);

    renderSidePanel();
    renderAllProjects();
  }

  return { renderBody , renderSidePanel, renderAllProjects, renderProject}
})();


export { ScreenController }
