import React from 'react';
import { ClipboardCopy } from 'lucide-react';
import { CommandBlockProps } from '../types';

const TerminalBlock: React.FC<CommandBlockProps> = ({ title = "bash", commands }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(commands.join('\n'));
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-800 bg-[#0c0c0c] shadow-2xl my-4 group">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-gray-400 font-mono">{title}</span>
        <button 
          onClick={handleCopy}
          className="text-gray-500 hover:text-neon-blue transition-colors"
          title="Copy to clipboard"
        >
          <ClipboardCopy size={14} />
        </button>
      </div>
      <div className="p-4 font-mono text-sm overflow-x-auto">
        {commands.map((cmd, idx) => (
          <div key={idx} className="flex mb-2 last:mb-0">
            <span className="text-neon-blue mr-3 select-none">$</span>
            <span className="text-gray-300 whitespace-pre-wrap">{cmd}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalBlock;