// ===== Answers Module =====

const AnswersModule = (() => {
  let editingId = null;
  let activeTag = 'all';

  function render(answers, searchQuery = '') {
    const list = document.getElementById('answers-list');
    let filtered = answers;

    if (activeTag !== 'all') {
      filtered = filtered.filter(a => a.tags && a.tags.includes(activeTag));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(q) || a.text.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">📝</span>
          <div class="empty-state-text">${searchQuery ? 'No answers match your search' : 'No answers yet'}</div>
          <div class="empty-state-sub">${searchQuery ? 'Try a different keyword' : 'Click "Add Answer" to get started'}</div>
        </div>`;
      return;
    }

    list.innerHTML = filtered.map(answer => {
      const tagsHtml = (answer.tags || []).map(t =>
        `<span class="answer-tag" data-tag="${t}">${t}</span>`
      ).join('');

      const textPreview = escapeHtml(answer.text);
      const isLong = answer.text.length > 300;

      return `
        <div class="answer-card" data-id="${answer.id}">
          <div class="answer-card-header">
            <div class="answer-card-title">${escapeHtml(answer.title)}</div>
            <div style="display:flex; gap:6px; align-items:center;">
              ${answer.pinned ? '<span class="pin-badge">📌 Pinned</span>' : ''}
              <button class="btn-icon" title="Edit" onclick="AnswersModule.edit('${answer.id}')">✏️</button>
              <button class="btn-icon" title="Delete" onclick="AnswersModule.remove('${answer.id}')">🗑️</button>
            </div>
          </div>
          ${tagsHtml ? `<div class="answer-card-tags">${tagsHtml}</div>` : ''}
          <div class="answer-card-text" id="text-${answer.id}">${textPreview}</div>
          <div class="answer-card-footer">
            <div class="answer-card-footer-left">
              ${isLong ? `<button class="btn-expand" onclick="AnswersModule.toggleExpand('${answer.id}')">Show more</button>` : ''}
            </div>
            <div class="answer-card-footer-right">
              <button class="btn-copy" onclick="AnswersModule.togglePin('${answer.id}')">
                ${answer.pinned ? '📌 Unpin' : '📌 Pin'}
              </button>
              <button class="btn-copy" onclick="AnswersModule.copy('${answer.id}')">📋 Copy</button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function toggleExpand(id) {
    const el = document.getElementById(`text-${id}`);
    const btn = el.closest('.answer-card').querySelector('.btn-expand');
    if (!el || !btn) return;
    el.classList.toggle('expanded');
    btn.textContent = el.classList.contains('expanded') ? 'Show less' : 'Show more';
  }

  async function copy(id) {
    const data = AppState.getData();
    const answer = data.answers.find(a => a.id === id);
    if (!answer) return;
    await window.applymate.copyToClipboard(answer.text);
    AppState.addToHistory(answer.text, `Answer: ${answer.title}`);
    showToast(`Copied "${answer.title}"!`);
    const card = document.querySelector(`.answer-card[data-id="${id}"]`);
    if (card) flashElement(card);
  }

  function togglePin(id) {
    const data = AppState.getData();
    const answer = data.answers.find(a => a.id === id);
    if (!answer) return;
    answer.pinned = !answer.pinned;
    AppState.saveData(data);
    showToast(answer.pinned ? `Pinned "${answer.title}"` : `Unpinned "${answer.title}"`);
  }

  function openAddModal() {
    editingId = null;
    document.getElementById('modal-answer-title').textContent = 'Add Answer';
    document.getElementById('input-answer-title').value = '';
    document.getElementById('input-answer-text').value = '';
    document.getElementById('input-answer-pinned').checked = false;
    document.querySelectorAll('#tag-selector input').forEach(cb => cb.checked = false);
    document.getElementById('modal-answer').classList.add('active');
    document.getElementById('input-answer-title').focus();
  }

  function edit(id) {
    const data = AppState.getData();
    const answer = data.answers.find(a => a.id === id);
    if (!answer) return;
    editingId = id;
    document.getElementById('modal-answer-title').textContent = 'Edit Answer';
    document.getElementById('input-answer-title').value = answer.title;
    document.getElementById('input-answer-text').value = answer.text;
    document.getElementById('input-answer-pinned').checked = answer.pinned || false;
    document.querySelectorAll('#tag-selector input').forEach(cb => {
      cb.checked = (answer.tags || []).includes(cb.value);
    });
    document.getElementById('modal-answer').classList.add('active');
    document.getElementById('input-answer-title').focus();
  }

  function save() {
    const title = document.getElementById('input-answer-title').value.trim();
    const text = document.getElementById('input-answer-text').value.trim();
    const pinned = document.getElementById('input-answer-pinned').checked;
    const tags = [];
    document.querySelectorAll('#tag-selector input:checked').forEach(cb => tags.push(cb.value));

    if (!title || !text) {
      showToast('Please fill in both title and answer', 'error');
      return;
    }

    const data = AppState.getData();
    if (editingId) {
      const idx = data.answers.findIndex(a => a.id === editingId);
      if (idx !== -1) {
        data.answers[idx] = { ...data.answers[idx], title, text, tags, pinned };
      }
    } else {
      data.answers.push({ id: generateId(), title, text, tags, pinned });
    }

    AppState.saveData(data);
    document.getElementById('modal-answer').classList.remove('active');
    editingId = null;
    showToast(editingId ? 'Answer updated!' : 'Answer saved!');
  }

  function remove(id) {
    const data = AppState.getData();
    data.answers = data.answers.filter(a => a.id !== id);
    AppState.saveData(data);
    showToast('Answer deleted');
  }

  function setTagFilter(tag) {
    activeTag = tag;
    document.querySelectorAll('.tag-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.tag === tag);
    });
    const data = AppState.getData();
    render(data.answers, document.getElementById('search-input').value.trim());
  }

  function getActiveTag() { return activeTag; }

  return { render, copy, togglePin, toggleExpand, openAddModal, edit, save, remove, setTagFilter, getActiveTag };
})();
