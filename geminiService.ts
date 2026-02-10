
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { GenerationSettings } from "../types";

// Helper to ensure we always use the latest API key from the environment
// Fixed: Use process.env.API_KEY directly as a named parameter per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * General Image Editing using Gemini 2.5 Flash Image (Nano Banana)
   */
  async editImage(base64Image: string, prompt: string): Promise<string | null> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  /**
   * High-quality Image Generation using Gemini 3 Pro Image (Nano Banana Pro)
   */
  async generateImagePro(prompt: string, settings: GenerationSettings): Promise<string | null> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio,
          imageSize: settings.imageSize
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  /**
   * Intelligent Chatbot using Gemini 3 Pro
   */
  async chatStream(message: string, history: { role: 'user' | 'model'; text: string }[]) {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are a helpful, professional AI creative assistant specializing in digital art and image processing."
      }
    });

    // Fixed: sendMessageStream only accepts the message parameter, not contents
    return await chat.sendMessageStream({ message });
  },

  /**
   * Low-latency Assistant using Gemini 2.5 Flash Lite
   */
  async fastAssistant(prompt: string): Promise<string> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      // Fixed: Use correct model identifier string for flash lite
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for lowest latency
      }
    });
    return response.text || "No response received.";
  }
};
