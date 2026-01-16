const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");
const toggleBtn = document.getElementById("toggleBtn");

const SAMPLE_RATE = 16000;
const CHUNK_SEC = 1.0;
const OVERLAP_SEC = 0.2;
const CHUNK_SIZE = Math.round(SAMPLE_RATE * CHUNK_SEC);
const OVERLAP_SIZE = Math.round(SAMPLE_RATE * OVERLAP_SEC);

let isRecording = false;
let audioContext = null;
let mediaStream = null;
let processor = null;
let pcmBuffer = new Int16Array(0);

function setStatus(text, running) {
  statusEl.textContent = text;
  statusEl.classList.toggle("running", Boolean(running));
}

function appendLog(text) {
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = text;
  logEl.prepend(line);

  const maxLines = 6;
  while (logEl.childElementCount > maxLines) {
    logEl.removeChild(logEl.lastChild);
  }
}

function updateButton() {
  toggleBtn.textContent = isRecording ? "Stop (Alt+I)" : "Start (Alt+I)";
}

async function startRecording() {
  if (isRecording) return;

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    console.log(`[RTT] AudioContext sample rate: ${audioContext.sampleRate}`);
    const source = audioContext.createMediaStreamSource(mediaStream);
    processor = audioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      const downsampled = downsampleBuffer(input, audioContext.sampleRate, SAMPLE_RATE);
      if (!downsampled || downsampled.length === 0) return;
      const pcm16 = floatTo16BitPCM(downsampled);
      appendPcm(pcm16);
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    isRecording = true;
    window.rttApi.updateRecording(true);
    setStatus("Recording", true);
    updateButton();
    appendLog("Mic capture started.");
  } catch (error) {
    setStatus("Mic error", false);
    appendLog(`Mic error: ${error.message}`);
  }
}

function stopRecording() {
  if (!isRecording) return;
  isRecording = false;

  if (processor) {
    processor.disconnect();
    processor = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }

  pcmBuffer = new Int16Array(0);
  window.rttApi.updateRecording(false);
  setStatus("Idle", false);
  updateButton();
  appendLog("Mic capture stopped.");
}

function appendPcm(pcm16) {
  const combined = new Int16Array(pcmBuffer.length + pcm16.length);
  combined.set(pcmBuffer, 0);
  combined.set(pcm16, pcmBuffer.length);
  pcmBuffer = combined;

  while (pcmBuffer.length >= CHUNK_SIZE + OVERLAP_SIZE) {
    const start = pcmBuffer.length - (CHUNK_SIZE + OVERLAP_SIZE);
    const segment = pcmBuffer.slice(start);
    pcmBuffer = pcmBuffer.slice(pcmBuffer.length - OVERLAP_SIZE);
    appendLog(`Sending segment (${segment.length} samples).`);
    window.rttApi.sendSegment(segment.buffer);
  }
}

function downsampleBuffer(buffer, inputSampleRate, outputSampleRate) {
  if (outputSampleRate === inputSampleRate) {
    return buffer;
  }
  if (outputSampleRate > inputSampleRate) {
    return buffer;
  }

  const sampleRateRatio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i += 1) {
      accum += buffer[i];
      count += 1;
    }
    result[offsetResult] = accum / count;
    offsetResult += 1;
    offsetBuffer = nextOffsetBuffer;
  }

  return result;
}

function floatTo16BitPCM(float32Array) {
  const output = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i += 1) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}

toggleBtn.addEventListener("click", () => {
  window.rttApi.toggleRecording();
});

window.rttApi.onSetRecording((recording) => {
  if (recording) {
    startRecording();
  } else {
    stopRecording();
  }
});

window.rttApi.onTranscript((text) => {
  appendLog(text);
});

window.rttApi.onStatus((message) => {
  appendLog(message);
});

updateButton();
