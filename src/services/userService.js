const User = require("../models/User");

const userService = {
  getAllUsers: async () => {
    return await User.find();
  },

  deleteUser: async (id) => {
    const user = await User.findById(id);
    if (user) {
      await user.remove();
      return "User deleted";
    } else {
      throw new Error("User not found");
    }
  },

  getUserInfo: async (id) => {
    const user = await User.findById(id);
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  },
};

module.exports = userService;