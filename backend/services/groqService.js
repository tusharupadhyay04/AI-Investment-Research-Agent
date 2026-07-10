import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initializes and returns the Groq Llama 3 model instance
 * @returns {ChatGroq} Configured ChatGroq instance
 */
export const getGroqModel = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined in environment variables.');
  }

  // We use Llama 3.3 70B Versatile as requested by the requirements
  const model = new ChatGroq({
    apiKey: apiKey,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1, // Low temperature for more analytical and deterministic outputs
    maxTokens: 1024,
  });

  return model;
};
