import { config } from "dotenv";
config();

type Env = {
  GOOGLE_API_KEY: string;
  MISTRALAI_API_KEY: string;
  COHERE_API_KEY: string;
  MONGO_URI: string;
  PORT: string;
  FRONTEND_ORIGIN: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PASSWORD: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URI: string;
};

const REQUIRED_ENV_KEYS: Array<keyof Env> = [
  "MONGO_URI",
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URI",
  "FRONTEND_ORIGIN",
  "FRONTEND_URL",
];

const env: Env = {
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "",
  MISTRALAI_API_KEY: process.env.MISTRALAI_API_KEY || process.env.MISTRAL_API_KEY || "",
  COHERE_API_KEY: process.env.COHERE_API_KEY || "",
  MONGO_URI: process.env.MONGO_URI || "",
  PORT: process.env.PORT || "3000",
  FRONTEND_ORIGIN:
    process.env.FRONTEND_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173",
  FRONTEND_URL:
    process.env.FRONTEND_URL || process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  JWT_SECRET: process.env.JWT_SECRET || "",
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URI:
    process.env.GOOGLE_CALLBACK_URI || "http://localhost:3000/api/v1/auth/google/callback",
};

export function getMissingRequiredEnv(): string[] {
  return REQUIRED_ENV_KEYS.filter((key) => !env[key] || String(env[key]).trim() === "").map(String);
}

export default env;