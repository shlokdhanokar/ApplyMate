// ===== App State & Controller =====

const AppState = (() => {
  let data = null;
  let currentSection = 'links';
  const listeners = [];

  function onChange(fn) { listeners.push(fn); }
  function notify() { listeners.forEach(fn => fn(data, currentSection)); }

  function getData() { return data; }

  async function loadData() {
    data = await window.applymate.getData();
    if (!data.copyHistory) data.copyHistory = [];
    if (!data.settings) data.settings = { theme: 'dark', alwaysOnTop: false };
    applyTheme(data.settings.theme);
    notify();
  }

  const debouncedSave = debounce(async (d) => {
    await window.applymate.saveData(d);
  }, 400);

  function saveData(newData) {
    data = newData;
    debouncedSave(data);
    notify();
  }

  function addToHistory(text, label) {
    if (!data.copyHistory) data.copyHistory = [];
    data.copyHistory.unshift({
      text: text.substring(0, 200),
      label: label || '',
      time: Date.now()
    });
    if (data.copyHistory.length > 20) data.copyHistory = data.copyHistory.slice(0, 20);
    saveData(data);
  }

  function clearHistory() {
    data.copyHistory = [];
    saveData(data);
    showToast('History cleared');
  }

  function setSection(section) {
    currentSection = section;
    notify();
  }

  function getSection() { return currentSection; }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    const label = icon?.parentElement?.querySelector('.nav-label');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    if (label) label.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  }

  function toggleTheme() {
    const newTheme = data.settings.theme === 'dark' ? 'light' : 'dark';
    data.settings.theme = newTheme;
    applyTheme(newTheme);
    saveData(data);
    showToast(`Switched to ${newTheme} mode`);
  }

  return { getData, loadData, saveData, addToHistory, clearHistory, setSection, getSection, onChange, toggleTheme };
})();

// ===== Rendering =====

function renderAll(data, currentSection) {
  if (!data) return;

  // Update active nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === currentSection);
  });

  // Update section title
  const titles = {
    links: '🔗 Links',
    answers: '📝 Answers',
    quickcopy: '⚡ Quick Copy',
    history: '📋 Copy History'
  };
  document.getElementById('section-title').textContent = titles[currentSection] || '';

  // Show active panel
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`panel-${currentSection}`);
  if (panel) panel.classList.add('active');

  const query = document.getElementById('search-input').value.trim();

  // Render sections
  LinksModule.render(data.links || [], query);
  AnswersModule.render(data.answers || [], query);
  QuickCopyModule.render(data.answers || []);
  renderHistory(data.copyHistory || []);
}

function renderHistory(history) {
  const list = document.getElementById('history-list');
  if (history.length === 0) {
    list.innerHTML = `
      <div class="history-empty">
        <span>📋</span>
        <div>No copy history yet</div>
      </div>`;
    return;
  }

  list.innerHTML = history.map((item, i) => `
    <div class="history-item">
      <span class="history-text" title="${escapeHtml(item.text)}">
        ${item.label ? `<strong>${escapeHtml(item.label)}</strong> — ` : ''}${escapeHtml(item.text)}
      </span>
      <span class="history-time">${timeAgo(item.time)}</span>
      <button class="btn-icon" title="Copy again" onclick="copyHistoryItem(${i})" style="margin-left:4px;">📋</button>
    </div>
  `).join('');
}

async function copyHistoryItem(index) {
  const data = AppState.getData();
  const item = data.copyHistory[index];
  if (!item) return;
  await window.applymate.copyToClipboard(item.text);
  showToast('Copied from history!');
}

// ===== Event Listeners =====

document.addEventListener('DOMContentLoaded', async () => {
  AppState.onChange(renderAll);
  await AppState.loadData();

  // Sidebar navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.setSection(btn.dataset.section);
    });
  });

  // Add link
  document.getElementById('btn-add-link').addEventListener('click', () => LinksModule.openAddModal());
  document.getElementById('btn-save-link').addEventListener('click', () => LinksModule.save());

  // Add answer
  document.getElementById('btn-add-answer').addEventListener('click', () => AnswersModule.openAddModal());
  document.getElementById('btn-save-answer').addEventListener('click', () => AnswersModule.save());

  // Tag filters
  document.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', () => AnswersModule.setTagFilter(chip.dataset.tag));
  });

  // Clear history
  document.getElementById('btn-clear-history').addEventListener('click', () => AppState.clearHistory());

  // Modal close buttons
  document.querySelectorAll('.modal-close, .btn-secondary[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modal);
      if (modal) modal.classList.remove('active');
    });
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  searchInput.addEventListener('input', debounce(() => {
    searchClear.classList.toggle('visible', searchInput.value.length > 0);
    renderAll(AppState.getData(), AppState.getSection());
  }, 150));

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    renderAll(AppState.getData(), AppState.getSection());
  });

  // Theme toggle
  document.getElementById('btn-theme-toggle').addEventListener('click', () => AppState.toggleTheme());

  // Always on top
  document.getElementById('btn-always-on-top').addEventListener('click', async () => {
    const isOnTop = await window.applymate.toggleAlwaysOnTop();
    document.getElementById('btn-always-on-top').classList.toggle('active', isOnTop);
    showToast(isOnTop ? 'Window pinned on top' : 'Window unpinned');
  });

  // Export
  document.getElementById('btn-export').addEventListener('click', async () => {
    const result = await window.applymate.exportData();
    if (result.success) showToast('Data exported successfully!');
  });

  // Import
  document.getElementById('btn-import').addEventListener('click', async () => {
    const result = await window.applymate.importData();
    if (result.success) {
      await AppState.loadData();
      showToast('Data imported successfully!');
    } else if (result.error) {
      showToast('Import failed: ' + result.error, 'error');
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+F — focus search
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }

    // Ctrl+1-9 — quick copy
    if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      QuickCopyModule.copyByIndex(parseInt(e.key) - 1);
    }

    // Escape — close modals, clear search
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      if (document.activeElement === searchInput) {
        searchInput.value = '';
        searchClear.classList.remove('visible');
        searchInput.blur();
        renderAll(AppState.getData(), AppState.getSection());
      }
    }
  });

  // Modal Enter key to save
  document.getElementById('modal-link').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); LinksModule.save(); }
  });

  document.getElementById('modal-answer').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); AnswersModule.save(); }
  });
});
