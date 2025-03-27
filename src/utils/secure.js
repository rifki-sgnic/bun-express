import cors from "cors";
import { APP_URL } from "../config/config";

export function secureServer(expressApp = null) {
  const corsOptionDev = {
    origin: APP_URL || "*",
    optionSuccessStatus: 200,
    credentials: true,
  };

  const _cors = cors(corsOptionDev);

  if (expressApp) {
    expressApp.disable("x-powered-by");
    expressApp.use(_cors);

    // handle success response
    expressApp.response.handleSuccess = function (
      data = null,
      message = "Success",
      statusCode = 200
    ) {
      if (this.newAccessToken) {
        const newAccessToken = this.newAccessToken;

        return this.status(statusCode).json({
          success: true,
          message,
          data,
          newAccessToken,
        });
      }
      return this.status(statusCode).json({ success: true, message, data });
    };

    // handle error response
    expressApp.response.handleError = function (
      error = { message: "no error message" },
      httpCode = 400
    ) {
      const statusCode = error.status || httpCode;

      let errorMessage = "An error occurred";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error.message) {
        errorMessage = error.message;
      }

      // Convert error to plain text (remove ANSI color codes)
      // eslint-disable-next-line no-control-regex
      errorMessage = errorMessage.replace(/\x1B\[\d+m/g, ""); // Strip ANSI color codes

      return this.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    };
  }

  return _cors;
}
