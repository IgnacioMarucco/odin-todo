// CSS
import './reset.css';
import './style.css';

import { loadSection } from './modules/dom/dom';
import { createFooter } from './modules/footer/footer';
import { createMain } from './modules/main/main';
import { createHeader } from './modules/header/header';

const body = document.querySelector('body');
loadSection(createHeader(), body);
loadSection(createMain(), body);
loadSection(createFooter(), body);