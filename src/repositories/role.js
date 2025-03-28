import Role from "../models/role";

const RoleRepository = {
  async saveRole(roleData) {
    return await Role.create(roleData);
  },
  async getRoleByName(name) {
    return await Role.findOne({ name });
  },
};

export default RoleRepository;
