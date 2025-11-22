import { GoogleGenAI } from "@google/genai";

// Initialize the client only when needed to ensure env vars are ready
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDatasetDescription = async (name: string, task: string, sampleData: string): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "AI Description generation unavailable (Missing API Key).";
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a helpful assistant for a data science platform. 
      Write a concise, professional, one-paragraph description for a dataset named "${name}" 
      intended for the task of "${task}". 
      Here is a sample of the data structure or content hints: "${sampleData}".
      Focus on the utility of the data.`,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error generating description. Please try again.";
  }
};
