import React, { useState, useRef } from 'react';
import { Button } from './components/Button';
// ImageCanvas TEMP disabled for debug
// import { ImageCanvas } from './components/ImageCanvas';
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
    if (!file) return;

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
  };

  const handleApplyEdit = async () => {
    if (!state.originalImage || !state.prompt) return;
    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      const result = await editImageWithAI(state.originalImage, state.prompt);
      if (result) {
        setState(prev => ({ ...prev, editedImage: result }));
      }
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="p-4 border-b border-slate-800">
        <h1 className="text-xl font-bold">BananaEdit <span className="text-yellow-500">AI</span></h1>
      </header>

      <main className="flex-1 p-6">
        {!state.originalImage && (
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center">
            <p className="mb-4">Click to upload image</p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              Choose Image
            </Button>
          </div>
        )}

        {state.originalImage && !state.editedImage && (
          <div className="space-y-4">
            {/* ImageCanvas disabled temporarily */}
            <div className="bg-slate-900 rounded-xl p-6 text-center text-slate-400">
              Canvas disabled for debug
            </div>

            <textarea
              value={state.prompt}
              onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3"
              placeholder="Describe your edit…"
            />

            <Button onClick={handleApplyEdit}>
              Generate Edit
            </Button>
          </div>
        )}

        {state.editedImage && (
          <div className="text-center">
            <img src={state.editedImage} className="max-w-full mx-auto rounded-xl" />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
