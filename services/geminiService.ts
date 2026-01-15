
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeFile(fileName: string, type: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Describe what might be in a file named "${fileName}" of type ${type} in a cloud storage context. Keep it professional and brief.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Encrypted cloud storage item.";
  }
}

export async function generateWelcomeMessage() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a 1-sentence welcome message for a secure cloud storage user in the style of MEGA.nz.",
    });
    return response.text;
  } catch (error) {
    return "Welcome to your secure cloud storage.";
  }
}
