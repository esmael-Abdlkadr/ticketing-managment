import dotenv from "dotenv";
import app from "./app";
import { logger } from "./src/config/logger";
import http from "http";
import { connectDb, disconnectDb } from "./src/config/db";
dotenv.config();

const port = process.env.PORT || 3000;
const startServer = async () => {
  await connectDb();

  const server = http.createServer(app);
  server.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
  });
  // /gracefull shutdown.
  const gracefullShutdown = async () => {
    logger.info("shutting down server...");
    server.close(async () => {
      await disconnectDb();

      logger.info("server shut down successfully");
      process.exit(0);
    });
  };
  process.on("SIGINT", gracefullShutdown);
  process.on("SIGTERM", gracefullShutdown);
};

startServer().catch((err: unknown) => {
  if (err instanceof Error) {
    logger.error("Failed to start server", {
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.error("Failed to start server", {
      message: "An unknown error occurred",
    });
  }
  process.exit(1);
});
