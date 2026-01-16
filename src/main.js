const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, clipboard, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execFile, spawn } = require("child_process");

const SAMPLE_RATE = 16000;
const CHUNK_SEC = 1.0;
const OVERLAP_SEC = 0.2;
const CHUNK_SIZE = Math.round(SAMPLE_RATE * CHUNK_SEC);
const OVERLAP_SIZE = Math.round(SAMPLE_RATE * OVERLAP_SEC);

const WHISPER_BIN = path.join("bin", "whisper-cli");
const MODEL_PATH = path.join("models", "ggml-medium.bin");

let mainWindow = null;
let tray = null;
let isRecording = false;
let isQuitting = false;

let queue = [];
let isProcessing = false;

function log(message) {
  console.log(`[RTT] ${message}`);
  if (mainWindow) {
    mainWindow.webContents.send("status", message);
  }
}

function resolveWhisperPath() {
  if (path.isAbsolute(WHISPER_BIN)) {
    return WHISPER_BIN;
  }
  const basePath = app.isPackaged ? process.resourcesPath : app.getAppPath();
  return path.join(basePath, WHISPER_BIN);
}

function resolveModelPath() {
  if (path.isAbsolute(MODEL_PATH)) {
    return MODEL_PATH;
  }
  const basePath = app.isPackaged ? process.resourcesPath : app.getAppPath();
  return path.join(basePath, MODEL_PATH);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 360,
    height: 180,
    resizable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    show: true,
    frame: true,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const trayPath = path.join(app.getAppPath(), "assets", "tray.png");
  let trayImage = null;
  if (fs.existsSync(trayPath)) {
    trayImage = nativeImage.createFromPath(trayPath);
  } else {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <circle cx="8" cy="8" r="6" fill="black"/>
    </svg>`;
    trayImage = nativeImage.createFromDataURL(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
  }

  tray = new Tray(trayImage);
  tray.setToolTip("RTT Transcriber");
  tray.on("click", () => toggleWindowVisibility());
  tray.setContextMenu(buildTrayMenu());
}

function buildTrayMenu() {
  return Menu.buildFromTemplate([
    {
      label: isRecording ? "Stop (Alt+I)" : "Start (Alt+I)",
      click: () => toggleRecording(),
    },
    {
      label: mainWindow && mainWindow.isVisible() ? "Hide" : "Show",
      click: () => toggleWindowVisibility(),
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
}

function toggleWindowVisibility() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
  tray.setContextMenu(buildTrayMenu());
}

function toggleRecording() {
  isRecording = !isRecording;
  if (mainWindow) {
    mainWindow.webContents.send("set-recording", isRecording);
  }
  log(`Recording ${isRecording ? "started" : "stopped"}`);
  tray.setContextMenu(buildTrayMenu());
}

function registerShortcuts() {
  globalShortcut.register("Alt+Shift+I", () => {
    toggleRecording();
  });
}

function createWavBuffer(pcm16, sampleRate, channels) {
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcm16.byteLength;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  Buffer.from(pcm16.buffer, pcm16.byteOffset, pcm16.byteLength).copy(buffer, 44);
  return buffer;
}

function enqueueSegment(pcm16) {
  queue.push(pcm16);
  if (queue.length % 5 === 0) {
    log(`Queued segments: ${queue.length}`);
  }
  processQueue();
}

function processQueue() {
  if (isProcessing || queue.length === 0) {
    return;
  }
  isProcessing = true;
  const pcm16 = queue.shift();
  transcribeSegment(pcm16)
    .catch((error) => {
      if (mainWindow) {
        mainWindow.webContents.send("status", `Whisper error: ${error.message}`);
      }
    })
    .finally(() => {
      isProcessing = false;
      processQueue();
    });
}

async function transcribeSegment(pcm16) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "rtt-"));
  const wavPath = path.join(tempDir, "segment.wav");
  const outBase = path.join(tempDir, "segment");
  const outTxt = `${outBase}.txt`;

  const wavBuffer = createWavBuffer(pcm16, SAMPLE_RATE, 1);
  fs.writeFileSync(wavPath, wavBuffer);

  const whisperPath = resolveWhisperPath();
  const modelPath = resolveModelPath();
  const args = ["-m", modelPath, "-f", wavPath, "-otxt", "-of", outBase, "-np"];

  log(`Running whisper-cli on ${wavPath}`);
  await new Promise((resolve, reject) => {
    execFile(whisperPath, args, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve();
    });
  });

  let text = "";
  if (fs.existsSync(outTxt)) {
    text = fs.readFileSync(outTxt, "utf8").trim();
  }

  fs.rmSync(tempDir, { recursive: true, force: true });

  if (text && mainWindow) {
    clipboard.writeText(text);
    await pasteClipboard();
    mainWindow.webContents.send("transcript", text);
  } else {
    log("Whisper returned empty text.");
  }
}

function pasteClipboard() {
  return new Promise((resolve) => {
    if (process.platform !== "linux") {
      resolve();
      return;
    }

    log("Pasting via xdotool.");
    const child = spawn("xdotool", ["key", "--clearmodifiers", "ctrl+v"]);
    child.on("error", () => {
      if (mainWindow) {
        mainWindow.webContents.send(
          "status",
          "xdotool not found. Clipboard updated; install xdotool for auto-paste."
        );
      }
      resolve();
    });
    child.on("exit", () => resolve());
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  registerShortcuts();
  log(`App path: ${app.getAppPath()}`);
  log(`Packaged: ${app.isPackaged}`);
  log(`Resources: ${process.resourcesPath}`);
  log(`Whisper bin: ${resolveWhisperPath()}`);
  log(`Model path: ${resolveModelPath()}`);

  ipcMain.on("toggle-recording", () => {
    toggleRecording();
  });

  ipcMain.on("segment", (event, arrayBuffer) => {
    if (!isRecording || !arrayBuffer) return;
    const pcm16 = new Int16Array(arrayBuffer);
    enqueueSegment(pcm16);
  });

  ipcMain.on("update-recording", (event, recording) => {
    isRecording = Boolean(recording);
    tray.setContextMenu(buildTrayMenu());
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
