
export enum AppTab {
  EDITOR = 'EDITOR',
  GENERATOR = 'GENERATOR',
  CHAT = 'CHAT',
  ASSISTANT = 'ASSISTANT'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GenerationSettings {
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  imageSize: "1K" | "2K" | "4K";
}

export interface EditedImage {
  id: string;
  url: string;
  prompt: string;
}

// Fixed: Define the interface to match what the compiler expects for 'AIStudio'
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    // Fixed: Remove optionality to match the environment's existing declaration.
    // This resolves the error: Subsequent property declarations must have the same type.
    aistudio: AIStudio;
  }
}