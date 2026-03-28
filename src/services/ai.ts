/// <reference types="vite/client" />

export type ModelType = 'casual' | 'coding' | 'technology';

const MODEL_MAP: Record<ModelType, string> = {
  casual: 'stepfun/step-3.5-flash:free',
  coding: 'qwen/qwen3-coder:free',
  technology: 'nvidia/nemotron-3-nano-30b-a3b:free'
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are Aurora AI v1, an advanced and helpful AI assistant.
CRITICAL INSTRUCTIONS:
- You must ONLY identify yourself as "Aurora AI v1".
- NEVER reveal what underlying model you are based on (e.g., do not say you are Deepseek, Qwen, Stepfun, Llama, OpenAI, Anthropic, or anything else).
- If asked about your origin, architecture, or model version, respond that you are Aurora AI v1 developed to assist the user.
- Keep responses helpful, direct, and perfectly formatted.`;

export async function generateAIResponse(
  messages: Omit<ChatMessage, 'id'>[],
  modelType: ModelType
): Promise<string> {
  const model = MODEL_MAP[modelType];
  
  // Try to get API key from Vite environment variables (Vercel exposes these if prefixed with VITE_)
  // If not found, we'll try a fallback mock or instruct the user
  const apiKey = import.meta.env.VITE_AI_API || import.meta.env.VITE_OPENROUTER_API_KEY;

  const payloadMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];

  if (!apiKey) {
    // Fallback simulated response if no API key is provided yet
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "[Simulation] I am Aurora AI v1. I am currently running in offline simulation mode because the AI_API environment variable was not found.\n\nTo enable real AI responses, please add VITE_AI_API to your Vercel environment variables (or .env file) with your OpenRouter API key.\n\nSelected Model: " + model;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin, // Optional but recommended by OpenRouter
        'X-Title': 'Aurora AI',
      },
      body: JSON.stringify({
        model,
        messages: payloadMessages,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "HTTP error " + response.status);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('AI generation error:', error);
    return "I encountered an error trying to process your request: " + error.message;
  }
}
