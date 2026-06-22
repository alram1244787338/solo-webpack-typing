import { createHeader, createFooter } from './Header.js';
import { createStatsBar, updateStats } from './StatsBar.js';
import {
  createTypingArea,
  renderText,
  scrollToCurrentChar,
  getTypingInput,
  focusTypingInput,
  clearTypingInput,
  disableTypingInput,
  enableTypingInput
} from './TypingArea.js';
import { createResultModal, showResultModal, hideResultModal } from './ResultModal.js';
import { getRandomArticle } from '../utils/articleLoader.js';
import { Timer } from '../utils/timer.js';
import { calculateStats } from '../utils/stats.js';

const TEST_DURATION = 60;

export class App {
  constructor(rootEl) {
    this.root = rootEl;
    this.timer = new Timer(TEST_DURATION);
    this.currentArticle = null;
    this.inputText = '';
    this.hasStarted = false;
    this.hasFinished = false;
    this.lastStats = null;

    this.setupTimerCallbacks();
  }

  setupTimerCallbacks() {
    this.timer.onTick = (remaining, elapsed) => {
      const stats = calculateStats(
        this.currentArticle.content,
        this.inputText,
        elapsed
      );
      this.lastStats = stats;
      let correctChars = 0;
      for (let i = 0; i < this.inputText.length; i++) {
        if (this.inputText[i] === this.currentArticle.content[i]) {
          correctChars++;
        }
      }
      updateStats(
        stats.wpm,
        stats.accuracy,
        remaining,
        correctChars,
        this.currentArticle.content.length
      );
    };

    this.timer.onComplete = () => {
      this.finishTest();
    };
  }

  mount() {
    this.root.innerHTML = '';
    this.currentArticle = getRandomArticle();

    const header = createHeader();

    const main = document.createElement('main');
    main.className = 'main';

    const container = document.createElement('div');
    container.className = 'container';

    const statsBar = createStatsBar();
    const typingArea = createTypingArea();
    const controls = this.createControls();

    container.appendChild(statsBar);
    container.appendChild(typingArea);
    container.appendChild(controls);
    main.appendChild(container);

    const footer = createFooter();
    const modal = createResultModal();

    this.root.appendChild(header);
    this.root.appendChild(main);
    this.root.appendChild(footer);
    this.root.appendChild(modal);

    renderText(this.currentArticle.content, this.inputText);
    this.bindEvents();
    updateStats(0, 100, TEST_DURATION, 0, this.currentArticle.content.length);
  }

  createControls() {
    const controls = document.createElement('div');
    controls.className = 'controls';

    const newTextBtn = document.createElement('button');
    newTextBtn.className = 'btn btn-secondary';
    newTextBtn.id = 'new-text-btn';
    newTextBtn.textContent = '换一篇文章';

    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-secondary';
    resetBtn.id = 'reset-btn';
    resetBtn.textContent = '重新开始';

    controls.appendChild(newTextBtn);
    controls.appendChild(resetBtn);

    return controls;
  }

  bindEvents() {
    const input = getTypingInput();
    const typingArea = document.querySelector('.typing-area');
    const newTextBtn = document.getElementById('new-text-btn');
    const resetBtn = document.getElementById('reset-btn');
    const restartBtn = document.getElementById('restart-btn');

    if (input) {
      input.addEventListener('input', (e) => this.handleInput(e));
    }

    if (typingArea) {
      typingArea.addEventListener('click', () => {
        if (!this.hasFinished) focusTypingInput();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (this.hasFinished) return;
      if (e.target.tagName === 'BUTTON') return;
      if (!this.hasStarted && e.key.length === 1) {
        focusTypingInput();
      }
    });

    if (newTextBtn) {
      newTextBtn.addEventListener('click', () => this.loadNewArticle());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetTest());
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        hideResultModal();
        this.resetTest();
      });
    }
  }

  handleInput(e) {
    if (this.hasFinished) {
      e.target.value = this.inputText;
      return;
    }

    const newValue = e.target.value;

    if (!this.hasStarted && newValue.length > 0) {
      this.hasStarted = true;
      this.timer.start();
      const hint = document.querySelector('.typing-hint');
      if (hint) hint.style.display = 'none';
    }

    this.inputText = newValue;
    renderText(this.currentArticle.content, this.inputText);
    scrollToCurrentChar();

    if (this.inputText.length >= this.currentArticle.content.length) {
      this.finishTest();
    }
  }

  finishTest() {
    this.hasFinished = true;
    this.timer.stop();
    disableTypingInput();

    const elapsed = this.timer.getElapsed();
    const stats = calculateStats(
      this.currentArticle.content,
      this.inputText,
      elapsed > 0 ? elapsed : TEST_DURATION
    );
    this.lastStats = stats;
    showResultModal(stats);
  }

  resetTest() {
    this.timer.reset();
    this.inputText = '';
    this.hasStarted = false;
    this.hasFinished = false;
    this.lastStats = null;

    clearTypingInput();
    enableTypingInput();
    renderText(this.currentArticle.content, this.inputText);
    updateStats(0, 100, TEST_DURATION, 0, this.currentArticle.content.length);

    const hint = document.querySelector('.typing-hint');
    if (hint) hint.style.display = 'block';

    focusTypingInput();
  }

  loadNewArticle() {
    this.currentArticle = getRandomArticle();
    this.resetTest();
  }
}
