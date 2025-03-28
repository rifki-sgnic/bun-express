import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  LONG_EXPIRES,
  SHORT_EXPIRES,
} from "../config/config";
import UserRepository from "../repositories/user";
import { logger } from "../utils/logger";
import RoleRepository from "../repositories/role";

const refreshTokens = new Set(); // Temporary storage for refresh tokens

/**
 * Service for handling authentication-related operations.
 */
const AuthService = {
  /**
   * Register a new user
   *
   * @async
   * @param {Object} userData - the user data
   * @param {string} userData.name - the name of user
   * @param {string} userData.username - the username of user
   * @param {string} userData.email - the email of user
   * @param {string} userData.password - the password of user
   * @returns {Promise<Object>} - newly created user
   */
  async register({ name, username, email, password }) {
    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const role = await RoleRepository.getRoleByName("user");
    if (!role) {
      throw new Error("Role not found");
    }

    const newUser = {
      name,
      username,
      email,
      password,
      roleId: role._id,
      roleName: role.name,
    };

    const user = await UserRepository.saveUser(newUser);

    return user;
  },

  /**
   * Logs in a user
   *
   * @async
   * @param {Object} credentials - the login credentials
   * @param {string} credentials.email - the email of user
   * @param {string} credentials.password - the password of user
   * @returns {Promise<Object>} - an object containing the token, refresh token, and user
   */
  async login({ email, password }) {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.add(refreshToken);

    delete user.password;

    return { token, refreshToken, user };
  },

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      const newAccessToken = generateAccessToken(decoded);

      return {
        userId: decoded.id,
        userEmail: decoded.email,
        newAccessToken: newAccessToken,
      };
    } catch (error) {
      logger.error("Refresh Token Error:", error.message);
      throw new Error("Invalid refresh token");
    }
  },

  logout(refreshToken) {
    refreshTokens.delete(refreshToken);
  },
};

function generateAccessToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_ACCESS_SECRET, {
    expiresIn: SHORT_EXPIRES,
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_REFRESH_SECRET, {
    expiresIn: LONG_EXPIRES,
  });
}

export default AuthService;
