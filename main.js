const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // 获取屏幕尺寸
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 420, // 默认显示在屏幕右侧
    y: height - 620,
    frame: false, // 无边框窗口
    transparent: true, // 支持透明
    resizable: false, // 禁止调整大小
    alwaysOnTop: true, // 始终置顶
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // 开发时打开开发者工具
  // mainWindow.webContents.openDevTools();
}

// 允许窗口拖动
ipcMain.on('window-drag', (event, { mouseX, mouseY }) => {
  const { x, y } = screen.getCursorScreenPoint();
  mainWindow.setPosition(x - mouseX, y - mouseY);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 