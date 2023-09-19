import '../css/header.css';
import '../css/main.css';
import '../css/footer.css';

import { DOMElement } from "./DOMElement";
import { AppController } from './AppController';

const ScreenController = (() => {
  const header = new DOMElement('header').annexTextContent('TODO List').build();
  const footer = new DOMElement('footer').annexTextContent('Created by Ignacio Marucco').build();
  const main = new DOMElement('main').build();
  const sidePanel = new DOMElement('nav').annexAttributes({id: 'side-panel'}).build();
  const currentView = new DOMElement('div').annexAttributes({id: 'current-view'}).build();
  const projectModal = createProjectModal().build();
  const taskModal = createTaskModal().build();

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
    currentView.innerHTML = '';
    if (!currentProject) {
      // Show all projects later on
      currentView.appendChild(new DOMElement('h4').annexTextContent('Default Current View').build());
      return;
    }
    const projectTasksArray = currentProject.tasks;
    console.log({projectTasksArray});
    console.log({currentProject})
    const projectDetails = new DOMElement('div').annexAttributes({id: 'project-details'})
    const projectTitle = new DOMElement('h4').annexTextContent(`${currentProject.title}`);
    const projectTasksElement = new DOMElement('ul');

    projectTasksArray.forEach(task => 
      projectTasksElement
        .annexChild(new DOMElement('li')
          .annexChild(new DOMElement('h6').annexTextContent(`${task.title}`))
          .annexChild(new DOMElement('p').annexTextContent(`${task.description}`))
        )
    )

    const projectNewTaskBtn = new DOMElement('button')
      .annexTextContent('New Task')
      .annexEventListener('click', () => {
        const taskModal = document.querySelector('#task_modal')
        taskModal.showModal();
      })

    projectDetails.annexChild(projectTitle).annexChild(projectTasksElement).annexChild(projectNewTaskBtn)
    currentView.appendChild(projectDetails.build());
  }

  function createProjectModal() {
    return new DOMElement('dialog').annexAttributes({id: 'project_modal'})
      .annexChild(new DOMElement('form').annexAttributes({method: 'dialog'})
        .annexChild(new DOMElement('h2').annexTextContent('New Project'))
        .annexChild(new DOMElement('label').annexAttributes({for: 'project_title'}).annexTextContent('Title:'))
        .annexChild(new DOMElement('input').annexAttributes({type: 'text', name: 'project_title', id: 'project_title', placeholder: 'Project Title'}))
        .annexChild(new DOMElement('button').annexTextContent('Add Project').annexEventListener('click', (e) => {
          AppController.createProject();
          changeSidePanelContent();
        }))
      )
  }

  function createTaskModal() {
    return new DOMElement('dialog').annexAttributes({id: 'task_modal'})
      .annexChild(new DOMElement('form').annexAttributes({method: 'dialog'})
        .annexChild(new DOMElement('h2').annexTextContent('New Task'))
        .annexChild(new DOMElement('label').annexAttributes({for: 'task_title'}).annexTextContent('Title:'))
        .annexChild(new DOMElement('input').annexAttributes({type: 'text', name: 'task_title', id: 'task_title', placeholder: 'Task Title'}))
        .annexChild(new DOMElement('label').annexAttributes({for: 'task_description'}).annexTextContent('Description:'))
        .annexChild(new DOMElement('input').annexAttributes({type: 'text', name: 'task_description', id: 'task_description', placeholder: 'Task Description'}))
        .annexChild(new DOMElement('button').annexTextContent('Add Task').annexEventListener('click', (e) => {
          AppController.createTask();
          changeCurrentViewContent(AppController.getCurrentProject());
        }))
      )
  }

  function renderBody() {
    document.body.appendChild(header);
    document.body.appendChild(main);
    document.body.appendChild(footer);

    main.appendChild(sidePanel);
    main.appendChild(currentView);
    main.appendChild(taskModal);
    main.appendChild(projectModal);


    changeSidePanelContent();
    changeCurrentViewContent(AppController.getCurrentProject());
  }

  return { renderBody }
})();


export { ScreenController }
