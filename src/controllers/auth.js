import { APP_ENV } from "../config/config";
import AuthService from "../services/auth";
import { logger } from "../utils/logger";

const AuthcController = {
  async register(req, res) {
    try {
      const { name, username, email, password } = req.body;
      const user = await AuthService.register({
        name,
        username,
        email,
        password,
      });
      res.handleSuccess(user, "user registered successfully");
    } catch (error) {
      logger.error(error);
      res.handleError(error);
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, refreshToken, user } = await AuthService.login({
        email,
        password,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: APP_ENV === "production",
        sameSite: "strict",
      });

      res.handleSuccess({ token, user }, "Login successful");
    } catch (error) {
      logger.error(error);
      res.handleError(error, 401);
    }
  },

  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) throw new Error("Refresh token required");

      const { accessToken } = await AuthService.refreshToken(refreshToken);

      res.handleSuccess({ accessToken }, "Token refreshed");
    } catch (error) {
      res.handleError(error, 403);
    }
  },

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ message: "You are not logged in" });
      }
      AuthService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.handleSuccess(null, "Logout successful");
    } catch (error) {
      res.handleError(error);
    }
  },
};

export default AuthcController;
