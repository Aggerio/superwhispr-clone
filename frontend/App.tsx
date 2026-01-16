import React from 'react';
import Navbar from './components/Navbar';
import TerminalBlock from './components/TerminalBlock';
import { 
  Mic, 
  Zap, 
  ClipboardCopy, 
  Cpu, 
  Layers, 
  Keyboard, 
  Download, 
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Github
} from './components/Icons';
import { Feature } from './types';

function App() {
  const features: Feature[] = [
    {
      title: 'Real-time Capture',
      description: 'Records audio directly from your default microphone with low-latency chunk processing.',
      icon: Mic,
    },
    {
      title: 'Whisper.cpp Engine',
      description: 'Uses high-performance C++ implementation of OpenAI\'s Whisper models for local inference.',
      icon: Cpu,
    },
    {
      title: 'Auto-Paste Integration',
      description: 'Transcribed text is automatically typed into your active application via xdotool integration.',
      icon: ClipboardCopy,
    },
    {
      title: 'System Tray App',
      description: 'Runs quietly in the background. Control it via a minimal UI or the system tray menu.',
      icon: Layers,
    },
    {
      title: 'Global Hotkeys',
      description: 'Toggle recording instantly from anywhere in your OS using Alt+Shift+I.',
      icon: Keyboard,
    },
    {
      title: 'Smart Chunking',
      description: 'Processes audio in 1-second chunks with overlap to ensure no word is missed.',
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-white selection:text-black">
      <Navbar />
      
      {/* Modern Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-grid z-0 opacity-40"></div>
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-white opacity-[0.03] blur-[100px] rounded-full z-0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Typography Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800 bg-gray-900/50 text-gray-400 text-xs font-medium mb-8 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Whisper.cpp Enabled
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                Dictation for <br className="hidden lg:block" />
                <span className="text-gray-500">power users.</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                System-wide speech-to-text that runs locally. No cloud latency, no data leaks, just instant typing in any window.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* <button className="px-8 py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <Download size={18} />
                  Download AppImage
                </button> */}
                <button className="px-8 py-3.5 bg-transparent border border-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                  <Github size={18} />
                  View Source
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-white" /> Linux Support
                  </div>
                  <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-white" /> Local Inference
                  </div>
                   <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-white" /> Open Source
                  </div>
              </div>
            </div>

            {/* Visual / Mockup */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none perspective-1000">
              <div className="relative transform lg:rotate-y-[-5deg] transition-transform duration-700 hover:rotate-0">
                  
                  {/* Floating Action Bar */}
                  <div className="absolute -right-8 -top-6 z-20 bg-[#111] border border-gray-700/50 rounded-lg p-4 shadow-2xl flex items-center gap-4 animate-float w-56 backdrop-blur-xl">
                      <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Status</div>
                          <div className="text-sm text-white font-medium">Recording...</div>
                      </div>
                  </div>

                  {/* Editor Window Mockup */}
                  <div className="bg-[#0c0c0c] border border-gray-800 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5">
                      <div className="flex items-center px-4 py-3 border-b border-gray-800 bg-[#0F0F0F]/50">
                          <div className="flex space-x-2">
                              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                          </div>
                          <div className="ml-4 flex items-center gap-2 text-xs text-gray-500 font-mono">
                            <span className="w-3 h-3 text-blue-500"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></span>
                            notes.md — ~/docs
                          </div>
                      </div>
                      <div className="p-8 font-mono text-sm text-gray-300 min-h-[320px] leading-relaxed">
                          <div className="flex gap-4">
                            <div className="text-gray-700 select-none text-right">1</div>
                            <div><span className="text-purple-400"># Project Roadmap</span></div>
                          </div>
                          <div className="flex gap-4">
                            <div className="text-gray-700 select-none text-right">2</div>
                            <div>&nbsp;</div>
                          </div>
                          <div className="flex gap-4">
                            <div className="text-gray-700 select-none text-right">3</div>
                            <div className="text-gray-500 italic">// Dictated with RTT Speech App</div>
                          </div>
                          <div className="flex gap-4">
                            <div className="text-gray-700 select-none text-right">4</div>
                            <div>&nbsp;</div>
                          </div>
                          <div className="flex gap-4">
                            <div className="text-gray-700 select-none text-right">5</div>
                            <div>- <span className="text-blue-400">[x]</span> Implement local whisper model</div>
                          </div>
                          <div className="flex gap-4">
                            <div className="text-gray-700 select-none text-right">6</div>
                            <div>- <span className="text-blue-400">[ ]</span> Add system tray support</div>
                          </div>
                          <div className="flex gap-4">
                            <div className="text-gray-700 select-none text-right">7</div>
                            <div>- <span className="text-blue-400">[ ]</span> <span className="text-white border-r-2 border-white pr-1 animate-pulse">Release version 1.0</span></div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400">Everything you need for seamless dictation workflow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl">
                <div className="w-12 h-12 bg-gray-900/50 rounded-lg flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Architecture */}
      <section id="how-it-works" className="py-24 bg-[#080808] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Under the Hood
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                The application bridges the gap between raw audio and your active workspace using a highly optimized pipeline.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Capture", desc: "Audio is captured in 1-second chunks with 200ms overlap to ensure context integrity." },
                  { title: "Process", desc: "Chunks are sent to the local whisper-cli binary for inference using GGML models." },
                  { title: "Execute", desc: "Text is cleaned and piped to xdotool to simulate keystrokes in your target window." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 border border-gray-800 text-gray-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors flex items-center justify-center font-mono text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{step.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 relative">
               {/* Abstract visual representation of the pipeline */}
               <div className="relative rounded-xl bg-[#0c0c0c] border border-white/5 p-6 backdrop-blur-sm">
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-white opacity-[0.02] blur-2xl rounded-full"></div>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="p-4 border border-gray-800 bg-[#111] rounded text-gray-300 flex justify-between items-center">
                      <span>Input (Mic)</span>
                      <span className="text-xs text-gray-600">PCM Stream</span>
                    </div>
                    <div className="flex justify-center"><div className="h-6 w-[1px] bg-gray-800"></div></div>
                    <div className="p-4 border border-white/10 bg-[#151515] rounded text-white flex justify-between items-center shadow-lg">
                      <span>Whisper Engine</span>
                      <span className="text-xs text-gray-500">ggml-medium.bin</span>
                    </div>
                    <div className="flex justify-center"><div className="h-6 w-[1px] bg-gray-800"></div></div>
                    <div className="p-4 border border-gray-800 bg-[#111] rounded text-gray-300 flex justify-between items-center">
                      <span>Active Window</span>
                      <span className="text-xs text-gray-600">xdotool</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="install" className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Installation & Setup</h2>
            <p className="text-gray-400 mt-2">Get up and running in minutes.</p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-white text-black text-xs font-bold">1</span>
                Clone & Install Dependencies
              </h3>
              <TerminalBlock 
                commands={[
                  "git clone https://github.com/Aggerio/superwhispr-clone",
                  "cd superwhispr-clone",
                  "npm install"
                ]} 
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-white text-black text-xs font-bold">2</span>
                Setup Whisper Binary & Models
              </h3>
              <p className="text-sm text-gray-500 mb-4 pl-9">
                Ensure <code>bin/whisper-cli</code> is executable and your model is in <code>models/</code>.
              </p>
              <TerminalBlock 
                title="setup"
                commands={[
                  "mkdir -p bin models",
                  "# Place whisper-cli in bin/",
                  "chmod +x bin/whisper-cli",
                  "# Download model to models/ggml-medium.bin"
                ]} 
              />
            </div>
             
             <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded bg-white text-black text-xs font-bold">3</span>
                Install System Tools (Linux)
              </h3>
              <TerminalBlock 
                commands={[
                  "sudo apt install xdotool  # Debian/Ubuntu",
                  "npm start                 # Run application"
                ]} 
              />
            </div>
          </div>

          <div className="mt-12 p-6 bg-[#0a0a0a] border border-gray-800 rounded-lg">
             <h4 className="text-white font-bold mb-4">Configuration</h4>
             <p className="text-sm text-gray-400 mb-4">
                You can tweak performance by editing constants in <code>src/main.js</code>:
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-black p-3 rounded border border-gray-800">
                  <span className="block text-xs text-gray-500 uppercase">Sample Rate</span>
                  <span className="text-white font-mono">16000 Hz</span>
               </div>
               <div className="bg-black p-3 rounded border border-gray-800">
                  <span className="block text-xs text-gray-500 uppercase">Chunk Size</span>
                  <span className="text-white font-mono">1.0 sec</span>
               </div>
               <div className="bg-black p-3 rounded border border-gray-800">
                  <span className="block text-xs text-gray-500 uppercase">Overlap</span>
                  <span className="text-white font-mono">0.2 sec</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshoot" className="py-24 bg-[#050505] border-t border-white/5">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Troubleshooting</h2>
            
            <div className="grid gap-6">
               <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-lg hover:border-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                     <AlertTriangle className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                     <div>
                        <h4 className="text-white font-bold text-lg">whisper-cli not found</h4>
                        <p className="text-gray-400 mt-2 leading-relaxed">Ensure the binary is in <code>bin/</code> and is executable. In <code>src/main.js</code>, verify the path matches your structure.</p>
                     </div>
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-lg hover:border-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                     <AlertTriangle className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                     <div>
                        <h4 className="text-white font-bold text-lg">Auto-paste not working</h4>
                        <p className="text-gray-400 mt-2 leading-relaxed">
                           The app copies text to the clipboard by default. For auto-typing on Linux, you must install <code>xdotool</code>.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-lg hover:border-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                     <AlertTriangle className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                     <div>
                        <h4 className="text-white font-bold text-lg">High CPU Usage</h4>
                        <p className="text-gray-400 mt-2 leading-relaxed">
                           Whisper is intensive. Try switching from <code>medium</code> to <code>base</code> or <code>tiny</code> models in the <code>models/</code> directory for better performance.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
               <Mic className="text-black w-3 h-3" />
            </div>
            <span className="font-bold text-gray-300">RTT Speech App</span>
          </div>
          
          <div className="text-gray-600 text-sm">
            MIT License &copy; {new Date().getFullYear()}
          </div>
          
          <div className="flex space-x-6">
             <a href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors">Report Issue</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;