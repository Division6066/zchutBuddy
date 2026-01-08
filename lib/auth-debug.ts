/**
 * Authentication Debugging Utilities
 * Provides structured logging for auth flow with [AUTH] prefix
 * All logs include timestamps for debugging magic link redirects
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface AuthLogData {
  component?: string;
  action?: string;
  email?: string;
  redirectTo?: string;
  url?: string;
  statusCode?: number;
  error?: string;
  message: string;
  [key: string]: unknown;
}

class AuthDebugger {
  private isEnabled: boolean;

  constructor() {
    // Enable in development or when NEXT_PUBLIC_DEBUG_ENABLED is set
    this.isEnabled =
      process.env.NEXT_PUBLIC_DEBUG_ENABLED === "true" ||
      (typeof window !== "undefined" && window.location.hostname === "localhost") ||
      process.env.NODE_ENV === "development";
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatLog(level: LogLevel, data: AuthLogData): string {
    const timestamp = this.formatTimestamp();
    const component = data.component ? ` | ${data.component}` : "";
    const action = data.action ? ` | ${data.action}` : "";
    const prefix = `[AUTH:${level.toUpperCase()}] ${timestamp}${component}${action}`;

    let details = data.message;
    if (data.email) details += ` | email: ${data.email}`;
    if (data.redirectTo) details += ` | redirectTo: ${data.redirectTo}`;
    if (data.statusCode) details += ` | statusCode: ${data.statusCode}`;
    if (data.error) details += ` | error: ${data.error}`;

    return `${prefix}\n  ${details}`;
  }

  private log(level: LogLevel, data: AuthLogData): void {
    if (!this.isEnabled) return;

    const formatted = this.formatLog(level, data);

    switch (level) {
      case "debug":
        console.log(formatted);
        break;
      case "info":
        console.log(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "error":
        console.error(formatted);
        break;
    }

    // Also log the full data object for inspection
    if (typeof window !== "undefined") {
      console.log("  Full data:", data);
    }
  }

  /**
   * Log sign-in flow events
   */
  logSignIn(data: { email: string; redirectTo: string; message: string; error?: string }): void {
    this.info({
      component: "SignIn",
      action: "MagicLink",
      email: data.email,
      redirectTo: data.redirectTo,
      message: data.message,
      error: data.error,
    });
  }

  /**
   * Log authentication state changes
   */
  logAuthState(data: { isAuthenticated: boolean; isLoading: boolean; message: string }): void {
    this.info({
      component: "Auth",
      action: "StateChange",
      message: `${data.message} (authenticated: ${data.isAuthenticated}, loading: ${data.isLoading})`,
    });
  }

  /**
   * Log redirect decisions
   */
  logRedirect(data: {
    source: string;
    target: string;
    reason: string;
    authenticated?: boolean;
  }): void {
    this.info({
      component: "Redirect",
      action: "Navigate",
      message: `${data.reason}`,
      redirectTo: data.target,
      error: data.authenticated !== undefined ? `authenticated: ${data.authenticated}` : undefined,
    });
  }

  /**
   * Log magic link URL generation and processing
   */
  logMagicLinkUrl(data: { url: string; message: string; hasRedirectTo?: boolean }): void {
    this.debug({
      component: "MagicLink",
      action: "URL",
      message: data.message,
      url: data.url.substring(0, 100) + (data.url.length > 100 ? "..." : ""),
      error: data.hasRedirectTo !== undefined ? `hasRedirectTo: ${data.hasRedirectTo}` : undefined,
    });
  }

  /**
   * Log email sending events
   */
  logEmailEvent(data: { email: string; subject: string; success: boolean; error?: string }): void {
    const level = data.success ? "info" : "error";
    this[level]({
      component: "Email",
      action: "Send",
      email: data.email,
      message: `${data.subject} - ${data.success ? "sent successfully" : "failed"}`,
      error: data.error,
    });
  }

  /**
   * Log middleware processing
   */
  logMiddleware(data: {
    path: string;
    message: string;
    authenticated?: boolean;
    redirectTarget?: string;
  }): void {
    this.info({
      component: "Middleware",
      action: "Process",
      message: `${data.path} - ${data.message}`,
      redirectTo: data.redirectTarget,
      error: data.authenticated !== undefined ? `authenticated: ${data.authenticated}` : undefined,
    });
  }

  /**
   * Log callback processing
   */
  logCallback(data: {
    provider: string;
    hasCode: boolean;
    hasRedirectTo: boolean;
    message: string;
  }): void {
    this.info({
      component: "Callback",
      action: data.provider,
      message: `${data.message} (code: ${data.hasCode}, redirectTo: ${data.hasRedirectTo})`,
    });
  }

  /**
   * Generic debug log
   */
  debug(data: AuthLogData): void {
    this.log("debug", data);
  }

  /**
   * Generic info log
   */
  info(data: AuthLogData): void {
    this.log("info", data);
  }

  /**
   * Generic warn log
   */
  warn(data: AuthLogData): void {
    this.log("warn", data);
  }

  /**
   * Generic error log
   */
  error(data: AuthLogData): void {
    this.log("error", data);
  }

  /**
   * Check if debugging is enabled
   */
  isDebugging(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const authDebug = new AuthDebugger();
