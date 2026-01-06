/**
 * OpenRouter API Integration Helper
 *
 * Provides streaming chat completion with OpenRouter's API.
 * Supports all models configured in the model router.
 */

// Model ID mapping to OpenRouter model strings
export const OPENROUTER_MODELS: Record<string, string> = {
  "gemma-2-9b": "google/gemma-2-9b-it:free",
  "mistral-small": "mistralai/mistral-small-latest",
  "mistral-medium": "mistralai/mistral-medium-latest",
  "deepseek-v3": "deepseek/deepseek-chat",
  "kimi-k2": "moonshotai/kimi-k2",
};

// OpenRouter API endpoint
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Message format for OpenRouter API
 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Parameters for streaming chat
 */
export interface StreamChatParams {
  modelId: string;
  messages: ChatMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Parsed stream chunk
 */
export interface StreamChunk {
  content: string;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Error response from OpenRouter
 */
export interface OpenRouterError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

/**
 * Get the OpenRouter model string for a given model ID
 */
export function getOpenRouterModelId(modelId: string): string {
  return OPENROUTER_MODELS[modelId] || OPENROUTER_MODELS["gemma-2-9b"];
}

/**
 * Estimate tokens for a given text (rough estimation)
 *
 * Hebrew text: characters / 2.5 (Hebrew is denser)
 * English text: words * 1.3
 * Mixed: weighted average based on character count
 */
export function estimateTokens(text: string): number {
  if (!text) {
    return 0;
  }

  // Count Hebrew characters (Unicode range)
  const hebrewChars = (text.match(/[\u0590-\u05FF]/g) || []).length;
  const totalChars = text.length;
  const _hebrewRatio = hebrewChars / totalChars;

  // Hebrew estimation
  const hebrewTokens = hebrewChars / 2.5;

  // English estimation (words * 1.3)
  const nonHebrewText = text.replace(/[\u0590-\u05FF]/g, "");
  const words = nonHebrewText.split(/\s+/).filter((w) => w.length > 0).length;
  const englishTokens = words * 1.3;

  // Weighted average
  return Math.ceil(hebrewTokens + englishTokens);
}

/**
 * Parse a Server-Sent Events (SSE) chunk from OpenRouter
 */
export function parseStreamChunk(chunk: string): StreamChunk | null {
  // Skip empty lines and comments
  if (!chunk.trim() || chunk.startsWith(":")) {
    return null;
  }

  // Handle SSE data lines
  if (chunk.startsWith("data: ")) {
    const data = chunk.slice(6).trim();

    // Handle [DONE] signal
    if (data === "[DONE]") {
      return { content: "", finishReason: "stop" };
    }

    try {
      const parsed = JSON.parse(data);
      const choice = parsed.choices?.[0];

      return {
        content: choice?.delta?.content || "",
        finishReason: choice?.finish_reason,
        usage: parsed.usage
          ? {
              promptTokens: parsed.usage.prompt_tokens,
              completionTokens: parsed.usage.completion_tokens,
              totalTokens: parsed.usage.total_tokens,
            }
          : undefined,
      };
    } catch {
      // Skip malformed JSON chunks
      return null;
    }
  }

  return null;
}

/**
 * Stream chat completion from OpenRouter
 *
 * @param params - Chat parameters including model, messages, etc.
 * @returns ReadableStream of response text
 */
export async function streamChat(params: StreamChatParams): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const { modelId, messages, systemPrompt, temperature = 0.7, maxTokens = 2048 } = params;

  // Build messages array
  const fullMessages: ChatMessage[] = [];

  if (systemPrompt) {
    fullMessages.push({ role: "system", content: systemPrompt });
  }

  fullMessages.push(...messages);

  // Get OpenRouter model ID
  const openRouterModel = getOpenRouterModelId(modelId);

  // Call OpenRouter API
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.APP_PUBLIC_URL || "https://zchuyotbuddy.vercel.app",
      "X-Title": "ZchuyotBuddy",
    },
    body: JSON.stringify({
      model: openRouterModel,
      messages: fullMessages,
      stream: true,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "Failed to get response from AI model";

    try {
      const errorJson = JSON.parse(errorText) as OpenRouterError;
      errorMessage = errorJson.error?.message || errorMessage;
    } catch {
      // Use default error message
    }

    // Handle specific error codes
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    if (response.status === 401) {
      throw new Error("API key invalid or expired");
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error("No response body from AI model");
  }

  // Transform SSE stream to plain text
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const text = decoder.decode(chunk, { stream: true });
      const lines = text.split("\n");

      for (const line of lines) {
        const parsed = parseStreamChunk(line);
        if (parsed?.content) {
          controller.enqueue(encoder.encode(parsed.content));
        }
      }
    },
  });

  return response.body.pipeThrough(transformStream);
}

/**
 * Non-streaming chat completion (for simple requests)
 */
export async function chat(params: Omit<StreamChatParams, "stream">): Promise<{
  content: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
}> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const { modelId, messages, systemPrompt, temperature = 0.7, maxTokens = 2048 } = params;

  // Build messages array
  const fullMessages: ChatMessage[] = [];

  if (systemPrompt) {
    fullMessages.push({ role: "system", content: systemPrompt });
  }

  fullMessages.push(...messages);

  // Get OpenRouter model ID
  const openRouterModel = getOpenRouterModelId(modelId);

  // Call OpenRouter API
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.APP_PUBLIC_URL || "https://zchuyotbuddy.vercel.app",
      "X-Title": "ZchuyotBuddy",
    },
    body: JSON.stringify({
      model: openRouterModel,
      messages: fullMessages,
      stream: false,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return {
    content: data.choices?.[0]?.message?.content || "",
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
  };
}

/**
 * Check if a model is available (ping test)
 */
export async function checkModelAvailability(modelId: string): Promise<boolean> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return false;
    }

    const openRouterModel = getOpenRouterModelId(modelId);

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_PUBLIC_URL || "https://zchuyotbuddy.vercel.app",
        "X-Title": "ZchuyotBuddy",
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: [{ role: "user", content: "test" }],
        max_tokens: 1,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
