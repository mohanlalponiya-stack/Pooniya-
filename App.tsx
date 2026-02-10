
import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import Header from './components/Header';
import ImageEditor from './components/ImageEditor';
import ImageGenerator from './components/ImageGenerator';
import ChatBot from './components/ChatBot';
import FastAssistant from './components/FastAssistant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.EDITOR);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check for API key only if using Pro features, but for this app, we check generally
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        // Fallback for environments where key is pre-injected
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true); // Assume success per requirements
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.EDITOR:
        return <ImageEditor />;
      case AppTab.GENERATOR:
        return <ImageGenerator hasApiKey={hasApiKey} onSelectKey={handleSelectKey} />;
      case AppTab.CHAT:
        return <ChatBot />;
      case AppTab.ASSISTANT:
        return <FastAssistant />;
      default:
        return <ImageEditor />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-auto container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>

      <footer className="py-4 text-center text-slate-500 text-sm border-t border-slate-800 bg-slate-900/50">
        © 2025 Mohan Lal jaat AI • Powered by Gemini & Nano Banana
      </footer>
    </div>
  );
};

export default App;
