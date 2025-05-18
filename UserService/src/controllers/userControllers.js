const userService = require("../services/userService");

const userControllers = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({
        errors: { server: "Lỗi máy chủ, vui lòng thử lại sau." },
      });
    }
  },

  getUserInfo: async (req, res) => {
    const errors = {};
    const { userID } = req.params;

    if (!userID) {
      errors.userID = "Vui lòng cung cấp userID.";
      return res.status(400).json({ errors });
    }

    try {
      const user = await userService.getUserInfo(userID);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          errors: { userID: "Không tìm thấy người dùng." },
        });
      }
    } catch (err) {
      res.status(500).json({
        errors: { server: "Lỗi máy chủ, vui lòng thử lại sau." },
      });
    }
  },

  updateProfile: async (req, res) => {
    const errors = {};
    const { userID } = req.params;

    if (!userID) {
      errors.userID = "Vui lòng cung cấp userID.";
      return res.status(400).json({ errors });
    }

    try {
      const updateFields = {};
      for (const key in req.body) {
        if (req.body[key] !== undefined && req.body[key] !== "") {
          updateFields[key] = req.body[key];
        } else {
          errors[key] = `Vui lòng cung cấp giá trị cho trường ${key}.`;
        }
      }

      if (Object.keys(updateFields).length === 0) {
        errors.fields = "Không có trường hợp lệ để cập nhật.";
        return res.status(400).json({ errors });
      }

      const user = await userService.updateProfile(userID, updateFields);

      if (!user) {
        errors.userID = "Không tìm thấy người dùng.";
        return res.status(404).json({ errors });
      }

      res.status(200).json({
        message: "Cập nhật hồ sơ thành công.",
        user,
      });
    } catch (err) {
      res.status(500).json({
        errors: { server: "Lỗi máy chủ, vui lòng thử lại sau." },
      });
    }
  },

  updateAccountStatus: async (req, res) => {
    const errors = {};
    const { userID } = req.params;
    const { status } = req.body;

    if (!userID) {
      errors.userID = "Vui lòng cung cấp userID.";
      return res.status(400).json({ errors });
    }

    if (!status) {
      errors.status = "Vui lòng cung cấp trạng thái tài khoản.";
      return res.status(400).json({ errors });
    }

    try {
      const user = await userService.updateAccountStatus(userID, status);
      if (!user) {
        errors.userID = "Không tìm thấy người dùng.";
        return res.status(404).json({ errors });
      }
      res.status(200).json({
        message: "Cập nhật trạng thái tài khoản thành công.",
        user,
      });
    } catch (err) {
      res.status(500).json({
        errors: { server: "Lỗi máy chủ, vui lòng thử lại sau." },
      });
    }
  },
};

module.exports = userControllers;
