import { ErrorType } from "../type";

export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public statusCode?: number,
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = type;
  }
}
