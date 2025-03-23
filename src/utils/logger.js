import { fileURLToPath } from "bun";
import morgan from "morgan";
import path from "path";
import { createStream } from "rotating-file-stream";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { colorize, errors, combine, timestamp, json, printf } = winston.format;

// Create HTTP Logger Middleware
function httpLogger(isProduction = false) {
  if (!isProduction) return morgan("dev");

  const logStream = createStream("https.log", {
    interval: "1d",
    path: path.join(__dirname, process.env.LOGDIR || "../logs"),
    compress: "gzip",
    maxFiles: 90,
  });

  return morgan("tiny", { stream: logStream });
}

// Create Server Logger
export function serverLogger(expressApp, isProduction = false) {
  let winstonConf = null;

  if (!isProduction) {
    winstonConf = {
      level: "debug",
      format: combine(
        colorize({ all: true }),
        errors({ stack: true }),
        timestamp(),
        printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] (${level}) ${message}`
        )
      ),
      transports: [new winston.transports.Console()],
    };
  } else {
    const fileRotateTransport = new DailyRotateFile({
      filename: "combined-%DATE%.log",
      dirname: path.join(__dirname, process.env.LOGDIR || "../logs"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      zippedArchive: true, // Automatically compress old logs
    });

    winstonConf = {
      level: process.env.LOG_LEVEL || "info",
      format: combine(errors({ stack: true }), timestamp(), json()),
      transports: [fileRotateTransport],
    };
  }

  logger = winston.createLogger(winstonConf);
  expressApp.use(httpLogger(isProduction));
}

// Export Logger
export let logger = null;
