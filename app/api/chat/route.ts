import { type NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/zbPrompt";

interface ChatRequest {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

interface ChatResponse {
  ok: boolean;
  data?: {
    mode: "answer" | "clarify";
    clarifying_questions?: Array<{ he: string; en: string }>;
    answer?: { he: string; en: string };
  };
  error?: {
    message: string;
    raw?: string;
  };
}

async function callOpenRouter(
  model: string,
  messages: Array<{ role: string; content: string }>
): Promise<{ success: boolean; content?: string; error?: string }> {
  // #region agent log
  console.log("[DEBUG] callOpenRouter called with model:", model);
  fetch("http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "app/api/chat/route.ts:22",
      message: "callOpenRouter called",
      data: { model, hasApiKey: !!process.env.OPENROUTER_API_KEY },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "H2",
    }),
  }).catch((e) => console.error("[DEBUG] Log fetch failed:", e));
  // #endregion
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "app/api/chat/route.ts:28",
        message: "API key missing",
        data: { model },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H1",
      }),
    }).catch(() => {});
    // #endregion
    return { success: false, error: "OPENROUTER_API_KEY not configured" };
  }

  const appUrl = process.env.APP_PUBLIC_URL || "http://localhost:3000";
  const appTitle = process.env.APP_TITLE || "ZchuyotBuddy";

  try {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "app/api/chat/route.ts:35",
        message: "Making API request",
        data: { model, url: "https://openrouter.ai/api/v1/chat/completions" },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H4",
      }),
    }).catch(() => {});
    // #endregion
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": appUrl,
        "X-Title": appTitle,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "app/api/chat/route.ts:52",
          message: "API request failed",
          data: { model, status: response.status, error: errorText.substring(0, 200) },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "H3",
        }),
      }).catch(() => {});
      // #endregion
      return { success: false, error: `OpenRouter error: ${response.status} ${errorText}` };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    // #region agent log
    console.log(
      "[DEBUG] API response received - model:",
      model,
      "responseModel:",
      data.model,
      "hasContent:",
      !!content
    );
    fetch("http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "app/api/chat/route.ts:70",
        message: "API response received",
        data: { model, status: "ok", hasContent: !!content, responseModel: data.model },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H4",
      }),
    }).catch((e) => console.error("[DEBUG] Log fetch failed:", e));
    // #endregion
    if (!content) {
      return { success: false, error: "No content in response" };
    }

    return { success: true, content };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function parseJSONResponse(content: string): ChatResponse["data"] | null {
  // Try to extract JSON from content (handle cases where model adds markdown)
  let jsonStr = content.trim();

  // Remove markdown code blocks if present
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (parsed.mode !== "answer" && parsed.mode !== "clarify") {
      return null;
    }

    if (parsed.mode === "clarify" && !Array.isArray(parsed.clarifying_questions)) {
      return null;
    }

    if (parsed.mode === "answer" && (!parsed.answer?.he || !parsed.answer?.en)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
  try {
    const body: ChatRequest = await request.json();

    // Validation
    if (!body.message || typeof body.message !== "string" || body.message.trim().length === 0) {
      return NextResponse.json({ ok: false, error: { message: "BAD_REQUEST" } }, { status: 400 });
    }

    if (body.history && !Array.isArray(body.history)) {
      return NextResponse.json({ ok: false, error: { message: "BAD_REQUEST" } }, { status: 400 });
    }

    // Build messages array
    const systemPrompt = buildSystemPrompt();
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
      ...(body.history || []),
      { role: "user", content: body.message },
    ];

    // Model priority list (strongest to weakest free models):
    // 1. meta-llama/llama-3.3-70b-instruct:free (primary - strongest free model)
    // 2. google/gemini-2.0-flash-exp:free (alternative if llama-3.3-70b unavailable)
    // 3. deepseek/deepseek-r1-0528:free (fallback - reliable and fast)

    // Try primary model
    const primaryModel = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
    // #region agent log
    console.log(
      "[DEBUG] Primary model selected:",
      primaryModel,
      "env:",
      process.env.OPENROUTER_MODEL || "not set"
    );
    fetch("http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "app/api/chat/route.ts:152",
        message: "Primary model selected",
        data: {
          primaryModel,
          envModel: process.env.OPENROUTER_MODEL || "not set",
          usingDefault: !process.env.OPENROUTER_MODEL,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H1",
      }),
    }).catch((e) => console.error("[DEBUG] Log fetch failed:", e));
    // #endregion
    // If llama-3-70b not available, use: "google/gemini-flash-1.5-8b:free"
    let result = await callOpenRouter(primaryModel, messages);

    // If primary fails, try fallback
    if (!result.success) {
      const fallbackModel =
        process.env.OPENROUTER_FALLBACK_MODEL || "deepseek/deepseek-r1-0528:free";
      // #region agent log
      console.log(
        "[DEBUG] Primary failed, using fallback - primary:",
        primaryModel,
        "fallback:",
        fallbackModel,
        "error:",
        result.error
      );
      fetch("http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "app/api/chat/route.ts:162",
          message: "Primary failed, using fallback",
          data: {
            primaryModel,
            fallbackModel,
            primaryError: result.error,
            envFallback: process.env.OPENROUTER_FALLBACK_MODEL || "not set",
            usingDefault: !process.env.OPENROUTER_FALLBACK_MODEL,
          },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "H3",
        }),
      }).catch((e) => console.error("[DEBUG] Log fetch failed:", e));
      // #endregion
      result = await callOpenRouter(fallbackModel, messages);
    } else {
      // #region agent log
      console.log("[DEBUG] Primary model succeeded:", primaryModel);
      fetch("http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "app/api/chat/route.ts:168",
          message: "Primary model succeeded",
          data: { primaryModel },
          timestamp: Date.now(),
          sessionId: "debug-session",
          runId: "run1",
          hypothesisId: "H2",
        }),
      }).catch((e) => console.error("[DEBUG] Log fetch failed:", e));
      // #endregion
    }

    if (!result.success || !result.content) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            message: "MODEL_REQUEST_FAILED",
            raw: result.error || "Unknown error",
          },
        },
        { status: 500 }
      );
    }

    // Parse JSON response
    const parsed = parseJSONResponse(result.content);
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a02245fe-4d16-41bb-8353-2289b6c2848d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "app/api/chat/route.ts:161",
        message: "Response parsed",
        data: { parsed: !!parsed, mode: parsed?.mode },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H5",
      }),
    }).catch(() => {});
    // #endregion

    if (!parsed) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            message: "MODEL_JSON_PARSE_FAILED",
            raw: result.content,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data: parsed });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: "INTERNAL_ERROR",
          raw: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
