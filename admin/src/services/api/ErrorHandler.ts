import toast from "react-hot-toast";
import { ErrorResponse } from "../../type";

class ErrorTracker {
  private static instance: ErrorTracker;
  private shownErrors: Map<string, number>;
  private hasActiveNetworkError: boolean;
  private networkErrorTimeout: NodeJS.Timeout | null;
  private lastNetworkErrorTime: number;

  private readonly ERROR_TIMEOUT = 5000;
  private readonly NETWORK_ERROR_TIMEOUT = 15000;

  private constructor() {
    this.shownErrors = new Map();
    this.hasActiveNetworkError = false;
    this.networkErrorTimeout = null;
    this.lastNetworkErrorTime = 0;
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private clearNetworkError = () => {
    this.hasActiveNetworkError = false;
    if (this.networkErrorTimeout) {
      clearTimeout(this.networkErrorTimeout);
      this.networkErrorTimeout = null;
    }
  };

  handleError(error: unknown): string {
    const now = Date.now();
    this.cleanupOldErrors(now);

    if (this.isNetworkError(error)) {
      return this.handleNetworkError(now);
    }

    return this.handleApiError(error, now);
  }

  private cleanupOldErrors(now: number) {
    for (const [key, timestamp] of this.shownErrors.entries()) {
      if (now - timestamp > this.ERROR_TIMEOUT) {
        this.shownErrors.delete(key);
      }
    }
  }

  private isNetworkError(error: any): boolean {
    return error?.message === "Network Error" || !error?.response;
  }

  private handleNetworkError(now: number): string {
    if (
      this.hasActiveNetworkError &&
      now - this.lastNetworkErrorTime < this.NETWORK_ERROR_TIMEOUT
    ) {
      return "Network error occurred";
    }

    this.hasActiveNetworkError = true;
    this.lastNetworkErrorTime = now;

    if (this.networkErrorTimeout) {
      clearTimeout(this.networkErrorTimeout);
    }

    this.networkErrorTimeout = setTimeout(
      this.clearNetworkError,
      this.NETWORK_ERROR_TIMEOUT
    );

    const toastId = `network-error-${now}`;
    toast.error("Unable to connect to server. Please check your connection.", {
      id: toastId,
    });

    return "Network error occurred";
  }

  private handleApiError(error: any, now: number): string {
    const errorResponse = this.parseErrorResponse(error);
    const errorKey = this.getErrorKey(error);

    this.shownErrors.set(errorKey, now);
    toast.error(errorResponse.message, {
      id: `${errorKey}-${now}`,
    });

    return errorResponse.message;
  }

  private parseErrorResponse(error: any): ErrorResponse {
    if (error?.response?.status === 429) {
      return { message: "Too many requests. Please try again later." };
    }
    if (error?.response?.status === 401) {
      return {
        message: error.response.data.message || "Authentication required",
      };
    }
    if (error?.response?.status >= 500) {
      return { message: "Server error. Please try again later." };
    }
    if (error?.response?.data?.message) {
      return { message: error.response.data.message };
    }
    return { message: "An unexpected error occurred" };
  }

  private getErrorKey(error: any): string {
    if (error?.response?.status === 401) return "auth";
    if (error?.response?.status >= 500) return "server";
    return `custom-${error?.response?.status || "unknown"}`;
  }
}

export const handleError = (error: unknown): string => {
  return ErrorTracker.getInstance().handleError(error);
};
