import { config } from "dotenv";

config();

type Config = {
   readonly GOOGLE_API_KEY: string;
   readonly MISTRAL_API_KEY: string;
   readonly COHERE_API_KEY: string;
   readonly OPENAI_API_KEY: string;
};

 export const getConfig = (): Config => {
   const {
      GOOGLE_API_KEY,
      MISTRAL_API_KEY,
      COHERE_API_KEY,
      OPENAI_API_KEY,
   } = process.env;

   if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not defined in environment variables");
   }
   if (!MISTRAL_API_KEY) {
      throw new Error("MISTRAL_API_KEY is not defined in environment variables");
   }
   if (!COHERE_API_KEY) {
      throw new Error("COHERE_API_KEY is not defined in environment variables");
   }
   if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined in environment variables");
   }

   return {
      GOOGLE_API_KEY,
      MISTRAL_API_KEY,
      COHERE_API_KEY,
      OPENAI_API_KEY,
   };
};  

export default getConfig();
