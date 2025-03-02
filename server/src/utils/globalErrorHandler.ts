import { logger } from "../config/logger";
import { Request, Response, NextFunction } from "express";
const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    requestedId: req.headers["x-request-id"],
  });
  //  default error
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected error occurred";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  } else if (err.statusCode === 429) {
    // Handle rate limiting error
    statusCode = 429;
    message = "Too many reservation attempts. Please try again after 24 hours.";
  } else if (err.statusCode === 404) {
    message = "Resource not found";
  }

  // Send error response
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export { errorMiddleware };
