// ===== Links Module =====

const LinksModule = (() => {
  let editingId = null;

  function render(links, searchQuery = '') {
    const grid = document.getElementById('links-grid');
    let filtered = links;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = links.filter(l =>
        l.label.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <span class="empty-state-icon">🔗</span>
          <div class="empty-state-text">${searchQuery ? 'No links match your search' : 'No links yet'}</div>
          <div class="empty-state-sub">${searchQuery ? 'Try a different keyword' : 'Click "Add Link" to get started'}</div>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(link => `
      <div class="link-card" data-id="${link.id}">
        <div class="link-card-header">
          <div class="link-card-info">
            <div class="link-card-icon">${link.icon || '🔗'}</div>
            <div>
              <div class="link-card-label">${escapeHtml(link.label)}</div>
              <div class="link-card-url" title="${escapeHtml(link.url)}">${escapeHtml(link.url)}</div>
            </div>
          </div>
          <div class="link-card-actions">
            <button class="btn-icon" title="Edit" onclick="LinksModule.edit('${link.id}')">✏️</button>
            <button class="btn-icon" title="Delete" onclick="LinksModule.remove('${link.id}')">🗑️</button>
          </div>
        </div>
        <div class="link-card-actions" style="justify-content: flex-end;">
          <button class="btn-copy" onclick="LinksModule.copy('${link.id}')">📋 Copy URL</button>
          <button class="btn-copy" onclick="LinksModule.open('${link.id}')">🌐 Open</button>
        </div>
      </div>
    `).join('');
  }

  async function copy(id) {
    const data = AppState.getData();
    const link = data.links.find(l => l.id === id);
    if (!link) return;
    await window.applymate.copyToClipboard(link.url);
    AppState.addToHistory(link.url, `Link: ${link.label}`);
    showToast(`Copied ${link.label} URL!`);
    const card = document.querySelector(`.link-card[data-id="${id}"]`);
    if (card) flashElement(card);
  }

  async function open(id) {
    const data = AppState.getData();
    const link = data.links.find(l => l.id === id);
    if (!link) return;
    await window.applymate.openExternal(link.url);
  }

  function openAddModal() {
    editingId = null;
    document.getElementById('modal-link-title').textContent = 'Add Link';
    document.getElementById('input-link-label').value = '';
    document.getElementById('input-link-url').value = '';
    document.getElementById('input-link-icon').value = '🔗';
    document.getElementById('modal-link').classList.add('active');
    document.getElementById('input-link-label').focus();
  }

  function edit(id) {
    const data = AppState.getData();
    const link = data.links.find(l => l.id === id);
    if (!link) return;
    editingId = id;
    document.getElementById('modal-link-title').textContent = 'Edit Link';
    document.getElementById('input-link-label').value = link.label;
    document.getElementById('input-link-url').value = link.url;
    document.getElementById('input-link-icon').value = link.icon || '🔗';
    document.getElementById('modal-link').classList.add('active');
    document.getElementById('input-link-label').focus();
  }

  function save() {
    const label = document.getElementById('input-link-label').value.trim();
    const url = document.getElementById('input-link-url').value.trim();
    const icon = document.getElementById('input-link-icon').value.trim() || '🔗';

    if (!label || !url) {
      showToast('Please fill in both label and URL', 'error');
      return;
    }

    const data = AppState.getData();
    if (editingId) {
      const idx = data.links.findIndex(l => l.id === editingId);
      if (idx !== -1) {
        data.links[idx] = { ...data.links[idx], label, url, icon };
      }
    } else {
      data.links.push({ id: generateId(), label, url, icon });
    }

    AppState.saveData(data);
    document.getElementById('modal-link').classList.remove('active');
    editingId = null;
    showToast(editingId ? 'Link updated!' : 'Link added!');
  }

  function remove(id) {
    const data = AppState.getData();
    data.links = data.links.filter(l => l.id !== id);
    AppState.saveData(data);
    showToast('Link deleted');
  }

  return { render, copy, open, openAddModal, edit, save, remove };
})();
