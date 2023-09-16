// CSS
import './footer.css';

function createFooter() {
  const footer = document.createElement('footer');
  footer.textContent = 'Created by Ignacio Marucco';
  return footer;
}

export { createFooter };