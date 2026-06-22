export function createResultModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'result-modal';
  overlay.style.display = 'none';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const header = document.createElement('div');
  header.className = 'modal-header';

  const title = document.createElement('h2');
  title.className = 'modal-title';
  title.textContent = '测试结束！';

  const body = document.createElement('div');
  body.className = 'modal-body';

  const stats = [
    { id: 'result-wpm', label: 'WPM (每分钟单词数)', value: '0' },
    { id: 'result-accuracy', label: '准确率', value: '0%' },
    { id: 'result-correct', label: '正确字符数', value: '0' },
    { id: 'result-wrong', label: '错误字符数', value: '0' }
  ];

  stats.forEach(stat => {
    const row = document.createElement('div');
    row.className = 'result-row';

    const label = document.createElement('span');
    label.className = 'result-label';
    label.textContent = stat.label;

    const value = document.createElement('span');
    value.className = 'result-value';
    value.id = stat.id;
    value.textContent = stat.value;

    row.appendChild(label);
    row.appendChild(value);
    body.appendChild(row);
  });

  const footer = document.createElement('div');
  footer.className = 'modal-footer';

  const restartBtn = document.createElement('button');
  restartBtn.className = 'btn btn-primary';
  restartBtn.id = 'restart-btn';
  restartBtn.textContent = '再来一次';

  footer.appendChild(restartBtn);
  header.appendChild(title);
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);

  return overlay;
}

export function showResultModal(stats) {
  const modal = document.getElementById('result-modal');
  if (!modal) return;

  const wpmEl = document.getElementById('result-wpm');
  const accuracyEl = document.getElementById('result-accuracy');
  const correctEl = document.getElementById('result-correct');
  const wrongEl = document.getElementById('result-wrong');

  if (wpmEl) wpmEl.textContent = String(stats.wpm);
  if (accuracyEl) accuracyEl.textContent = `${stats.accuracy}%`;
  if (correctEl) correctEl.textContent = String(stats.correctChars);
  if (wrongEl) wrongEl.textContent = String(stats.wrongChars);

  modal.style.display = 'flex';
}

export function hideResultModal() {
  const modal = document.getElementById('result-modal');
  if (modal) modal.style.display = 'none';
}
