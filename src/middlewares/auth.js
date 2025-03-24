import jwt from "jsonwebtoken";
import AuthService from "../services/auth";
import { logger } from "../utils/logger";
import { APP_ENV, JWT_ACCESS_SECRET } from "../config/config";

export async function authenticate(req, res, next) {
  let token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.cookies?.refreshToken;

  if (!token && !refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    if (token) {
      const user = jwt.verify(token, JWT_ACCESS_SECRET);
      req.user = user;
      return next();
    }
  } catch (err) {
    logger.error("Access Token Invalid or Expired:", err.message);
  }

  // If access token is invalid but refresh token exists, try refreshing
  if (refreshToken) {
    try {
      const { newAccessToken, user } = await AuthService.refreshToken(
        refreshToken
      );

      // Set new access token in cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: APP_ENV === "production",
        sameSite: "Strict",
      });

      req.user = user;
      return next();
    } catch (error) {
      logger.error("Refresh Token Error:", error.message);
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid refresh token" });
    }
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized: Token expired or invalid",
  });
}
