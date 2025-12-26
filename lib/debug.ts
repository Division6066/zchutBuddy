/**
 * Centralized debugging utility for structured logging
 * Supports console logging and optional external endpoint logging
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogData {
  location?: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: number;
  sessionId?: string;
  runId?: string;
  hypothesisId?: string;
  [key: string]: unknown;
}

interface DebugConfig {
  enabled: boolean;
  endpoint?: string;
  sessionId?: string;
}

class DebugLogger {
  private config: DebugConfig;
  private sessionId: string;

  constructor() {
    const enabled =
      process.env.NEXT_PUBLIC_DEBUG_ENABLED === "true" ||
      (typeof window !== "undefined" && window.location.hostname === "localhost");
    const endpoint = process.env.NEXT_PUBLIC_DEBUG_ENDPOINT;
    this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.config = {
      enabled,
      endpoint,
      sessionId: this.sessionId,
    };
  }

  private formatMessage(level: LogLevel, data: LogData): string {
    const prefix = `[DEBUG:${level.toUpperCase()}]`;
    const location = data.location ? `[${data.location}]` : "";
    return `${prefix}${location} ${data.message}`;
  }

  private async sendToEndpoint(data: LogData & { level: LogLevel }): Promise<void> {
    if (!this.config.endpoint || !this.config.enabled) {
      return;
    }

    try {
      await fetch(this.config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sessionId: this.sessionId,
          timestamp: data.timestamp || Date.now(),
        }),
      });
    } catch {
      // Silently fail - external logging is optional
    }
  }

  private log(level: LogLevel, data: LogData): void {
    if (!this.config.enabled) {
      return;
    }

    const formattedMessage = this.formatMessage(level, data);
    const logData = {
      ...data,
      level,
      timestamp: data.timestamp || Date.now(),
      sessionId: this.sessionId,
    };

    // Console logging
    switch (level) {
      case "debug":
      case "info":
        console.log(formattedMessage, data.data || "");
        break;
      case "warn":
        console.warn(formattedMessage, data.data || "");
        break;
      case "error":
        console.error(formattedMessage, data.data || "");
        break;
    }

    // External endpoint logging (async, non-blocking)
    this.sendToEndpoint(logData).catch(() => {
      // Silently fail
    });
  }

  debug(data: LogData): void {
    this.log("debug", data);
  }

  info(data: LogData): void {
    this.log("info", data);
  }

  warn(data: LogData): void {
    this.log("warn", data);
  }

  error(data: LogData): void {
    this.log("error", data);
  }

  getSessionId(): string {
    return this.sessionId;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}

// Export singleton instance
export const debug = new DebugLogger();
