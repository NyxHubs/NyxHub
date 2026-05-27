const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')

let mainWindow

function createWindow(){
  Menu.setApplicationMenu(null)

  mainWindow = new BrowserWindow({
    width: 1536,
    height: 960,
    minWidth: 980,
    minHeight: 620,
    frame: false,
    backgroundColor: '#030006',
    title: 'NyxHub',
    icon: path.join(__dirname, '../public/assets/icon.ico'),
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname,'preload.js')
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  if(app.isPackaged) mainWindow.loadFile(path.join(__dirname,'../dist/index.html'))
  else mainWindow.loadURL('http://localhost:5173')
}

ipcMain.on('window:minimize',()=>mainWindow?.minimize())
ipcMain.on('window:maximize',()=>{
  if(!mainWindow) return
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
})
ipcMain.on('window:close',()=>app.quit())

app.whenReady().then(createWindow)
app.on('window-all-closed',()=>{ if(process.platform!=='darwin') app.quit() })
