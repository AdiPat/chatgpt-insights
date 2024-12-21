import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(join(__dirname, "../public/index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("process-file", async (event: any, filePath: string) => {
  try {
    const { processFile } = require("./processor-wrapper");
    return await processFile(filePath);
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
});
