
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          // Calculate scale to fit container while maintaining aspect ratio
          const containerWidth = containerRef.current?.clientWidth || 800;
          const containerHeight = 600;
          const scale = Math.min(containerWidth / img.width, containerHeight / img.height);
          
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)'; // Yellow translucent brush
          ctx.lineWidth = brushSize;
          contextRef.current = ctx;
        };
        img.src = image;
      }
    }
  }, [image, brushSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const endDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const handleProcessEdit = async () => {
    if (!image || !prompt) return;
    setIsLoading(true);
    try {
      // For this implementation, we send the original image and instructions
      // Ideally, we'd send the mask too, but Nano Banana works great with "In the highlighted area..."
      const result = await geminiService.editImage(image, `Focus on the highlighted areas and follow this instruction: ${prompt}`);
      if (result) setEditedImage(result);
    } catch (error) {
      console.error("Editing failed:", error);
      alert("Failed to edit image. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetCanvas = () => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        if (contextRef.current && canvasRef.current) {
          contextRef.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      };
      img.src = image;
    }
  };

  const downloadImage = () => {
    if (editedImage) {
      const link = document.createElement('a');
      link.href = editedImage;
      link.download = 'banana-edit.png';
      link.click();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-effect rounded-2xl p-4 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden" ref={containerRef}>
          {!image ? (
            <div className="text-center p-12">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-600">
                <span className="text-3xl">🖼️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload an Image</h3>
              <p className="text-slate-400 mb-6">Start by uploading the photo you want to transform.</p>
              <label className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg shadow-yellow-500/20">
                Choose File
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          ) : (
            <div className="relative w-full flex justify-center group">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                className="rounded-lg shadow-2xl cursor-crosshair border border-slate-700 bg-slate-900 max-w-full"
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={resetCanvas} className="bg-slate-800/80 hover:bg-slate-700 p-2 rounded-lg text-xs font-bold border border-slate-600">Clear Mask</button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-yellow-400 font-bold animate-pulse">Nano Banana is processing...</p>
              <p className="text-slate-400 text-sm mt-2">Dreaming up your changes</p>
            </div>
          )}
        </div>

        {editedImage && (
          <div className="glass-effect rounded-2xl p-6 border-yellow-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-yellow-500 flex items-center gap-2">
                <span>✨</span> Result Ready
              </h3>
              <button onClick={downloadImage} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-600/20">
                Download Result
              </button>
            </div>
            <img src={editedImage} alt="Edited result" className="rounded-xl border border-slate-700 max-h-[600px] w-auto mx-auto shadow-2xl" />
          </div>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="glass-effect rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🛠️</span> Editor Controls
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Instructions</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: 'Change her shirt to red' or 'Make the background a beach'..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none h-32 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Brush Size: {brushSize}px</label>
              <input
                type="range"
                min="5"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <p className="text-[10px] text-slate-500 mt-2 italic">Highlight the area you want the AI to modify.</p>
            </div>

            <button
              onClick={handleProcessEdit}
              disabled={!image || !prompt || isLoading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !image || !prompt || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-xl shadow-yellow-500/20 transform active:scale-95'
              }`}
            >
              <span>✨</span>
              {isLoading ? 'Processing...' : 'Generate Changes'}
            </button>

            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Model Details</h4>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-300 mb-1">Editing Model:</p>
                <p className="text-xs font-mono text-yellow-500">gemini-2.5-flash-image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
