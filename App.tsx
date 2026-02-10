
import React, { useState, useCallback, useRef } from 'react';
import { Button } from './components/Button';
import { ImageCanvas } from './components/ImageCanvas';
import { editImageWithAI } from './services/geminiService';
import { EditorState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<EditorState>({
    originalImage: null,
    editedImage: null,
    isProcessing: false,
    brushSize: 40,
    prompt: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setState(prev => ({ 
          ...prev, 
          originalImage: e.target?.result as string, 
          editedImage: null,
          prompt: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyEdit = async () => {
    if (!state.originalImage || !state.prompt) return;

    setState(prev => ({ ...prev, isProcessing: true }));
    try {
      const result = await editImageWithAI(state.originalImage, state.prompt);
      if (result) {
        setState(prev => ({ ...prev, editedImage: result }));
      }
    } catch (error) {
      alert("Oops! Something went wrong with the AI processing. Please try again.");
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const downloadResult = () => {
    if (!state.editedImage) return;
    const link = document.createElement('a');
    link.href = state.editedImage;
    link.download = `banana-edit-${Date.now()}.png`;
    link.click();
  };

  const resetEditor = () => {
    setState({
      originalImage: null,
      editedImage: null,
      isProcessing: false,
      brushSize: 40,
      prompt: '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col gap-6 overflow-y-auto z-20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
             <span className="text-2xl">🍌</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">BananaEdit <span className="text-yellow-500">AI</span></h1>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">
            1. Source Image
          </label>
          {state.originalImage ? (
             <Button variant="secondary" className="w-full" onClick={() => fileInputRef.current?.click()}>
               Change Image
             </Button>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all"
            >
              <div className="mx-auto w-12 h-12 mb-3 bg-slate-800 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              </div>
              <p className="text-sm text-slate-400 font-medium">Click to upload photo</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP</p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {state.originalImage && (
          <div className="space-y-6 flex-1">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">
                2. Selection Tool
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Brush Size</span>
                  <span>{state.brushSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={state.brushSize}
                  onChange={(e) => setState(prev => ({ ...prev, brushSize: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">
                3. Edit Prompt
              </label>
              <textarea 
                placeholder="e.g. Change the shirt to red, add sunglasses, or remove the background..."
                value={state.prompt}
                onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-600 resize-none"
              />
            </div>

            <Button 
              className="w-full py-4 text-lg"
              onClick={handleApplyEdit}
              isLoading={state.isProcessing}
              disabled={!state.prompt || state.isProcessing}
            >
              Generate Edit
            </Button>
            
            <Button variant="ghost" className="w-full" onClick={resetEditor}>
              Start Over
            </Button>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <main className="flex-1 relative flex flex-col bg-slate-950 p-4 md:p-8 h-full overflow-hidden">
        {state.isProcessing && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Gemini is working...</h2>
            <p className="text-slate-400 max-w-sm">
              Analyzing your image and applying your edits. This usually takes 5-10 seconds.
            </p>
          </div>
        )}

        {state.editedImage ? (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-500">
            <div className="relative group max-h-[80%] max-w-full rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-800">
              <img 
                src={state.editedImage} 
                alt="AI Result" 
                className="object-contain max-h-[70vh]" 
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                AI Generated
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <Button onClick={() => setState(prev => ({ ...prev, editedImage: null }))} variant="secondary">
                Back to Editor
              </Button>
              <Button onClick={downloadResult} className="bg-green-600 hover:bg-green-700">
                Download Result
              </Button>
            </div>
          </div>
        ) : state.originalImage ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
               <ImageCanvas 
                 imageSrc={state.originalImage} 
                 brushSize={state.brushSize} 
               />
            </div>
            <div className="mt-4 text-center">
               <p className="text-xs text-slate-500 italic">
                 "Selection is used as visual context for the AI. Describe your changes specifically in the prompt."
               </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-900 rounded-3xl m-8">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-300">No Image Selected</h3>
            <p className="max-w-xs text-center text-sm">
              Upload an image from the sidebar to start editing with Gemini AI.
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Hint for Mobile */}
      {!state.originalImage && (
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <Button 
            className="rounded-full w-16 h-16 shadow-2xl" 
            onClick={() => fileInputRef.current?.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;
