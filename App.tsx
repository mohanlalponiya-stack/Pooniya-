import { GoogleGenerativeAI } from "@google/genai";
import { useState } from "react";

const API_KEY = "AIzaSyD7FxoaQZQW-hBNzdBVjDpJtRWLZorLRYo"; // ❌ हटाई नहीं

const genAI = new GoogleGenerativeAI(API_KEY);

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(text);
      setResult(response.response.text());
    } catch (e) {
      setResult("❌ Error आया है, console देखो");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mohan Lal Jaat AI 🤖</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="कुछ लिखो..."
        style={{ width: "100%", height: 100 }}
      />

      <br /><br />

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
        {result}
      </pre>
    </div>
  );
}
