/**
 * Chat API Route with Model Routing
 *
 * POST /api/chat
 * Body: { message: string, sessionId?: string, preferredModel?: string }
 * Response: Streaming plain text
 *
 * Features:
 * - Authentication via Clerk
 * - Usage checking and limits
 * - Model routing based on subscription tier
 * - Streaming responses
 */

export const runtime = "edge";

import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Hebrew system prompt for ZchuyotBuddy
const SYSTEM_PROMPT = `אתה זכויות באדי, עוזר AI לניווט זכויות נכים בישראל.
תפקידך לעזור למשתמשים להבין את הזכויות שלהם מול:

• ביטוח לאומי
• משרד הביטחון (נכי צה"ל)
• קופות חולים
• משרד הרווחה
• רשויות מקומיות

ענה בעברית. היה תמציתי ומדויק.
אם אתה לא בטוח, אמור זאת.
תמיד הצע לחפש מידע נוסף.
כאשר אתה מציין זכויות, כלול מקורות רשמיים כשאפשר.`;

// OpenRouter API configuration
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Model ID to OpenRouter model mapping
const OPENROUTER_MODELS: Record<string, string> = {
  "gemma-2-9b": "google/gemma-2-9b-it:free",
  "mistral-small": "mistralai/mistral-small-latest",
  "mistral-medium": "mistralai/mistral-medium-latest",
  "deepseek-v3": "deepseek/deepseek-chat",
  "kimi-k2": "moonshotai/kimi-k2",
};

// Model access by tier
const MODEL_ACCESS: Record<string, string[]> = {
  free_trial: ["gemma-2-9b"],
  plus: ["gemma-2-9b", "mistral-small"],
  pro: ["gemma-2-9b", "mistral-small", "mistral-medium", "deepseek-v3"],
  max: ["gemma-2-9b", "mistral-small", "mistral-medium", "deepseek-v3", "kimi-k2"],
};

// Default models per tier
const DEFAULT_MODELS: Record<string, string> = {
  free_trial: "gemma-2-9b",
  plus: "mistral-small",
  pro: "deepseek-v3",
  max: "kimi-k2",
};

/**
 * Request body type
 */
interface ChatRequestBody {
  message: string;
  sessionId?: string;
  preferredModel?: string;
}

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
 * Select model based on tier and preference
 */
function selectModel(tier: string, preferredModel?: string): string {
  const availableModels = MODEL_ACCESS[tier] || MODEL_ACCESS.free_trial;
  const defaultModel = DEFAULT_MODELS[tier] || DEFAULT_MODELS.free_trial;

  // If preferred model is specified and user has access
  if (preferredModel && availableModels.includes(preferredModel)) {
    return preferredModel;
  }

  return defaultModel;
}

/**
 * POST handler - streams chat completion
 */
export async function POST(request: Request): Promise<Response> {
  // Get API key from environment
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return errorResponse("Server configuration error", 500);
  }

  // Authentication - check for Clerk user
  const { userId: clerkUserId } = await auth();

  // For now, allow unauthenticated requests for guest mode
  // In production, you might want to add rate limiting for guests
  let userTier = "free_trial";
  let canUseApi = true;
  let usageCheckResult: { softCapReached?: boolean; hardCapReached?: boolean } = {};

  // If authenticated, check subscription and usage
  if (clerkUserId) {
    try {
      // Get user subscription via Convex
      const subscription = await convex.query(api.subscriptions.getMySubscription);
      if (subscription) {
        userTier = subscription.tier;
      }

      // Check usage caps
      usageCheckResult = await convex.query(api.usageTracking.checkUsageCaps);
      if (usageCheckResult.hardCapReached) {
        return errorResponse(
          "הגעת למגבלת השימוש החודשית. שדרג את התוכנית שלך כדי להמשיך.",
          429
        );
      }

      // Check daily chat limit
      const dailyLimit = await convex.query(api.usageTracking.checkDailyChatLimit);
      if (dailyLimit && !dailyLimit.canChat) {
        return errorResponse(
          `הגעת למגבלת ${dailyLimit.limit} שיחות ליום. נסה שוב מחר או שדרג את התוכנית.`,
          429
        );
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      // Continue with defaults if Convex query fails
    }
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

  const { message, preferredModel } = body;

  // Select model based on tier and preference
  const selectedModel = selectModel(userTier, preferredModel);
  const openRouterModel = OPENROUTER_MODELS[selectedModel] || OPENROUTER_MODELS["gemma-2-9b"];

  // Build messages array for OpenRouter
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: message },
  ];

  try {
    // Call OpenRouter with streaming enabled
    const openRouterResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_PUBLIC_URL || "https://zchuyotbuddy.vercel.app",
        "X-Title": "ZchuyotBuddy",
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error(`OpenRouter error: ${openRouterResponse.status} ${errorText}`);

      if (openRouterResponse.status === 429) {
        return errorResponse("שירות AI עמוס. נסה שוב בעוד מספר שניות.", 429);
      }

      return errorResponse("שגיאה בקבלת תשובה מהמודל", openRouterResponse.status);
    }

    if (!openRouterResponse.body) {
      return errorResponse("No response body from AI model", 500);
    }

    // Create a TransformStream to convert SSE to plain text
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let totalContent = "";

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
                totalContent += content;
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

    // Return streaming response with metadata headers
    return new Response(plainTextStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Model-Used": selectedModel,
        "X-Soft-Cap-Warning": usageCheckResult.softCapReached ? "true" : "false",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return errorResponse("שגיאה פנימית בשרת", 500);
  }
}
