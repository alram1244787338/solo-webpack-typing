import './styles/global.css';
import './styles/layout.css';
import './styles/typing.css';
import { App } from './components/App.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  const app = new App(root);
  app.mount();
});
