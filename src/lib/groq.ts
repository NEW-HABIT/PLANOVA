// Compatibility adapter re-exporting from the primary Gemini AI engine
export * from "./gemini";
export {
  callAIChat as callGroqChat,
  isAIConfigured as isGroqConfigured,
} from "./gemini";
