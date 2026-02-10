
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

const FastAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickTask = async (task: string) => {
    setIsLoading(true);
    try {
      const result = await geminiService.fastAssistant(task);
      setResponse(result);
    } catch (error) {
      console.error("Fast assistant error:", error);
      setResponse("Fast request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Write a caption for a sunset photo",
    "List 5 creative photo prompt ideas",
    "Explain rule of thirds in photography",
    "Summarize color theory for artists"
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <span className="text-yellow-500">⚡</span> Fast Assistant
        </h2>
        <p className="text-slate-400">Ultra low-latency responses powered by Gemini 2.5 Flash Lite.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setPrompt(s);
              handleQuickTask(s);
            }}
            className="glass-effect hover:bg-slate-700/50 p-4 rounded-xl text-left text-sm font-medium border border-slate-800 hover:border-yellow-500/30 transition-all group"
          >
            <span className="text-yellow-500 mr-2 group-hover:animate-pulse">▶</span> {s}
          </button>
        ))}
      </div>

      <div className="glass-effect rounded-2xl p-6 space-y-6">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickTask(prompt)}
            placeholder="Type a quick question or instruction..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 pr-32 focus:ring-2 focus:ring-yellow-500 outline-none shadow-inner"
          />
          <button
            onClick={() => handleQuickTask(prompt)}
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 top-2 bottom-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {isLoading ? '...' : 'Go'}
          </button>
        </div>

        {(response || isLoading) && (
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 min-h-[100px] relative">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-4">Response</h4>
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-slate-800 rounded animate-pulse w-2/3"></div>
              </div>
            ) : (
              <p className="text-slate-200 leading-relaxed">{response}</p>
            )}
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono">2.5-flash-lite</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FastAssistant;
