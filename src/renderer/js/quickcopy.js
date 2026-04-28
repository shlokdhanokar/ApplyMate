// ===== Quick Copy Module =====

const QuickCopyModule = (() => {
  function render(answers) {
    const grid = document.getElementById('quickcopy-grid');
    const pinned = answers.filter(a => a.pinned);

    if (pinned.length === 0) {
      grid.innerHTML = `
        <div class="quickcopy-empty" style="grid-column: 1 / -1;">
          <span>📌</span>
          <div>No pinned answers yet</div>
          <div style="font-size:12px; margin-top:4px; color:var(--text-muted);">
            Go to Answers tab and pin your most-used answers
          </div>
        </div>`;
      return;
    }

    grid.innerHTML = pinned.map((answer, idx) => `
      <div class="quickcopy-card" data-id="${answer.id}" onclick="QuickCopyModule.copy('${answer.id}')">
        ${idx < 9 ? `<span class="quickcopy-shortcut">Ctrl+${idx + 1}</span>` : ''}
        <div class="quickcopy-title">${escapeHtml(answer.title)}</div>
        <div class="quickcopy-preview">${escapeHtml(answer.text)}</div>
        <div class="quickcopy-footer">
          <button class="btn-copy" onclick="event.stopPropagation(); QuickCopyModule.copy('${answer.id}')">📋 Copy</button>
        </div>
      </div>
    `).join('');
  }

  async function copy(id) {
    const data = AppState.getData();
    const answer = data.answers.find(a => a.id === id);
    if (!answer) return;
    await window.applymate.copyToClipboard(answer.text);
    AppState.addToHistory(answer.text, `Quick: ${answer.title}`);
    showToast(`Copied "${answer.title}"!`);
    const card = document.querySelector(`.quickcopy-card[data-id="${id}"]`);
    if (card) flashElement(card);
  }

  async function copyByIndex(index) {
    const data = AppState.getData();
    const pinned = data.answers.filter(a => a.pinned);
    if (index < pinned.length) {
      await copy(pinned[index].id);
    }
  }

  return { render, copy, copyByIndex };
})();
