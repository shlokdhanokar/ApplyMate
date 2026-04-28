const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('applymate', {
  getData: () => ipcRenderer.invoke('get-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: () => ipcRenderer.invoke('import-data'),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
  readClipboard: () => ipcRenderer.invoke('read-clipboard')
});
