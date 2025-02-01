import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import { systemInstructionPrompt } from "../utils/systemInstruction.js";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: systemInstructionPrompt
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt, chatHistory = []) {

  const chatSession = model.startChat({
    generationConfig,
    history: chatHistory
  });

  const result = await chatSession.sendMessage(prompt);

  return result.response.text();
}

export default run;
