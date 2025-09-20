class Logger {
  constructor() {
    // Handle environment variables safely for browser environment
    this.isDevelopment =
      (typeof process !== "undefined" &&
        process.env?.NODE_ENV === "development") ||
      import.meta.env?.DEV ||
      false;

    this.logToServer =
      (typeof process !== "undefined" &&
        process.env?.REACT_APP_LOG_TO_SERVER === "true") ||
      import.meta.env?.VITE_LOG_TO_SERVER === "true" ||
      false;
  }

  // Format log messages consistently
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      meta: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: meta.userId || null,
        ...meta,
      },
    };
  }

  // Send logs to backend Winston logger
  async sendToServer(logData) {
    if (!this.logToServer) return;

    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt") || ""}`,
        },
        body: JSON.stringify(logData),
      });
    } catch (error) {
      // Silently fail to avoid infinite logging loops
      if (this.isDevelopment) {
        console.warn("Failed to send log to server:", error.message);
      }
    }
  }

  info(message, meta = {}) {
    const logData = this.formatMessage("info", message, meta);

    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, meta);
    }

    this.sendToServer(logData);
  }

  warn(message, meta = {}) {
    const logData = this.formatMessage("warn", message, meta);

    console.warn(`[WARN] ${message}`, meta);
    this.sendToServer(logData);
  }

  error(message, error = null, meta = {}) {
    const logData = this.formatMessage("error", message, {
      ...meta,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
            type: error.constructor.name,
          }
        : null,
    });

    console.error(`[ERROR] ${message}`, error, meta);
    this.sendToServer(logData);
  }

  // Log user actions for analytics
  userAction(action, meta = {}) {
    const logData = this.formatMessage("info", `User action: ${action}`, {
      ...meta,
      category: "user_action",
      action,
    });

    if (this.isDevelopment) {
      console.log(`[USER ACTION] ${action}`, meta);
    }

    this.sendToServer(logData);
  }

  // Log authentication events
  auth(event, meta = {}) {
    const logData = this.formatMessage("info", `Auth event: ${event}`, {
      ...meta,
      category: "authentication",
      event,
    });

    if (this.isDevelopment) {
      console.log(`[AUTH] ${event}`, meta);
    }

    this.sendToServer(logData);
  }
}

export default new Logger();
