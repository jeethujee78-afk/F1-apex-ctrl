import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "MY_GEMINI_API_KEY",
  APP_URL: process.env.APP_URL || "MY_APP_URL",
  OPENF1_BASE_URL: "https://api.openf1.org/v1",
};

export function validateEnv() {
  console.log("[Config] centralizing and validating environment variables...");
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    console.warn("[WARNING] GEMINI_API_KEY is not configured or using default placeholder. Gemini AI strategist features will operate in high-fidelity offline simulation mode.");
  } else {
    console.log("[Config] GEMINI_API_KEY is configured.");
  }
  
  if (config.NODE_ENV === "production") {
    console.log("[Config] Server running in PRODUCTION mode.");
  } else {
    console.log("[Config] Server running in DEVELOPMENT mode.");
  }
}
