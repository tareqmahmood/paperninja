const { app, BrowserWindow } = require('electron');

function createWindow () {
    // Create the browser window.
    let mainWindow = new BrowserWindow({
        // width: 800,
        // height: 600,
        webPreferences: {
            nodeIntegration: true,
            plugins: true
        },
    });

    mainWindow.maximize();
    mainWindow.setMenuBarVisibility(false);

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);
