import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import WebSocket from 'ws';
import fetch from 'node-fetch';

if (started) {
  app.quit();
}

let tray;

app.whenReady().then(() => {
  const iconPath = path.join(__dirname, '..', '..', 'src', 'icons', 'orange_icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  console.log(iconPath)
  tray = new Tray(icon);
  tray.setToolTip('Suncall');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: async() => { await quitServer()}}
  ]);
  tray.setContextMenu(contextMenu);
  setTimeout(() => {
    useSocket();
  }, 5000); 

  tray.on('click', (event) => {
    console.log('Evento de clique no ícone da bandeja!');
    console.log(iconPath)
  });
});

function updateTrayIcon(color) {
  const iconPaths = path.join(__dirname, '..', '..', 'src', 'icons', `${color}_icon.png`);
  const icon = nativeImage.createFromPath(iconPaths);
  tray.setImage(icon);
}

function useSocket(){
  let socket = new WebSocket('ws://localhost:49169/ws');

  socket.onopen = () => {
      console.log('Conexão WebSocket aberta.');
      updateTrayIcon('green'); 
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: async() => { await quitServer()}},
      ]);
      tray.setContextMenu(contextMenu);
  };

  socket.onmessage = (event) => {
      console.log('Mensagem recebida:', event.data);
      if (event.data === 'Server is running') {
          updateTrayIcon('green'); 
          const contextMenu = Menu.buildFromTemplate([
            { label: 'Quit', click: async() => { await quitServer()}},
          ]);
          tray.setContextMenu(contextMenu);
      }
  };

  socket.onclose = () => {
      console.log('Conexão WebSocket fechada.');
      updateTrayIcon('red');
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: async() => { await quitServer()}},
        { label: 'Reconect', click: async() => { await reconectServer()}},
      ]);
      tray.setContextMenu(contextMenu);
  };

  socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      updateTrayIcon('red'); 
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: async() => { await quitServer()}},
        { label: 'Reconect', click: async() => { await reconectServer()}},
      ]);
      tray.setContextMenu(contextMenu);
  };
}

//Warning!!!!!!!!!!!!!!!!!!
async function quitServer(){

  const url = "http://localhost:49169/quit";
  const headers  = { 'Content-Type': 'application/json' };
  const payload = {
      Message :  "Quit"
  }

  const payloadJson = JSON.stringify(payload)
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: payloadJson,
    });

    console.log(`Status da resposta: ${response.status} - ${response.statusText}`);

    if (response.ok) {
      console.log("Servidor encerrado com sucesso.");
      app.quit(); 
      process.exit(0); 
    } else {
      console.error(`Erro ao encerrar o servidor: ${response.status} - ${response.statusText}`);
      
      const errorResponse = await response.text();
      console.error('Resposta de erro: ', errorResponse);
    }
  } catch (error) {
    app.quit(); 
    process.exit(0); 
  }

}

/* 
async function reconectServer(){

  const url = "http://localhost:49169/reconect";
  const headers  = { 'Content-Type': 'application/json' };
  const payload = {
      Message :  "Reconect"
  }

  const payloadJson = JSON.stringify(payload)
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: payloadJson,
    });

    console.log(`Status da resposta: ${response.status} - ${response.statusText}`);

    if (response.ok) {
      console.log("Servidor encerrado com sucesso.");
      useSocket()
    } else {
      console.log(`Erro ao encerrar o servidor: ${response.status} - ${response.statusText}`);
      
      const errorResponse = await response.text();
      console.log('Resposta de erro: ', errorResponse);
    }
  } catch (error) {
    console.log('Resposta de erro: ');
    useSocket()
  }   
}
*/