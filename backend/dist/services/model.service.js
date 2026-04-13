import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";
export const geminiModel = new ChatGoogle({
    apiKey: config.GOOGLE_API_KEY,
    model: "gemini-3-flash-preview",
});
export const mistralModel = new ChatMistralAI({
    apiKey: config.MISTRALAI_API_KEY,
    model: "mistral-medium-latest",
});
export const cohereModel = new ChatCohere({
    apiKey: config.COHERE_API_KEY,
    model: "command-a-03-2025"
});
