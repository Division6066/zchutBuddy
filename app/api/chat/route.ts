/**
 * OpenRouter Chat API Route
 *
 * POST /api/chat
 * Body: { message: string, sessionId?: string }
 * Response: Streaming plain text
 *
 * Model: meta-llama/llama-3.2-3b-instruct:free
 */

export const runtime = "edge";

// ============================================================================
// RATE LIMITING PLACEHOLDER
// TODO: Implement rate limiting before production deployment
// Options:
//   - Vercel KV + sliding window counter
//   - Upstash Redis rate limiter (@upstash/ratelimit)
//   - Cloudflare Workers rate limiting (if on CF)
// Recommended: 10 requests per minute per IP for free tier
// ============================================================================

/**
 * Request body type
 */
interface ChatRequestBody {
  message: string;
  sessionId?: string;
}

/**
 * Default model for chat completions
 */
const DEFAULT_MODEL = "meta-llama/llama-3.2-3b-instruct:free";

/**
 * OpenRouter API endpoint
 */
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Validates the request body
 */
function validateRequestBody(body: unknown): body is ChatRequestBody {
  if (!body || typeof body !== "object") return false;
  const { message } = body as Record<string, unknown>;
  return typeof message === "string" && message.trim().length > 0;
}

/**
 * Creates a JSON error response
 */
function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST handler - streams chat completion from OpenRouter
 */
export async function POST(request: Request): Promise<Response> {
  // Get API key from environment
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return errorResponse("Server configuration error", 500);
  }

  // Parse and validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (!validateRequestBody(body)) {
    return errorResponse("Missing or invalid 'message' field", 400);
  }

  const { message } = body;

  // Build messages array for OpenRouter
  const messages = [
    {
      role: "system",
      content:
        "You are ZchuyotBuddy, a helpful assistant for Israeli disability rights. Answer in Hebrew. Be concise and helpful. Focus on: disability benefits, Bituach Leumi, Ministry of Defense benefits, health fund rights, and municipal services.",
    },
    { role: "user", content: message },
  ];

  try {
    // Call OpenRouter with streaming enabled
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_PUBLIC_URL || "http://localhost:3000",
        "X-Title": process.env.APP_TITLE || "ZchuyotBuddy",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      // Don't expose internal error details to client
      console.error(`OpenRouter error: ${openRouterResponse.status} ${errorText}`);
      return errorResponse("Failed to get response from AI model", openRouterResponse.status);
    }

    if (!openRouterResponse.body) {
      return errorResponse("No response body from AI model", 500);
    }

    // Create a TransformStream to convert SSE to plain text
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          // Skip empty lines and comments
          if (!line.trim() || line.startsWith(":")) continue;

          // Handle SSE data lines
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();

            // Skip [DONE] marker
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // Skip malformed JSON chunks (can happen with partial chunks)
            }
          }
        }
      },
    });

    // Pipe OpenRouter SSE stream through transform to plain text
    const plainTextStream = openRouterResponse.body.pipeThrough(transformStream);

    return new Response(plainTextStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return errorResponse("Internal server error", 500);
  }
}
