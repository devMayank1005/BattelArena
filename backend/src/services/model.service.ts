import {ChatGoogle} from "@langchain/google";
import {ChatMistralAI} from "@langchain/mistralai";
import {ChatOpenAI} from "@langchain/openai";
import {ChatCohere} from "@langchain/cohere";
import config  from "../config/config.js";

export const geminiModel = new ChatGoogle({
   apiKey: config.GOOGLE_API_KEY,
   model: "gemini-flash-latest",
 
});

export const mistralModel = new ChatMistralAI({
   apiKey: config.MISTRAL_API_KEY,
   model: "mistral-medium-latest",
});

export const openAIModel = new ChatOpenAI({
   apiKey: config.OPENAI_API_KEY,
   model: "",
});

export const cohereModel = new ChatCohere({
   apiKey: config.COHERE_API_KEY,
   model: "command-a-03-2025"
});