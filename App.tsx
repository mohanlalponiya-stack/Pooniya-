import { useState } from "react";
import { ImageCanvas } from "./components/ImageCanvas";
import { Button } from "./components/Button";

export default function App() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [brushSize, setBrushSize] = useState(45);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#f8fafc",
        padding: 16,
        boxSizing: "border-box"
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Mohan Lal jaat</h2>
        <p style={{ opacity: 0.7, margin: 0 }}>CREATIVE AI SUITE</p>
      </div>

      {/* Upload */}
      {!image && (
        <div
          style={{
            maxWidth: 360,
            margin: "0 auto",
            background: "#1e293b",
            padding: 20,
            borderRadius: 12,
            textAlign: "center"
          }}
        >
          <p>Ready to Edit?</p>

          <input
            type="file"
            accept="image/*"
            hidden
            id="fileInput"
            onChange={(e) => {
              if (e.target.files?.[0]) setImage(e.target.files[0]);
            }}
          />

          <label htmlFor="fileInput">
            <Button text="Choose File" />
          </label>

          <div style={{ marginTop: 12 }}>
            <Button text="Live Camera" variant="secondary" />
          </div>
        </div>
      )}

      {/* Editor */}
      {image && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            maxWidth: 900,
            margin: "0 auto"
          }}
        >
          <ImageCanvas image={image} brushSize={brushSize} />

          <div
            style={{
              background: "#1e293b",
              padding: 16,
              borderRadius: 12
            }}
          >
            <h3>Edit Controls</h3>

            <textarea
              style={{
                width: "100%",
                minHeight: 80,
                background: "#020617",
                color: "white",
                borderRadius: 8,
                padding: 8,
                border: "none"
              }}
              placeholder="Describe the changes for marked areas..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div style={{ marginTop: 12 }}>
              <label>Brush Size: {brushSize}px</label>
              <input
                type="range"
                min={10}
                max={100}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <Button text="Apply AI Edits" disabled />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
