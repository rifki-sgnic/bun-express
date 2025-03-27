import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import { APP_ENV, PORT } from "./src/config/config";
import { connectDB } from "./src/config/db";
import router from "./src/routes";
import { logger, serverLogger } from "./src/utils/logger";
import { secureServer } from "./src/utils/secure";
import { titleServer } from "./src/utils/title";

const app = express();
const isProduction = APP_ENV === "production";

// server utils
secureServer(app);
serverLogger(app, isProduction);
titleServer("Bun Express");

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Bun Express API" });
});

// Routes
app.use("/api/v1", router);

app.use((err, req, res) => {
  logger.error(`Error in ${req.method} ${req.originalUrl}: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("*", (req, res) => {
  res.json({ message: "no endpoints" });
});

// connect mongoDB
logger.verbose("Connecting to MongoDB and Redis ...");
connectDB()
  .then(() => {
    // starting server
    app
      .listen(PORT, () => {
        logger.info(`🚀 Server running on http://localhost:${PORT}`);
      })
      .on("error", (error) => logger.error(error.message)); // error starting server for other reason

    // any unhandled promise rejection
    process.on("unhandledRejection", (reason) => {
      logger.error(new Error(`reason: ${reason}`));
    });

    process.on("uncaughtException", (error) => {
      logger.error(error.message);
      process.exit(1);
    });
  })
  .catch((error) => {
    logger.error(error.message);
  });
