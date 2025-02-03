const userService = require("../services/userService");
const mongoose = require("mongoose");

const userControllers = {
  //GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  //DELETE USER
  deleteUser: async (req, res) => {
    try {
      const message = await userService.deleteUser(req.params.id);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // LAY THONG TIN USER
  getUserInfo: async (req, res) => {
    const userId = req.query.userId || req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const user = await userService.getUserInfo(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userControllers;
