import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import { APP_ENV, PORT } from "./src/config/config";
import { connectDB } from "./src/config/db";
import router from "./src/routes";
import { logger, serverLogger } from "./src/utils/logger";
import { secureServer } from "./src/utils/secure";

const app = express();
const isProduction = APP_ENV === "production";

// connect mongo
connectDB();

// server utils
secureServer(app, isProduction);
serverLogger(app, isProduction);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Bun Express API" });
});

// Routes
app.use("/api/v1", router);

app.use((err, req, res, next) => {
  logger.error(`Error in ${req.method} ${req.originalUrl}: ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("*", (req, res) => {
  res.json({ message: "no endpoints" });
});

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
