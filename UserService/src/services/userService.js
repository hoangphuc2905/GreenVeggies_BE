const User = require("../models/User");
const Address = require("../models/Address");

const userService = {
  getAllUsers: async () => {
    return await User.find().populate("address");
  },

  getUserInfo: async (userID) => {
    const user = await User.findOne({ userID }).populate("address");
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  },

  // update profile
  updateProfile: async (userID, userData) => {
    const user = await User.findOneAndUpdate({ userID }, userData, {
      new: true,
    }).populate("address");
    if (user) {
      return user;
    }

    throw new Error("User not found");
  },
};

module.exports = userService;
