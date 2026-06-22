export function calculateWPM(correctChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  const words = correctChars / 5;
  const minutes = elapsedSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correctChars, totalTyped) {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}

export function calculateStats(originalText, inputText, elapsedSeconds) {
  let correct = 0;
  let wrong = 0;
  const totalTyped = inputText.length;

  for (let i = 0; i < inputText.length; i++) {
    if (i < originalText.length && inputText[i] === originalText[i]) {
      correct++;
    } else {
      wrong++;
    }
  }

  const wpm = calculateWPM(correct, elapsedSeconds);
  const accuracy = calculateAccuracy(correct, totalTyped);

  return {
    wpm,
    accuracy,
    correctChars: correct,
    wrongChars: wrong,
    totalTyped
  };
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
