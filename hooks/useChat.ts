/**
 * useChat Hook - Chat State Management
 *
 * Handles chat state, streaming responses, and Convex persistence.
 */

"use client";

import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

/**
 * Message type for local state
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

/**
 * Chat state interface
 */
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  sessionId: Id<"chatSessions"> | null;
  modelUsed: string | null;
  softCapWarning: boolean;
}

/**
 * Chat hook options
 */
export interface UseChatOptions {
  type?: "rights_finder" | "deep_research" | "general";
  sessionId?: Id<"chatSessions">;
  preferredModel?: string;
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: string) => void;
  onSoftCapWarning?: () => void;
}

/**
 * Generate unique message ID
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * useChat Hook
 *
 * Provides chat functionality with streaming and Convex persistence.
 */
export function useChat(options: UseChatOptions = {}) {
  const {
    type = "rights_finder",
    sessionId: initialSessionId,
    preferredModel,
    onMessage,
    onError,
    onSoftCapWarning,
  } = options;

  // State
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isStreaming: false,
    error: null,
    sessionId: initialSessionId || null,
    modelUsed: null,
    softCapWarning: false,
  });

  // Abort controller for canceling streaming
  const abortControllerRef = useRef<AbortController | null>(null);

  // Convex mutations
  const createSession = useMutation(api.chat.createChatSession);
  const sendConvexMessage = useMutation(api.chat.sendMessage);
  const saveAssistantMessage = useMutation(api.chat.saveAssistantMessage);
  const updateSessionTitle = useMutation(api.chat.updateSessionTitle);

  // Load existing session messages if sessionId provided
  const existingMessages = useQuery(
    api.chat.getChatMessages,
    state.sessionId ? { sessionId: state.sessionId } : "skip"
  );

  // Update messages from Convex when loaded
  useEffect(() => {
    if (existingMessages && existingMessages.length > 0) {
      const formattedMessages: ChatMessage[] = existingMessages.map((msg) => ({
        id: msg._id,
        role: msg.role as ChatMessage["role"],
        content: msg.content,
        timestamp: msg.createdAt,
      }));

      setState((prev) => ({
        ...prev,
        messages: formattedMessages,
      }));
    }
  }, [existingMessages]);

  /**
   * Send a message and get streaming response
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || state.isLoading) return;

      // Clear any previous error
      setState((prev) => ({
        ...prev,
        error: null,
        isLoading: true,
      }));

      // Create session if not exists
      let sessionId = state.sessionId;
      if (!sessionId) {
        try {
          sessionId = await createSession({
            type,
            title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          });
          setState((prev) => ({ ...prev, sessionId }));
        } catch (error) {
          const errorMessage = "שגיאה ביצירת שיחה חדשה";
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            isLoading: false,
          }));
          onError?.(errorMessage);
          return;
        }
      }

      // Add user message to local state
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      // Save user message to Convex
      try {
        await sendConvexMessage({ sessionId, content });
      } catch (error) {
        console.error("Failed to save user message:", error);
        // Continue anyway - chat will work but message won't be persisted
      }

      // Add placeholder assistant message
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isStreaming: true,
      }));

      // Create abort controller
      abortControllerRef.current = new AbortController();

      try {
        // Call chat API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            sessionId,
            preferredModel,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          let errorMessage = "שגיאה בקבלת תשובה";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // Use default error message
          }
          throw new Error(errorMessage);
        }

        // Check for soft cap warning header
        const softCapWarning = response.headers.get("X-Soft-Cap-Warning") === "true";
        const modelUsed = response.headers.get("X-Model-Used");

        if (softCapWarning) {
          setState((prev) => ({ ...prev, softCapWarning: true }));
          onSoftCapWarning?.();
        }

        if (modelUsed) {
          setState((prev) => ({ ...prev, modelUsed }));
        }

        // Stream the response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          // Update assistant message with new content
          setState((prev) => {
            const messages = [...prev.messages];
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === "assistant") {
              lastMessage.content = fullContent;
            }
            return { ...prev, messages };
          });
        }

        // Finalize streaming
        setState((prev) => {
          const messages = [...prev.messages];
          const lastMessage = messages[messages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.isStreaming = false;
          }
          return {
            ...prev,
            messages,
            isStreaming: false,
            isLoading: false,
          };
        });

        // Save assistant message to Convex
        if (fullContent && sessionId) {
          try {
            await saveAssistantMessage({
              sessionId,
              content: fullContent,
              modelUsed: modelUsed || undefined,
            });
          } catch (error) {
            console.error("Failed to save assistant message:", error);
          }
        }

        // Notify callback
        if (fullContent) {
          const finalMessage: ChatMessage = {
            id: assistantMessage.id,
            role: "assistant",
            content: fullContent,
            timestamp: Date.now(),
          };
          onMessage?.(finalMessage);
        }
      } catch (error) {
        // Handle abort separately
        if (error instanceof Error && error.name === "AbortError") {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isStreaming: false,
          }));
          return;
        }

        const errorMessage = error instanceof Error ? error.message : "שגיאה לא צפויה";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          isStreaming: false,
        }));
        onError?.(errorMessage);

        // Remove the empty assistant message on error
        setState((prev) => ({
          ...prev,
          messages: prev.messages.filter((m) => m.role !== "assistant" || m.content.length > 0),
        }));
      }
    },
    [
      state.sessionId,
      state.isLoading,
      type,
      preferredModel,
      createSession,
      sendConvexMessage,
      saveAssistantMessage,
      onMessage,
      onError,
      onSoftCapWarning,
    ]
  );

  /**
   * Stop streaming response
   */
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Clear chat history
   */
  const clearChat = useCallback(() => {
    stopStreaming();
    setState({
      messages: [],
      isLoading: false,
      isStreaming: false,
      error: null,
      sessionId: null,
      modelUsed: null,
      softCapWarning: false,
    });
  }, [stopStreaming]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Set preferred model
   */
  const setModelPreference = useCallback((_model: string) => {
    // Model preference is passed to sendMessage, not stored in state
    // This is handled at the hook level via options
  }, []);

  /**
   * Update session title
   */
  const setTitle = useCallback(
    async (title: string) => {
      if (state.sessionId) {
        try {
          await updateSessionTitle({ sessionId: state.sessionId, title });
        } catch (error) {
          console.error("Failed to update session title:", error);
        }
      }
    },
    [state.sessionId, updateSessionTitle]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    messages: state.messages,
    isLoading: state.isLoading,
    isStreaming: state.isStreaming,
    error: state.error,
    sessionId: state.sessionId,
    modelUsed: state.modelUsed,
    softCapWarning: state.softCapWarning,

    // Actions
    sendMessage,
    stopStreaming,
    clearChat,
    clearError,
    setModelPreference,
    setTitle,
  };
}

export default useChat;
