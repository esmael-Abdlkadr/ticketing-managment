import { Sentry } from "./instrument";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import compression from "compression";
import { errorMiddleware } from "./src/utils/globalErrorHandler";
import authRouter from "./src/router/authRoute";
import userRouter from "./src/router/userRoute";
import ticketRouter from "./src/router/ticket";
import swaggerSpec from "./swaggerOption";
const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  })
);
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "out of quota, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// app.use(limiter);
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
app.use(compression());
// initEventStatusCron()
// routes.
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tickets", ticketRouter);

Sentry.setupExpressErrorHandler(app);
app.use(errorMiddleware);
export default app;
