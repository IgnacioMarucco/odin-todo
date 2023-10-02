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
  const projectModal = createProjectModal().build();
  const newTaskModal = createNewTaskModal().build();

  function changeSidePanelContent() {
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
              changeCurrentViewContent(AppController.getCurrentProject());
              }
            )
          )
        )
    )

    // New Project Button
    const newProjectBtn = new DOMElement('button').annexTextContent('New Project').annexEventListener('click', () => {
      const projectModal = document.querySelector('#project_modal');
      projectModal.showModal();
    });
    
    sidePanel.appendChild(projectsListElement.build())
    sidePanel.appendChild(newProjectBtn.build());
  }

  function changeCurrentViewContent(currentProject) {
    const currentProjectIndex = AppController.getProjectsList().indexOf(currentProject);
    currentView.innerHTML = '';
    if (!currentProject) {
      // Show all projects later on
      currentView.appendChild(new DOMElement('h4').annexTextContent('Default Current View').build());
      return;
    }
    const projectTasksArray = currentProject.tasks;

    const projectDetails = new DOMElement('div').annexAttributes({id: 'project-details'})
    const projectTitle = new DOMElement('h4').annexTextContent(`${currentProject.title}`);
    const projectTasksElement = new DOMElement('ul');

    projectTasksArray.forEach(task =>
      projectTasksElement
        .annexChild(new DOMElement('li')
          .annexAttributes({class: `task ${task.priority}`, ["data-projectIndex"]: `${currentProjectIndex}`, ["data-taskIndex"]: `${currentProject.getTaskIndex(task)}`})
          .annexChild(new DOMElement('h5')
            .annexTextContent(`${task.title}`)
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

    // projectTasksArray.forEach(task =>  console.log(currentProject.getTaskIndex(task)))

    const projectNewTaskBtn = new DOMElement('button')
      .annexTextContent('New Task')
      .annexEventListener('click', () => {
        const newTaskModal = document.querySelector('#task_modal')
        newTaskModal.showModal();
      })

    projectDetails.annexChild(projectTitle).annexChild(projectTasksElement).annexChild(projectNewTaskBtn)
    currentView.appendChild(projectDetails.build());
  }

  function editTask(e) {
    const projectToModify = AppController.getProjectsList()[e.target.attributes["data-projectIndex"].value];
    const taskToModify = projectToModify.getTasks[e.target.attributes["data-taskIndex"].value];
    const editTaskModal = createEditTaskModal(projectToModify, taskToModify).build();
    // newTaskModal.showModal()
    document.body.appendChild(editTaskModal).showModal();

    console.log(taskToModify)
    console.log(editTaskModal)

  }
  
  function deleteTask(e) {
    const projectToModify = AppController.getProjectsList()[e.target.attributes["data-projectIndex"].value];
    const taskToDelete = projectToModify.getTasks[e.target.attributes["data-taskIndex"].value];

    AppController.deleteTask(projectToModify, taskToDelete);

    changeCurrentViewContent(AppController.getCurrentProject());
    console.log(taskToDelete)
  }

  function toggleDescription(e) {
    const projectIndex = e.target.attributes["data-projectIndex"].value
    const taskIndex = e.target.attributes["data-taskIndex"].value

    const descriptionElement = document.querySelector(`[data-taskIndex='${taskIndex}']`).querySelector('.task-description');
    descriptionElement.style.display === "none" ? descriptionElement.style.display = "block" : descriptionElement.style.display = "none";
  }

  function createProjectModal() {
    return new 
      DOMElement('dialog').annexAttributes({id: 'project_modal'})
        .annexChild(new DOMElement('form').annexAttributes({method: 'dialog'})
          .annexChild(new DOMElement('h2').annexTextContent('New Project'))
          .annexChild(new DOMElement('label').annexAttributes({for: 'project_title'}).annexTextContent('Title:'))
          .annexChild(new DOMElement('input').annexAttributes({type: 'text', name: 'project_title', id: 'project_title', placeholder: 'Project Title'}))
          .annexChild(new DOMElement('button').annexTextContent('Add Project').annexEventListener('click', (e) => {
            AppController.createProject();
          }))
        )
  }

  function createNewTaskModal() {
    return new 
      DOMElement('dialog').annexAttributes({id: 'task_modal'})
        .annexChild(new DOMElement('form').annexAttributes({method: 'dialog'})
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
            AppController.createTask();
          }))
        )
  }

  function createEditTaskModal(project, task) {
    console.log(project);
    console.log(task)
    return new 
      DOMElement('dialog').annexAttributes({id: 'edit_task_modal'})
        .annexChild(new DOMElement('form').annexAttributes({method: 'dialog'})
          .annexChild(new DOMElement('h2').annexTextContent('Edit Task'))
          .annexChild(new DOMElement('label').annexAttributes({for: 'task_title'}).annexTextContent('Title:'))
          .annexChild(new DOMElement('textarea').annexAttributes({name: 'task_title', id: 'edit_task_title'}).annexTextContent(`${task.title}`))
          .annexChild(new DOMElement('label').annexAttributes({for: 'task_description'}).annexTextContent('Description:'))
          .annexChild(new DOMElement('textarea').annexAttributes({name: 'task_description', id: 'edit_task_description'}).annexTextContent(`${task.description}`))
          .annexChild(new DOMElement('fieldset')
            .annexChild(new DOMElement('legend').annexTextContent('Select a Priority:'))
            .annexChild(new DOMElement('div')
              .annexChild(new DOMElement('input').annexAttributes({type: 'radio', id: 'low-priority', name: 'edit_priority', value: 'low-priority'}))
              .annexChild(new DOMElement('label').annexAttributes({for: 'low-priority'}).annexTextContent('Low Priority'))
            )
            .annexChild(new DOMElement('div')
            .annexChild(new DOMElement('input').annexAttributes({type: 'radio', id: 'medium-priority', name: 'edit_priority', value: 'medium-priority', checked: 'true'}))
            .annexChild(new DOMElement('label').annexAttributes({for: 'medium-priority'}).annexTextContent('Medium Priority'))
            )
            .annexChild(new DOMElement('div')
            .annexChild(new DOMElement('input').annexAttributes({type: 'radio', id: 'high-priority', name: 'edit_priority', value: 'high-priority'}))
            .annexChild(new DOMElement('label').annexAttributes({for: 'high-priority'}).annexTextContent('High Priority'))
            )
          )
          .annexChild(new DOMElement('button').annexTextContent('Confirm').annexEventListener('click', (e) => {
            AppController.editTask(project, task);
          }))
        )
  }

  function renderBody() {
    document.body.appendChild(header);
    document.body.appendChild(main);
    document.body.appendChild(footer);

    main.appendChild(sidePanel);
    main.appendChild(currentView);
    main.appendChild(newTaskModal);
    main.appendChild(projectModal);


    changeSidePanelContent();
    changeCurrentViewContent(AppController.getCurrentProject());
  }

  return { renderBody , changeSidePanelContent, changeCurrentViewContent}
})();


export { ScreenController }
