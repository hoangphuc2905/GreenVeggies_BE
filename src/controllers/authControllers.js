const authService = require("../services/authService");

const authControllers = {
  // Gửi OTP khi người dùng nhập email
  sendOtp: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email là bắt buộc." });
      }
      
      const response = await authService.sendOtp(email);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Kiểm tra OTP và tạo tài khoản người dùng
  verifyOtpAndCreateUser: async (req, res) => {
    try {
      const { email, otp, phone, username, password, dateOfBirth, avatar, address, role, accountStatus } = req.body;

      if (!email || !otp || !phone || !username || !password || !dateOfBirth) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ các trường: email, otp, phone, username, password và dateOfBirth."
        });
      }

      const response = await authService.verifyOtpAndCreateUser({
        email,
        otp,
        phone,
        username,
        password,
        dateOfBirth,
        avatar,
        address,
        role,
        accountStatus
      });
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const response = await authService.login(email, password);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = authControllers;