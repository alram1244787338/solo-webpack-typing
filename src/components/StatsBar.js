import { formatTime } from '../utils/stats.js';

export function createStatsBar() {
  const statsBar = document.createElement('div');
  statsBar.className = 'stats-bar';

  const items = [
    { id: 'stats-wpm', label: 'WPM', value: '0' },
    { id: 'stats-accuracy', label: '准确率', value: '100%' },
    { id: 'stats-time', label: '时间', value: '1:00' },
    { id: 'stats-chars', label: '字符', value: '0/0' }
  ];

  items.forEach(item => {
    const statItem = document.createElement('div');
    statItem.className = 'stat-item';

    const label = document.createElement('span');
    label.className = 'stat-label';
    label.textContent = item.label;

    const value = document.createElement('span');
    value.className = 'stat-value';
    value.id = item.id;
    value.textContent = item.value;

    statItem.appendChild(label);
    statItem.appendChild(value);
    statsBar.appendChild(statItem);
  });

  return statsBar;
}

export function updateStats(wpm, accuracy, remainingTime, correctChars, totalChars) {
  const wpmEl = document.getElementById('stats-wpm');
  const accuracyEl = document.getElementById('stats-accuracy');
  const timeEl = document.getElementById('stats-time');
  const charsEl = document.getElementById('stats-chars');

  if (wpmEl) wpmEl.textContent = String(wpm);
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
  if (timeEl) timeEl.textContent = formatTime(remainingTime);
  if (charsEl) charsEl.textContent = `${correctChars}/${totalChars}`;
}
