"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function RightsFinderPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "שלום! אני כאן לעזור לך לגלות את הזכויות שמגיעות לך. ספר לי על המצב שלך או שאל שאלה, ואני אחפש את המידע הרלוונטי עבורך.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response - in production, this would call the Convex API
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (question: string): string => {
    // This is a mock response - in production, this would be AI-generated
    if (question.includes("ביטוח לאומי") || question.includes("דמי אבטלה")) {
      return `בהתבסס על שאלתך, הנה מידע רלוונטי:

**דמי אבטלה**
אם פוטרת או התפטרת מעבודתך, ייתכן שאתה זכאי לדמי אבטלה מביטוח לאומי.

**תנאי זכאות עיקריים:**
• גיל 20 ומעלה
• עבדת 12 חודשים מתוך 18 החודשים האחרונים
• נרשמת בשירות התעסוקה

**צעדים הבאים:**
1. הירשם בשירות התעסוקה
2. הגש תביעה לביטוח לאומי
3. צרף אישור פיטורין/התפטרות

רוצה שאבנה לך רשימת משימות מפורטת?`;
    }
    
    if (question.includes("נכות") || question.includes("רפואי")) {
      return `אני מבין שאתה מתעניין בזכויות הקשורות לנכות או מצב רפואי.

**גמלת נכות כללית**
אם יש לך מגבלה רפואית המשפיעה על יכולת העבודה שלך, ייתכן שאתה זכאי לגמלת נכות.

**מה צריך לדעת:**
• הזכאות נקבעת לפי אחוז נכות רפואית
• יש להגיש תביעה עם מסמכים רפואיים
• התהליך כולל ועדה רפואית

**מקורות רשמיים:**
[ביטוח לאומי - נכות כללית](https://www.btl.gov.il)

האם תרצה לשמוע על זכויות נוספות?`;
    }

    return `תודה על השאלה! בהתבסס על מה שכתבת, אני יכול לעזור לך לבדוק מספר זכויות אפשריות.

**כדי לתת לך תשובה מדויקת יותר, אשמח לדעת:**
• מה הגיל שלך?
• מה סטטוס התעסוקה שלך?
• האם יש לך מצב רפואי מיוחד?

ככל שתספר לי יותר, כך אוכל לעזור לך טוב יותר למצוא את כל הזכויות שמגיעות לך.`;
  };

  const suggestedQuestions = [
    "האם מגיע לי דמי אבטלה?",
    "מה הזכויות שלי כהורה?",
    "זכויות נכות רפואית",
    "הנחות בארנונה",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">search</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">{t("rightsFinder.title")}</h1>
              <p className="text-sm text-muted-foreground">שאל כל שאלה על זכויות והטבות</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-card border border-border"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                    <span className="text-xs font-bold text-primary">זכויות באדי</span>
                  </div>
                )}
                <div 
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "user" ? "text-white" : "text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl p-4 max-w-[85%]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                  </div>
                  <span className="text-xs font-bold text-primary">זכויות באדי</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
      {messages.length === 1 && (
        <div className="p-4 border-t border-border bg-background">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">שאלות נפוצות:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
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
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="size-12 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-primary"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
