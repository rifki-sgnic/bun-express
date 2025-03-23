import User from "../models/user";

const UserRepository = {
  async getAllUsers(page = null, limit = null) {
    if (!page || !limit) {
      // No pagination, return all users
      const users = await User.find().select("-password");
      return { users, totalUsers: users.length };
    }

    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(limit).select("-password");
    const totalUsers = await User.countDocuments();

    return { users, totalUsers };
  },

  async getUserById(id) {
    return await User.findById(id);
  },

  async getUserByEmail(email) {
    return await User.findOne({ email });
  },

  async saveUser(userData) {
    userData.password = await Bun.password.hash(userData.password, {
      algorithm: "bcrypt",
      cost: 4,
    });
    const newUser = new User(userData);
    return await newUser.save();
  },
};

export default UserRepository;
