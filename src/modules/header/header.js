// CSS
import './header.css';

function createHeader() {
  const header = document.createElement('header');
  header.textContent = 'Todo List';
  return header;
}

export { createHeader };