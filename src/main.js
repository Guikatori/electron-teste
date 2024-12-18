import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const { Tray, Menu, nativeImage } = require('electron');
let tray;

app.whenReady().then(() => {
  const iconPath = 'C:\\Users\\guilherme.catori\\Desktop\\electron\\voipTemplateServer\\my-app\\src\\suncall.ico';
  const icon = nativeImage.createFromPath(iconPath);
  if (!icon.isEmpty()) {
    console.log('Ícone carregado com sucesso!');
  } else {
    console.error('Erro: Ícone não pôde ser carregado.');
  }

  // Criar o Menu Contextual
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item', type: 'radio', checked: true },
  ]
);

  // Criar o Tray com o ícone
  tray = new Tray(icon);
  tray.setToolTip('Suncall');
  tray.setContextMenu(contextMenu);

  // Definir o evento de clique
  tray.on('click', (event, bounds, position) => {
    console.log('Evento de clique no ícone da bandeja!');
    console.log('Evento:', event);
    console.log('Limites:', bounds); // { x, y, width, height }
    console.log('Posição:', position); // { x, y }
    console.log('Caminho do ícone:', iconPath);
    // Adicionar lógica do reopen aqui
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
