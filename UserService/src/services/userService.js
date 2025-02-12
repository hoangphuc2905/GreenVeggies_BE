const User = require("../models/User");

const userService = {
  getAllUsers: async () => {
    return await User.find().populate("address");
  },

  getUserInfo: async (id) => {
    const user = await User.findById(id).populate("address");
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  },

  // update profile
  updateProfile: async (id, userData) => {
    const user = await User.findByIdAndUpdate(id, userData, {
      new: true,
    }).populate("address");
    if (user) {
      return user;
    }

    throw new Error("User not found");
  },
};

module.exports = userService;
