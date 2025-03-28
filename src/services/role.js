import RoleRepository from "../repositories/role";

const RoleService = {
  async addRole(roleData) {
    const newRole = await RoleRepository.saveRole(roleData);
    return newRole;
  },
};

export default RoleService;
