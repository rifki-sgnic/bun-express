import RoleService from "../services/role";
import { logger } from "../utils/logger";

const RoleController = {
  async createRole(req, res) {
    try {
      const role = await RoleService.addRole(req.body);
      res.handleSuccess(role, "Role created successfully");
    } catch (error) {
      logger.error(error);
      res.handleError(error);
    }
  },
};

export default RoleController;
