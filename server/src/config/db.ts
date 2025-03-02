import mongoose, { MongooseError } from "mongoose";
import { logger } from "./logger";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string, {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
    }),
      logger.info("MongoDB connected successfully");
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      logger.error("MongoDB connected failed", {
        message: error.message,
        stack: error.stack,
      });
    } else if (error instanceof Error) {
      logger.error("MongoDB connected failed", {
        message: error.message,
        stack: error.stack,
      });
    } else {
      logger.error("MongoDB connected failed", {
        message: "Unknown error occurred",
        stack: String(error),
      });
    }
  }
};
export const disconnectDb = async () => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      logger.error("MongoDB disconnected failed", {
        message: error.message,
        stack: error.stack,
      });
    } else if (error instanceof Error) {
      logger.error("MongoDB disconnected failed", {
        message: error.message,
        stack: error.stack,
      });
    } else {
      logger.error("MongoDB disconnected failed", {
        message: "Unknown error occurred",
        stack: String(error),
      });
    }
  }
};
