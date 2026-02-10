import { useState } from "react";
import { ImageCanvas } from "./components/ImageCanvas";
import { Button } from "./components/Button";

export default function App() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [brushSize, setBrushSize] = useState(45);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center px-4">
      {/* Header */}
      <div className="w-full max-w-3xl py-4 text-center">
        <h1 className="text-2xl font-bold">Mohan Lal jaat</h1>
        <p className="text-sm opacity-70">CREATIVE AI SUITE</p>
      </div>

      {/* Upload Section */}
      {!image && (
        <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md text-center">
          <p className="text-lg mb-4">Ready to Edit?</p>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />

          <label htmlFor="fileInput">
            <Button text="Choose File" />
          </label>

          <div className="mt-3">
            <Button text="Live Camera" variant="secondary" />
          </div>
        </div>
      )}

      {/* Editor Section */}
      {image && (
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 mt-6">
          {/* Canvas */}
          <ImageCanvas image={image} brushSize={brushSize} />

          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-5">
            <h2 className="font-semibold mb-3">Edit Controls</h2>

            <textarea
              className="w-full p-3 rounded-lg bg-slate-900 text-sm outline-none"
              placeholder="Describe the changes for marked areas..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              {[
                "Change the color to vibrant blue",
                "Remove this object",
                "Replace background with a forest",
                "Make this area look like metal",
                "Add a cute cat here"
              ].map((text) => (
                <button
                  key={text}
                  className="bg-slate-700 px-3 py-1 rounded-full hover:bg-slate-600"
                  onClick={() => setPrompt(text)}
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Brush Size */}
            <div className="mt-5">
              <label className="text-xs opacity-70">
                Brush Size: {brushSize}px
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Apply Button (जैसा पहले था) */}
            <div className="mt-6">
              <Button text="Apply AI Edits" disabled />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
