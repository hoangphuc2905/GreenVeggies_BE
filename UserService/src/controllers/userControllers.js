const userService = require("../services/userService");

const userControllers = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // LAY THONG TIN USER
  getUserInfo: async (req, res) => {
    const userID = req.query.userID;

    try {
      const user = await userService.getUserInfo(userID);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateProfile: async (req, res) => {
    const userID = req.query.userID || req.params.id;

    try {
      const updateFields = {};
      for (const key in req.body) {
        if (req.body[key] !== undefined && req.body[key] !== "") {
          updateFields[key] = req.body[key];
        }
      }

      // Nếu không có trường nào để cập nhật, trả về lỗi
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      // Nếu có mật khẩu, hash trước khi cập nhật
      if (updateFields.password) {
        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(updateFields.password, salt);
      }

      const user = await userService.updateProfile(userID, updateFields);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userControllers;
