# RTT Speech App

A tray-based real-time transcription application built with Electron that uses whisper.cpp for speech-to-text conversion. The app records audio in real-time, transcribes it using Whisper models, and automatically pastes the results into your active application.

## Features

- **Real-time audio capture** - Records audio from your microphone
- **Live transcription** - Transcribes speech using whisper.cpp with configurable models
- **Auto-paste** - Automatically copies transcriptions to clipboard and pastes them (via xdotool on Linux)
- **Chunked processing** - Processes audio in 1-second chunks with 200ms overlap for low latency
- **Keyboard shortcuts** - Quick toggle with `Alt+Shift+I`
- **System tray integration** - Runs in the background with a system tray icon
- **Minimal UI** - Small, always-on-top window for status and control

## Prerequisites

- **Node.js** (v14 or higher) and npm
- **whisper-cli** binary (from whisper.cpp) - must be placed in `bin/whisper-cli`
- **Whisper model file** - must be placed in `models/` directory (e.g., `ggml-medium.bin`)
- **xdotool** (optional, for auto-paste on Linux) - install with `sudo apt install xdotool` or equivalent

## Installation

1. **Clone or download this repository**

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Set up whisper.cpp:**
   - Build or download the `whisper-cli` binary from [whisper.cpp](https://github.com/ggerganov/whisper.cpp)
   - Place it in the `bin/` directory as `bin/whisper-cli`
   - Make sure it's executable: `chmod +x bin/whisper-cli`

4. **Download a Whisper model:**
   - Download a model from the [whisper.cpp releases](https://github.com/ggerganov/whisper.cpp/releases) or use the model downloader
   - Place the model file (e.g., `ggml-medium.bin`) in the `models/` directory
   - Update `MODEL_PATH` in `src/main.js` if using a different model name

5. **Install xdotool (for auto-paste on Linux):**
   ```bash
   sudo apt install xdotool  # Debian/Ubuntu
   # or
   sudo pacman -S xdotool    # Arch Linux
   # or equivalent for your distribution
   ```

## Usage

### Starting the Application

```bash
npm start
```

The application will:
- Create a system tray icon
- Open a small control window (can be hidden/shown via tray menu)
- Start listening for keyboard shortcuts

### Controls

- **Start/Stop Recording:**
  - Click the "Start" button in the window
  - Use keyboard shortcut: `Alt+Shift+I`
  - Right-click tray icon → "Start" or "Stop"

- **Show/Hide Window:**
  - Click the tray icon
  - Right-click tray icon → "Show" or "Hide"

- **Quit:**
  - Right-click tray icon → "Quit"

### How It Works

1. When recording starts, the app captures audio from your default microphone
2. Audio is processed in 1-second chunks with 200ms overlap
3. Each chunk is sent to whisper-cli for transcription
4. Transcribed text is automatically copied to clipboard
5. If xdotool is available, the text is automatically pasted into the active application
6. Transcripts appear in the app's log window

## Project Structure

```
rtt_speech_app/
├── src/
│   ├── main.js           # Main Electron process (audio processing, whisper integration)
│   ├── preload.js         # Preload script for secure IPC
│   └── renderer/
│       ├── index.html     # UI markup
│       ├── renderer.js    # Renderer process (audio capture, UI logic)
│       └── style.css      # UI styles
├── bin/
│   └── whisper-cli        # whisper.cpp binary (not included, must be added)
├── models/
│   └── ggml-medium.bin    # Whisper model file (not included, must be added)
├── assets/
│   └── tray.png           # System tray icon
├── package.json           # Node.js dependencies and build config
└── README.md             # This file
```

## Building for Distribution

To create a distributable AppImage for Linux:

```bash
npm run dist
```

The built AppImage will be in the `dist/` directory. The build process includes:
- The whisper-cli binary
- The model file
- All necessary Electron files

**Note:** Make sure `bin/whisper-cli` and `models/ggml-medium.bin` exist before building.

## Configuration

### Audio Parameters

Edit these constants in `src/main.js` and `src/renderer/renderer.js`:

- `SAMPLE_RATE`: Audio sample rate (default: 16000 Hz)
- `CHUNK_SEC`: Processing chunk duration in seconds (default: 1.0)
- `OVERLAP_SEC`: Overlap between chunks in seconds (default: 0.2)

### Model Selection

Change the model by updating `MODEL_PATH` in `src/main.js`:

```javascript
const MODEL_PATH = path.join("models", "ggml-medium.bin");  // Change to your model
```

Available models (from smallest/fastest to largest/most accurate):
- `ggml-tiny.bin`
- `ggml-base.bin`
- `ggml-small.bin`
- `ggml-medium.bin`
- `ggml-large.bin`

## Troubleshooting

### "whisper-cli not found" error

- Ensure `bin/whisper-cli` exists and is executable
- Check that the path is correct in `src/main.js`
- For packaged apps, ensure the binary is included in `extraResources` in `package.json`

### "Model file not found" error

- Verify the model file exists in `models/` directory
- Check the filename matches `MODEL_PATH` in `src/main.js`
- Ensure the model file is included in the build if packaging

### Auto-paste not working

- Install xdotool: `sudo apt install xdotool`
- The app will still copy to clipboard even without xdotool
- Check console for xdotool error messages

### Microphone not working

- Grant microphone permissions to Electron
- Check system audio settings
- Verify your default microphone is working in other applications

### High CPU usage

- Use a smaller model (e.g., `ggml-base.bin` instead of `ggml-medium.bin`)
- Increase `CHUNK_SEC` to process larger chunks less frequently
- Close other resource-intensive applications

## Development

### Running in Development Mode

```bash
npm start
```

The app will use files from the project directory directly.

### Debugging

- Check the Electron DevTools console for renderer process logs
- Check terminal output for main process logs
- Use `console.log()` statements in both `main.js` and `renderer.js`

## License

[Add your license here]

## Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Uses [whisper.cpp](https://github.com/ggerganov/whisper.cpp) for transcription
- Inspired by OpenAI's Whisper model

## Notes

- The Python file `rtt1.py` appears to be a prototype/reference implementation
- The app is currently configured for Linux (AppImage build target)
- For other platforms, modify the build configuration in `package.json`
