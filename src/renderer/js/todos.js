// ===== Things to Do Module =====

const TodosModule = (() => {
  let draggedId = null;
  let dragOverId = null;

  function render(todos) {
    const list = document.getElementById('todo-list');
    const stats = document.getElementById('todo-stats');

    if (!todos || todos.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <span class="empty-state-icon">✅</span>
          <div class="empty-state-text">No tasks yet</div>
          <div class="empty-state-sub">Type a task above and press Enter</div>
        </div>`;
      stats.innerHTML = '';
      return;
    }

    const done = todos.filter(t => t.done).length;
    const total = todos.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    stats.innerHTML = `
      <div class="todo-progress">
        <div class="todo-progress-bar">
          <div class="todo-progress-fill" style="width: ${pct}%"></div>
        </div>
        <span class="todo-progress-text">${done}/${total} completed</span>
      </div>`;

    list.innerHTML = todos.map((todo, idx) => `
      <div class="todo-item ${todo.done ? 'done' : ''}" 
           data-id="${todo.id}" 
           draggable="true"
           ondragstart="TodosModule.onDragStart(event, '${todo.id}')"
           ondragover="TodosModule.onDragOver(event, '${todo.id}')"
           ondragleave="TodosModule.onDragLeave(event)"
           ondrop="TodosModule.onDrop(event, '${todo.id}')"
           ondragend="TodosModule.onDragEnd(event)">
        <div class="todo-drag-handle" title="Drag to reorder">⠿</div>
        <button class="todo-circle ${todo.done ? 'checked' : ''}" 
                onclick="TodosModule.toggle('${todo.id}')"
                title="${todo.done ? 'Mark as not done' : 'Mark as done'}">
          ${todo.done ? '✓' : ''}
        </button>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="btn-icon todo-delete" title="Delete" onclick="TodosModule.remove('${todo.id}')">🗑️</button>
      </div>
    `).join('');
  }

  function add(text) {
    if (!text.trim()) return;
    const data = AppState.getData();
    if (!data.todos) data.todos = [];
    data.todos.push({
      id: generateId(),
      text: text.trim(),
      done: false,
      createdAt: Date.now()
    });
    AppState.saveData(data);
    showToast('Task added!');
  }

  function toggle(id) {
    const data = AppState.getData();
    const todo = (data.todos || []).find(t => t.id === id);
    if (!todo) return;
    todo.done = !todo.done;
    AppState.saveData(data);
    if (todo.done) showToast('Task completed! 🎉');
  }

  function remove(id) {
    const data = AppState.getData();
    data.todos = (data.todos || []).filter(t => t.id !== id);
    AppState.saveData(data);
    showToast('Task deleted');
  }

  // --- Drag and Drop ---
  function onDragStart(e, id) {
    draggedId = id;
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  }

  function onDragOver(e, id) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id === draggedId) return;

    // Remove previous drag-over highlights
    document.querySelectorAll('.todo-item.drag-over').forEach(el => el.classList.remove('drag-over'));

    const el = e.target.closest('.todo-item');
    if (el) {
      el.classList.add('drag-over');
      dragOverId = id;
    }
  }

  function onDragLeave(e) {
    const el = e.target.closest('.todo-item');
    if (el) el.classList.remove('drag-over');
  }

  function onDrop(e, targetId) {
    e.preventDefault();
    document.querySelectorAll('.todo-item.drag-over').forEach(el => el.classList.remove('drag-over'));

    if (!draggedId || draggedId === targetId) return;

    const data = AppState.getData();
    const todos = data.todos || [];
    const fromIdx = todos.findIndex(t => t.id === draggedId);
    const toIdx = todos.findIndex(t => t.id === targetId);

    if (fromIdx === -1 || toIdx === -1) return;

    // Remove from old position and insert at new position
    const [moved] = todos.splice(fromIdx, 1);
    todos.splice(toIdx, 0, moved);

    data.todos = todos;
    AppState.saveData(data);
    draggedId = null;
    dragOverId = null;
  }

  function onDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.todo-item.drag-over').forEach(el => el.classList.remove('drag-over'));
    draggedId = null;
    dragOverId = null;
  }

  return { render, add, toggle, remove, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd };
})();
