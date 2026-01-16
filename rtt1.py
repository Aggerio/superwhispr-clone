import os
import subprocess
import tempfile
import threading

import numpy as np
import sounddevice as sd
import wave

# Audio parameters
SR = 16000
CHUNK_SEC = 1.0  # process every 1 second
OVERLAP_SEC = 0.2  # 200 ms overlap
CHUNK_SIZE = int(SR * CHUNK_SEC)
OVERLAP_SIZE = int(SR * OVERLAP_SEC)

# Whisper parameters
WHISPER_BIN = "./whisper-cli"
MODEL_PATH = "./models/ggml-base.en.bin"
WHISPER_CMD_TEMPLATE = [
    WHISPER_BIN,
    "-m",
    MODEL_PATH,
    "-f",
    None,  # to be filled with .wav path
    "-otxt",
    "-of",
    None,  # to be filled with base output path
    "-np",
]

# Rolling buffer of PCM samples
buffer = np.zeros((0,), dtype="int16")
lock = threading.Lock()


def run_whisper(wav_path, out_base):
    """Run whisper-cli and print its text if successful."""
    cmd = WHISPER_CMD_TEMPLATE.copy()
    cmd[4] = wav_path
    cmd[7] = out_base

    try:
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        txt_path = out_base + ".txt"
        if os.path.isfile(txt_path):
            with open(txt_path, "r") as f:
                text = f.read().strip()
                print("\n📄", text)
            os.remove(txt_path)
    except subprocess.CalledProcessError as e:
        print("❌ Whisper error:", e.stderr.strip())


def audio_callback(indata, frames, time, status):
    global buffer
    if status:
        print("⚠️", status, flush=True)

    # Append new audio
    with lock:
        buffer = np.concatenate((buffer, indata.flatten()))

        # Once we have >= chunk + overlap, process it
        if buffer.shape[0] >= CHUNK_SIZE + OVERLAP_SIZE:
            # Extract the last CHUNK+OVERLAP samples
            segment = buffer[-(CHUNK_SIZE + OVERLAP_SIZE) :]

            # Keep only the last OVERLAP for next time
            buffer = buffer[-OVERLAP_SIZE:]

            # Offload to a thread so we don't block the audio callback
            threading.Thread(target=process_segment, args=(segment,)).start()


def process_segment(segment):
    # Write segment to a temp WAV
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        wav_path = tmp.name
    out_base = wav_path[:-4]

    with wave.open(wav_path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(segment.tobytes())

    # Transcribe
    run_whisper(wav_path, out_base)

    # Clean up WAV
    os.remove(wav_path)


def main():
    print("🎙️  Real-time (1 s chunks, 200 ms overlap) transcription starting…")
    with sd.InputStream(
        samplerate=SR,
        channels=1,
        dtype="int16",
        blocksize=CHUNK_SIZE,
        callback=audio_callback,
    ):
        print("Press Ctrl+C to stop.")
        try:
            while True:
                sd.sleep(1000)
        except KeyboardInterrupt:
            print("\n🛑 Stopped.")


if __name__ == "__main__":
    main()
