"use client";

import { useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { Icon } from "@/components/ui/icon";
import { api } from "@/convex/_generated/api";
import { useChat } from "@/hooks/useChat";
import { useTranslation } from "@/lib/i18n";

export default function RightsFinderPage() {
  const { t, locale } = useTranslation();
  const [input, setInput] = useState("");
  const [preferredModel, setPreferredModel] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user subscription for model access
  const subscription = useQuery(api.subscriptions.getMySubscription);
  const userTier = subscription?.tier || "free_trial";

  // Initialize chat hook
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    softCapWarning,
    modelUsed,
    sendMessage,
    stopStreaming,
    clearError,
  } = useChat({
    type: "rights_finder",
    preferredModel: preferredModel || undefined,
    onSoftCapWarning: () => {
      // Could show a toast notification here
      console.log("Soft cap warning triggered");
    },
  });

  // Welcome message
  const welcomeMessage = {
    id: "welcome",
    role: "assistant" as const,
    content:
      locale === "he"
        ? "שלום! אני כאן לעזור לך לגלות את הזכויות שמגיעות לך. ספר לי על המצב שלך או שאל שאלה, ואני אחפש את המידע הרלוונטי עבורך."
        : "Hello! I'm here to help you discover your rights. Tell me about your situation or ask a question, and I'll search for relevant information for you.",
    timestamp: Date.now(),
  };

  // All messages including welcome
  const allMessages = messages.length === 0 ? [welcomeMessage] : messages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    await sendMessage(message);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const suggestedQuestions =
    locale === "he"
      ? ["האם מגיע לי דמי אבטלה?", "מה הזכויות שלי כהורה?", "זכויות נכות רפואית", "הנחות בארנונה"]
      : [
          "Am I eligible for unemployment benefits?",
          "What are my rights as a parent?",
          "Disability benefits rights",
          "Property tax discounts",
        ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon name="search" className="text-2xl" />
              </div>
              <div>
                <h1 className="text-xl font-black text-foreground">{t("rightsFinder.title")}</h1>
                <p className="text-sm text-muted-foreground">
                  {locale === "he"
                    ? "שאל כל שאלה על זכויות והטבות"
                    : "Ask any question about rights and benefits"}
                </p>
              </div>
            </div>

            {/* Model Selector */}
            <ModelSelector
              selectedModel={preferredModel}
              onSelectModel={setPreferredModel}
              userTier={userTier}
              disabled={isLoading}
            />
          </div>

          {/* Soft Cap Warning Banner */}
          {softCapWarning && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3">
              <Icon name="warning" className="text-yellow-600 dark:text-yellow-400 text-xl" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {locale === "he"
                    ? "הגעת ל-40% מהמכסה החודשית שלך"
                    : "You've reached 40% of your monthly quota"}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  {locale === "he"
                    ? "שקול לשדרג את התוכנית שלך להמשך שימוש ללא הפרעות"
                    : "Consider upgrading your plan for uninterrupted usage"}
                </p>
              </div>
              <a
                href="/pricing"
                className="shrink-0 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                {locale === "he" ? "שדרג" : "Upgrade"}
              </a>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
              <Icon name="error" className="text-red-600 dark:text-red-400 text-xl" />
              <p className="flex-1 text-sm text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={clearError}
                className="shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors"
              >
                <Icon name="close" className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {allMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.role === "user" ? "bg-primary text-white" : "bg-card border border-border"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Icon name="smart_toy" className="text-sm" />
                    </div>
                    <span className="text-xs font-bold text-primary">
                      {locale === "he" ? "זכויות באדי" : "Rights Buddy"}
                    </span>
                    {modelUsed && message.id !== "welcome" && (
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {modelUsed}
                      </span>
                    )}
                  </div>
                )}
                <div
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "user" ? "text-white" : "text-foreground"
                  }`}
                >
                  {message.content}
                  {/* Show cursor for streaming messages */}
                  {"isStreaming" in message && message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-primary animate-pulse ms-1" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && !isStreaming && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl p-4 max-w-[85%]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon name="smart_toy" className="text-sm" />
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {locale === "he" ? "זכויות באדי" : "Rights Buddy"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <span
                      className="size-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="size-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="size-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="text-sm">{t("rightsFinder.searching")}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions (only show at start) */}
      {messages.length === 0 && (
        <div className="p-4 border-t border-border bg-background">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">
              {locale === "he" ? "שאלות נפוצות:" : "Common questions:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-4 py-2 bg-card border border-border rounded-xl text-sm text-foreground hover:bg-accent hover:border-primary/30 transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("rightsFinder.placeholder")}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              disabled={isLoading}
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                className="size-12 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg"
                title={locale === "he" ? "עצור" : "Stop"}
              >
                <Icon name="stop" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="size-12 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-primary"
              >
                <Icon name="send" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
