"use client";

import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// ============================================
// TYPES
// ============================================

interface RightsFinderChatProps {
  sessionId?: string;
  onSessionCreated?: (id: string) => void;
}

interface Message {
  _id: Id<"messages">;
  sessionId: Id<"chatSessions">;
  role: string;
  content: string;
  createdAt: number;
}

// ============================================
// SUGGESTED QUESTIONS
// ============================================

const SUGGESTED_QUESTIONS = [
  "מה הזכויות שלי כנכה?",
  "איך מגישים תביעה לביטוח לאומי?",
  'מה ההטבות לנכי צה"ל?',
  "איך מגישים בקשה לדיור ציבורי?",
];

// ============================================
// COMPONENT
// ============================================

export function RightsFinderChat({
  sessionId: initialSessionId,
  onSessionCreated,
}: RightsFinderChatProps) {
  // ----------------------------------------
  // State
  // ----------------------------------------
  const [currentSessionId, setCurrentSessionId] = useState<Id<"chatSessions"> | null>(
    initialSessionId ? (initialSessionId as Id<"chatSessions">) : null
  );
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // ----------------------------------------
  // Refs
  // ----------------------------------------
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ----------------------------------------
  // Convex hooks
  // ----------------------------------------
  const createChatSession = useMutation(api.chat.createChatSession);
  const sendMessageMutation = useMutation(api.chat.sendMessage);
  const saveAssistantMessage = useMutation(api.chat.saveAssistantMessage);

  const messages = useQuery(
    api.chat.getChatMessages,
    currentSessionId ? { sessionId: currentSessionId } : "skip"
  );

  // ----------------------------------------
  // Auto-scroll to bottom
  // ----------------------------------------
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // ----------------------------------------
  // Create session on mount if needed
  // ----------------------------------------
  useEffect(() => {
    async function initSession() {
      if (!initialSessionId && !currentSessionId && !isCreatingSession) {
        setIsCreatingSession(true);
        try {
          const newSessionId = await createChatSession({ type: "rights_finder" });
          setCurrentSessionId(newSessionId);
          onSessionCreated?.(newSessionId);
        } catch (_err) {
          setError("שגיאה ביצירת שיחה חדשה");
        } finally {
          setIsCreatingSession(false);
        }
      }
    }
    initSession();
  }, [initialSessionId, currentSessionId, isCreatingSession, createChatSession, onSessionCreated]);

  // ----------------------------------------
  // Send message handler
  // ----------------------------------------
  const handleSend = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim();
      if (!trimmedContent || !currentSessionId || isLoading) {
        return;
      }

      setError(null);
      setInputText("");
      setIsLoading(true);
      setStreamingContent("");

      try {
        // 1. Save user message to Convex
        await sendMessageMutation({
          sessionId: currentSessionId,
          content: trimmedContent,
        });

        // 2. Call /api/chat with streaming
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmedContent }),
        });

        if (!response.ok) {
          throw new Error("Failed to get AI response");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        // 3. Stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setStreamingContent(fullText);
        }

        // 4. Save assistant message to Convex
        if (fullText.trim()) {
          await saveAssistantMessage({
            sessionId: currentSessionId,
            content: fullText.trim(),
          });
        }

        setStreamingContent("");
      } catch (_err) {
        setError("שגיאה בשליחת ההודעה. נסה שוב.");
        setStreamingContent("");
      } finally {
        setIsLoading(false);
      }
    },
    [currentSessionId, isLoading, sendMessageMutation, saveAssistantMessage]
  );

  // ----------------------------------------
  // Handle form submit
  // ----------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  // ----------------------------------------
  // Handle keyboard shortcuts
  // ----------------------------------------
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  // ----------------------------------------
  // Handle suggested question click
  // ----------------------------------------
  const handleSuggestedQuestion = (question: string) => {
    handleSend(question);
  };

  // ----------------------------------------
  // Check if we have messages
  // ----------------------------------------
  const hasMessages = messages && messages.length > 0;
  const showSuggestions = !hasMessages && !isLoading && !streamingContent;

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div
      dir="rtl"
      className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200"
    >
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loading session state */}
        {isCreatingSession && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <span>יוצר שיחה חדשה...</span>
            </div>
          </div>
        )}

        {/* Suggested questions */}
        {showSuggestions && !isCreatingSession && (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">איך אוכל לעזור לך היום?</h3>
              <p className="text-sm text-gray-500">בחר שאלה או כתוב את השאלה שלך</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="p-4 text-right bg-white rounded-xl border border-gray-200 hover:border-[#0d968b] hover:bg-[#0d968b]/5 transition-colors text-sm text-gray-700 shadow-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages list */}
        {messages?.map((message: Message) => (
          <MessageBubble key={message._id} message={message} />
        ))}

        {/* Streaming assistant message */}
        {streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-2xl bg-gray-200 text-gray-800 rounded-tr-sm">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{streamingContent}</p>
              <span className="inline-block w-2 h-4 bg-gray-500 animate-pulse mr-1" />
            </div>
          </div>
        )}

        {/* Loading indicator (before streaming starts) */}
        {isLoading && !streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-2xl bg-gray-200 text-gray-800 rounded-tr-sm">
              <div className="flex items-center gap-2">
                <LoadingDots />
                <span className="text-sm text-gray-500">חושב...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="שאל אותי על הזכויות שלך..."
            rows={1}
            disabled={isLoading || !currentSessionId}
            className="flex-1 resize-none rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d968b] focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
          <Button
            type="submit"
            disabled={isLoading || !inputText.trim() || !currentSessionId}
            className="h-12 px-6 bg-[#0d968b] hover:bg-[#0b8279] text-white rounded-xl shadow-md disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner /> : <SendIcon />}
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Enter לשליחה • Shift+Enter לשורה חדשה
        </p>
      </form>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? "bg-[#0d968b] text-white rounded-tl-sm"
            : "bg-gray-200 text-gray-800 rounded-tr-sm"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function LoadingDots() {
  return (
    <div className="flex gap-1">
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 rotate-180"
    >
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  );
}

export default RightsFinderChat;
