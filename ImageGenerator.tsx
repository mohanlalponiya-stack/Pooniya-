
import React, { useState } from 'react';
import { GenerationSettings } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  hasApiKey: boolean;
  onSelectKey: () => void;
}

const ImageGenerator: React.FC<Props> = ({ hasApiKey, onSelectKey }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '1:1',
    imageSize: '1K'
  });

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const imageUrl = await geminiService.generateImagePro(prompt, settings);
      setResult(imageUrl);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Error generating image. Ensure you've selected a valid API key for Gemini 3 Pro features.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Image Generator <span className="text-yellow-500 font-mono text-lg uppercase tracking-widest ml-2 border border-yellow-500/30 px-2 py-0.5 rounded">Pro</span></h2>
        <p className="text-slate-400">Harness the power of Gemini 3 Pro to create stunning high-resolution art.</p>
      </div>

      {!hasApiKey && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl text-center mb-8">
          <h3 className="text-yellow-500 font-bold mb-2">API Key Required for Pro Features</h3>
          <p className="text-sm text-slate-300 mb-4">Gemini 3 Pro Image requires a paid API key from a Google Cloud Project with billing enabled.</p>
          <button 
            onClick={onSelectKey}
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20"
          >
            Select API Key
          </button>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-xs text-slate-500 mt-3 underline">Learn about billing</a>
        </div>
      )}

      <div className="glass-effect rounded-2xl p-6 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-400">Describe what you want to create</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-lg focus:ring-2 focus:ring-yellow-500 outline-none h-32 resize-none shadow-inner"
            placeholder="A futuristic cyber-creation, hyper-realistic, 8k resolution..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400">Resolution</label>
            <div className="flex gap-2">
              {(['1K', '2K', '4K'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setSettings(s => ({ ...s, imageSize: size }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                    settings.imageSize === size 
                    ? 'bg-yellow-500 border-yellow-500 text-slate-900 shadow-md' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400">Aspect Ratio</label>
            <select
              value={settings.aspectRatio}
              onChange={(e) => setSettings(s => ({ ...s, aspectRatio: e.target.value as any }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="1:1">1:1 Square</option>
              <option value="16:9">16:9 Landscape</option>
              <option value="9:16">9:16 Portrait</option>
              <option value="4:3">4:3 Photo</option>
              <option value="3:4">3:4 Vertical</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt || !hasApiKey}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            isLoading || !prompt || !hasApiKey
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 shadow-xl shadow-yellow-500/30'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              Generating Pro Image...
            </>
          ) : (
            <>
              <span>🎨</span> Create Masterpiece
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="glass-effect rounded-2xl p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-yellow-500">Generated Art</h3>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = result;
                link.download = `mohan-lal-jaat-ai-${Date.now()}.png`;
                link.click();
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 font-bold transition-all"
            >
              💾 Download {settings.imageSize}
            </button>
          </div>
          <img src={result} alt="Generated" className="w-full rounded-xl border border-slate-700 shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
