import UserService from "../services/user";
import { logger } from "../utils/logger";

const UserController = {
  async getUsers(req, res) {
    try {
      const users = await UserService.fetchUsers(req.query);
      res.handleSuccess(users, "get all users success");
    } catch (error) {
      logger.error(error);
      res.handleError(error);
    }
  },

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.fetchUserById(id);

      res.handleSuccess(user, "get user success");
    } catch (error) {
      logger.error(error);
      res.handleError(error);
    }
  },

  async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await UserService.fetchUserByEmail(email);

      res.handleSuccess(user, "get user success");
    } catch (error) {
      logger.error(error);
      res.handleError(error);
    }
  },

  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await UserService.addUser(userData);

      res.handleSuccess(newUser, "user created success");
    } catch (error) {
      if (error.code === 11000) {
        logger.warn(`Duplicate user creation attempt: ${req.body.email}`);
        return res.handleError({ message: "Email is already in use" }, 400);
      }

      logger.error(error);
      res.handleError(error);
    }
  },
};

export default UserController;
