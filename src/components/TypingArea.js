export function createTypingArea() {
  const wrapper = document.createElement('div');
  wrapper.className = 'typing-area';

  const textDisplay = document.createElement('div');
  textDisplay.className = 'text-display';
  textDisplay.id = 'text-display';

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'input-wrapper';

  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'text';
  hiddenInput.className = 'hidden-input';
  hiddenInput.id = 'typing-input';
  hiddenInput.autocomplete = 'off';
  hiddenInput.autocorrect = 'off';
  hiddenInput.autocapitalize = 'off';
  hiddenInput.spellcheck = false;

  const hint = document.createElement('p');
  hint.className = 'typing-hint';
  hint.textContent = '点击此处或按任意键开始打字...';

  inputWrapper.appendChild(hiddenInput);
  inputWrapper.appendChild(hint);
  wrapper.appendChild(textDisplay);
  wrapper.appendChild(inputWrapper);

  return wrapper;
}

export function renderText(originalText, inputText) {
  const display = document.getElementById('text-display');
  if (!display) return;

  display.innerHTML = '';

  for (let i = 0; i < originalText.length; i++) {
    const char = document.createElement('span');
    char.className = 'char';
    char.textContent = originalText[i];

    if (i < inputText.length) {
      if (inputText[i] === originalText[i]) {
        char.classList.add('char-correct');
      } else {
        char.classList.add('char-wrong');
      }
    } else if (i === inputText.length) {
      char.classList.add('char-current');
    }

    if (originalText[i] === ' ') {
      char.classList.add('char-space');
    }

    display.appendChild(char);
  }
}

export function getTypingInput() {
  return document.getElementById('typing-input');
}

export function focusTypingInput() {
  const input = getTypingInput();
  if (input) input.focus();
}

export function clearTypingInput() {
  const input = getTypingInput();
  if (input) input.value = '';
}

export function disableTypingInput() {
  const input = getTypingInput();
  if (input) input.disabled = true;
}

export function enableTypingInput() {
  const input = getTypingInput();
  if (input) input.disabled = false;
}

export function scrollToCurrentChar() {
  const currentChar = document.querySelector('.char-current');
  if (!currentChar) return;

  const display = document.getElementById('text-display');
  if (!display) return;

  const displayRect = display.getBoundingClientRect();
  const charRect = currentChar.getBoundingClientRect();

  const charTop = charRect.top - displayRect.top + display.scrollTop;
  const targetScrollTop = charTop - display.clientHeight / 2 + charRect.height / 2;

  display.scrollTo({
    top: targetScrollTop,
    behavior: 'smooth'
  });
}
