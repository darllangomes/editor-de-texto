const {app, BrowserWindow, Menu, dialog, ipcMain, Main} = require('electron');
const fs = require('fs');
const path = require('path');



let mainWindow = null;
async function createWindow(){
    mainWindow = new BrowserWindow({
        width:720, height:600,
        webPreferences:{
            nodeIntegration:true
        }

    });

    await mainWindow.loadFile('src/pages/editor/index.html');
    //mainWindow.webContents.openDevTools();
    createNewFile();
    ipcMain.on('update-content',function(event,data){
     file.content = data;
    });
    file.content = data;
}

var file = {}

function writeFile(filePath){
    try{
        fs.writeFile(filePath,file.content, function(error){
         if(error) throw error; 
         
         file.path = filePath;
         file.saved = true;
         file.name = path.basename(filePath);

         mainWindow.webContents.send('set-file',file);
        });
    }catch(e){
        console.log(e);
    }
}


function createNewFile(){
    file = {
        name: "novo-arquivo.txt",
        content:'',
        saved: false,
        path: app.getPath('desktop')+'/novo-arquivo.txt'
    };
    mainWindow.webContents.send('set-file',file);
};

async function saveFileAs(){
    let dialogFile = await dialog.showSaveDialog({
     defaultPath: file.path
    });

    if(dialogFile.canceled){
        return false;
    }
     writeFile(dialogFile.filePath);
}

function saveFile(){
    if(file.saved){
        return writeFile(file.path);
    }
    return saveFileAs();
}

function readFile(filePath){
    try{
        return fs.readFileSync(filePath,'utf-8');
    }catch(e){
        console.log(e);
        return '';
    }
}

async function openFile(){
    let dialogFile = await dialog.showOpenDialog({
        defaultPath: file.path
    });

    if(dialogFile.canceled) return false;

    file = {
        name: path.basename(dialogFile.filePaths[0]),
        content: readFile(dialogFile.filePaths[0]),
        saved: true,
        path: dialogFile.filePaths[0]
    }

    mainWindow.webContents.send('set-file',file);
}

const templateMenu = [
    {
        label:'Arquivo',
        submenu: [
            {
                label: 'Novo',
                click(){
                    createNewFile();
                }
            },
            {
                label: 'Abrir',
                click(){
                    openFile();
                }
            },
            {
                label: "Salvar"
            },
            {
                label: 'Salvar como',
                click(){
                    saveFileAs();
                }
            },
            {
                label: 'Fechar',
                role: process.platform === 'darwin' ? 'close' : 'quit'
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(templateMenu);

Menu.setApplicationMenu(menu);


app.whenReady().then(createWindow);

app.on('activate,', () =>{
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
});