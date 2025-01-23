const userService = require("../services/userService");

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
    try {
      const user = await userService.getUserInfo(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userControllers;