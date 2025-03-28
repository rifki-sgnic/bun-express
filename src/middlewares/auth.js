import jwt from "jsonwebtoken";
import AuthService from "../services/auth";
import { logger } from "../utils/logger";
import { APP_ENV, JWT_ACCESS_SECRET } from "../config/config";
import UserRepository from "../repositories/user";

export async function authenticate(req, res, next) {
  const refreshToken = req.cookies?.refreshToken;
  let token = extractToken(req);

  try {
    if (!token && !refreshToken) {
      throw { message: "Unauthorized: No token provided", status: 401 };
    }

    if (!token || !isValidBearerToken(token)) {
      throw { message: "Unauthorized: Invalid token format", status: 401 };
    }

    token = token.slice(7, token.length).trim();
    const user = jwt.verify(token, JWT_ACCESS_SECRET);

    req.user = user;
    return next();
  } catch (error) {
    logger.error(error);

    // if accessToken expires then checked if they have refreshToken
    if (!refreshToken) {
      logger.error("Access token expired and no refresh token available");
      return res.handleError(
        { message: "Session expires, please log in again" },
        403
      );
    }

    // If access token is invalid but refresh token exists, try refreshing
    try {
      const { userId, userEmail, newAccessToken } =
        await AuthService.refreshToken(refreshToken);

      req.user = {
        id: userId,
        email: userEmail,
      };
      res.newAccessToken = newAccessToken;

      return next();
    } catch (error) {
      logger.error("Refresh Token Error:", error.message);
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid refresh token",
      });
    }
  }
}

export function authorize(requiredRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        logger.error("Unauthorized: No user found in request");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await UserRepository.getUserById(req.user.id);

      if (!user) {
        logger.error("Unauthorized: User not found");
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!requiredRoles.includes(user.roleName)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      logger.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
}

/**
 * Extracts the token from request headers or cookies.
 * @param {Object} req - Express request object
 * @returns {string|null} The extracted token or null if not found.
 */
function extractToken(req) {
  return req.cookies?.token || req.headers["authorization"] || null;
}

/**
 * Checks if the token is a valid Bearer token.
 * @param {string} token - The token to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidBearerToken(token) {
  return token.startsWith("Bearer ");
}
