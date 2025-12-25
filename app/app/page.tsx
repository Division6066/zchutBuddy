"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface Message {
  role: "user" | "assistant";
  content: string;
  answerHe?: string;
  answerEn?: string;
}

interface ChatResponse {
  mode: "answer" | "clarify";
  clarifying_questions?: Array<{ he: string; en: string }>;
  answer?: { he: string; en: string };
}

export default function AppPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);

  // Convex hooks for chat history (with error handling for demo mode)
  const chatHistory = useQuery(api.chat.getChatHistory, { limit: 100 });
  const saveMessage = useMutation(api.chat.saveMessage);
  const clearHistory = useMutation(api.chat.clearChatHistory);

  // Load chat history from Convex
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      const loadedMessages: Message[] = chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
        answerHe: msg.answerHe,
        answerEn: msg.answerEn,
      }));
      setMessages(loadedMessages);
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);
    setLastResponse(null);

    try {
      // Save user message to Convex (if available)
      try {
        await saveMessage({
          role: "user",
          content: userMessage.content,
        });
      } catch (convexError) {
        // Silently fail if Convex is not available (demo mode)
        console.log("Chat history not available (demo mode)");
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        setError(data.error?.message || "Error occurred");
        if (data.error?.raw) {
          setLastResponse({ mode: "answer", answer: { he: data.error.raw, en: data.error.raw } });
        }
        return;
      }

      setLastResponse(data.data);
      
      // Add assistant response to messages and save to Convex
      if (data.data.mode === "answer" && data.data.answer) {
        const assistantMessage: Message = {
          role: "assistant",
          content: `${data.data.answer.he}\n\n${data.data.answer.en}`,
          answerHe: data.data.answer.he,
          answerEn: data.data.answer.en,
        };
        setMessages([...newMessages, assistantMessage]);

        // Save assistant message to Convex (if available)
        try {
          await saveMessage({
            role: "assistant",
            content: assistantMessage.content,
            answerHe: data.data.answer.he,
            answerEn: data.data.answer.en,
            mode: "answer",
          });
        } catch (convexError) {
          // Silently fail if Convex is not available (demo mode)
          console.log("Chat history not available (demo mode)");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm("האם אתה בטוח שברצונך למחוק את היסטוריית הצ'אט? / Are you sure you want to clear chat history?")) {
      try {
        // Try to clear from Convex (if available)
        try {
          await clearHistory({});
        } catch (convexError) {
          // Silently fail if Convex is not available (demo mode)
          console.log("Chat history not available (demo mode)");
        }
        // Always clear local state
        setMessages([]);
        setLastResponse(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to clear history");
      }
    }
  };

  const handleQuestionClick = (question: { he: string; en: string }) => {
    setInput(question.he);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-gray-50/50">
      {/* Background gradient */}
      <div className="absolute top-[-10%] right-[-20%] h-[40%] w-[60%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-800 z-30">
        <div className="font-bold mb-1">מידע זה הוא למטרות הסברה בלבד. יש לאמת מול מקורות רשמיים ולהתייעץ עם מומחה במקרים מורכבים.</div>
        <div className="text-amber-700">This information is for informational purposes only. Verify with official sources and consult a professional for complex cases.</div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Icon name="smart_toy" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-xl leading-tight">ZchuyotBuddy Chat</h1>
            <p className="text-gray-600 text-xs font-medium">צ'אט עם עוזר זכויות</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            onClick={handleClearHistory}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            <Icon name="delete_outline" size={18} className="ml-2" />
            נקה היסטוריה / Clear
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-24">
        {messages.length === 0 && !lastResponse && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Icon name="chat_bubble" size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium mb-2 text-gray-900">שלום! איך אוכל לעזור?</p>
            <p className="text-sm text-gray-600">Hello! How can I help you?</p>
          </div>
        )}

        {/* Message History */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-100"
              }`}
            >
              {msg.role === "assistant" && msg.answerHe && msg.answerEn ? (
                <div className="space-y-3">
                  <div dir="rtl" className="text-sm text-gray-900 whitespace-pre-wrap">
                    <div className="text-xs font-bold text-primary mb-1">עברית</div>
                    {msg.answerHe}
                  </div>
                  <div dir="ltr" className="text-sm text-gray-900 whitespace-pre-wrap">
                    <div className="text-xs font-bold text-primary mb-1">English</div>
                    {msg.answerEn}
                  </div>
                </div>
              ) : (
                <div className={`whitespace-pre-wrap text-sm ${msg.role === "user" ? "text-white" : "text-gray-900"}`}>
                  {msg.content}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Clarifying Questions */}
        {lastResponse?.mode === "clarify" && lastResponse.clarifying_questions && (
          <div className="space-y-2">
            <div className="text-sm font-bold text-gray-900 mb-2">בחר שאלה להמשך / Choose a question:</div>
            {lastResponse.clarifying_questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(q)}
                className="w-full text-right bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-primary hover:bg-primary-bg/20 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">{q.he}</div>
                <div className="text-xs text-gray-600">{q.en}</div>
              </button>
            ))}
          </div>
        )}

        {/* Answer Display */}
        {lastResponse?.mode === "answer" && lastResponse.answer && (
          <div className="space-y-4">
            {/* Hebrew Answer */}
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3" dir="rtl">
              <div className="text-xs font-bold text-primary mb-2">עברית</div>
              <div className="text-sm text-gray-900 whitespace-pre-wrap">{lastResponse.answer.he}</div>
            </div>
            {/* English Answer */}
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3" dir="ltr">
              <div className="text-xs font-bold text-primary mb-2">English</div>
              <div className="text-sm text-gray-900 whitespace-pre-wrap">{lastResponse.answer.en}</div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-800 text-sm">
            <div className="font-bold mb-1">שגיאה / Error:</div>
            <div>{error}</div>
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-text-subtle text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
                <span className="mr-2">מחשב...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-30">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="שאל שאלה... / Ask a question..."
            className="flex-1 min-h-[60px] max-h-[120px] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary resize-none text-sm text-gray-900 placeholder:text-gray-500 bg-white"
            dir="auto"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="h-[60px] px-6 rounded-xl bg-primary text-white hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
