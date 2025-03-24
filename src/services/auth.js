import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  LONG_EXPIRES,
  SHORT_EXPIRES,
} from "../config/config";
import UserRepository from "../repositories/user";

const refreshTokens = new Set(); // Temporary storage for refresh tokens

const AuthService = {
  async register({ name, username, email, password }) {
    const existingUser = await UserRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const newUser = {
      name,
      username,
      email,
      password,
    };

    const user = await UserRepository.saveUser(newUser);

    return user;
  },

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
      return { newAccessToken: newAccessToken };
    } catch (error) {
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
