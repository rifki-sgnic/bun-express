import RoleRepository from "../repositories/role";
import UserRepository from "../repositories/user";
import CacheService from "./cache";

const UserService = {
  async fetchUsers({ page, limit }) {
    if (page && limit) {
      page = parseInt(page);
      limit = parseInt(limit);

      if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new Error("Invalid page or limit value");
      }
    } else {
      page = null;
      limit = null;
    }

    const { users, totalUsers } = await UserRepository.getAllUsers(page, limit);
    if (!page || !limit) return { users, total: totalUsers };

    return {
      metadata: {
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
      users,
      total: totalUsers,
    };
  },

  async fetchUserById(id) {
    const cachedUser = await CacheService.getUserById(id);
    if (cachedUser) return cachedUser;

    const user = await UserRepository.getUserById(id);
    if (!user) throw new Error(`User ${id} not found`);
    await CacheService.setUser(id, user);

    return user;
  },

  async fetchUserByEmail(email) {
    const cachedUser = await CacheService.getUserByEmail(email);
    if (cachedUser) return cachedUser;

    const user = UserRepository.getUserByEmail(email);
    if (!user) throw new Error(`User ${email} not found`);
    // await CacheService.setUser(email, user);

    return user;
  },

  async addUser(userData) {
    const { name, username, email, password } = userData;
    if (!name || !username || !email || !password)
      throw new Error("Name, Username, Email and Password are required");

    const role = await RoleRepository.getRoleByName("user"); // set default role to user
    if (!role) {
      throw new Error("Role not found");
    }

    const newUser = await UserRepository.saveUser({
      ...userData,
      roleId: role._id,
      roleName: role.name,
    });

    // Clear cache for this user so next fetch will be fresh
    await CacheService.clearUserCache(newUser._id.toString());

    return newUser;
  },
};

export default UserService;
