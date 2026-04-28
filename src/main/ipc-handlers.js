const { ipcMain, clipboard, shell, dialog, BrowserWindow } = require('electron');
const fs = require('fs');

function registerIpcHandlers(store) {
  // Get all data
  ipcMain.handle('get-data', () => {
    return store.getData();
  });

  // Save all data
  ipcMain.handle('save-data', (event, newData) => {
    return store.saveData(newData);
  });

  // Copy text to clipboard
  ipcMain.handle('copy-to-clipboard', (event, text) => {
    clipboard.writeText(text);
    return true;
  });

  // Open URL in default browser
  ipcMain.handle('open-external', (event, url) => {
    // Ensure the URL has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    shell.openExternal(url);
    return true;
  });

  // Export data as JSON file
  ipcMain.handle('export-data', async () => {
    const win = BrowserWindow.getFocusedWindow();
    const result = await dialog.showSaveDialog(win, {
      title: 'Export ApplyMate Data',
      defaultPath: 'applymate-backup.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });

    if (!result.canceled && result.filePath) {
      const data = store.getData();
      fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true, path: result.filePath };
    }
    return { success: false };
  });

  // Import data from JSON file
  ipcMain.handle('import-data', async () => {
    const win = BrowserWindow.getFocusedWindow();
    const result = await dialog.showOpenDialog(win, {
      title: 'Import ApplyMate Data',
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      try {
        const raw = fs.readFileSync(result.filePaths[0], 'utf-8');
        const data = JSON.parse(raw);
        store.saveData(data);
        return { success: true, data };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
    return { success: false };
  });

  // Toggle always on top
  ipcMain.handle('toggle-always-on-top', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const current = win.isAlwaysOnTop();
    win.setAlwaysOnTop(!current);
    return !current;
  });

  // Read clipboard
  ipcMain.handle('read-clipboard', () => {
    return clipboard.readText();
  });
}

module.exports = { registerIpcHandlers };
