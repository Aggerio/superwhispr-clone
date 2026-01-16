const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("rttApi", {
  toggleRecording: () => ipcRenderer.send("toggle-recording"),
  sendSegment: (arrayBuffer) => ipcRenderer.send("segment", arrayBuffer),
  updateRecording: (recording) => ipcRenderer.send("update-recording", recording),
  onSetRecording: (callback) => ipcRenderer.on("set-recording", (_, value) => callback(value)),
  onTranscript: (callback) => ipcRenderer.on("transcript", (_, text) => callback(text)),
  onStatus: (callback) => ipcRenderer.on("status", (_, message) => callback(message)),
});
