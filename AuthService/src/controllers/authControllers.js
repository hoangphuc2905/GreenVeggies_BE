const authService = require("../services/authService");

const verifiedEmails = new Set();

const authControllers = {
  // Gửi OTP khi người dùng nhập email
  sendOtp: async (req, res) => {
    try {
      const { email } = req.query;
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
  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.query;
      if (!email || !otp) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ email và OTP.",
        });
      }

      const response = await authService.verifyOtp(email, otp);
      if (response.success) {
        verifiedEmails.add(email); 
      }
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // **Bước 2: Đăng ký tài khoản**
  registerUser: async (req, res) => {
    try {
      const {
        email,
        phone,
        username,
        password,
        dateOfBirth,
        avatar,
        address,
        role,
        accountStatus,
      } = req.body;

      if (!email || !phone || !username || !password || !dateOfBirth) {
        return res.status(400).json({
          message:
            "Vui lòng nhập đầy đủ các trường: email, phone, username, password, dateOfBirth.",
        });
      }

      // Kiểm tra xem email đã được xác thực OTP chưa
      if (!verifiedEmails.has(email)) {
        return res
          .status(400)
          .json({ message: "Email chưa được xác thực OTP." });
      }

      const response = await authService.registerUser({
        email,
        phone,
        username,
        password,
        dateOfBirth,
        avatar,
        address,
        role,
        accountStatus,
      });

      // Xóa email khỏi danh sách đã xác thực (để tránh đăng ký lại)
      verifiedEmails.delete(email);

      res.status(201).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.query;
      const response = await authService.login(email, password);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Quên mật khẩu: Gửi OTP
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Email là bắt buộc." });
      }

      const response = await authService.forgotPassword(email);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Quên mật khẩu: Đổi mật khẩu
  verifyOtpAndUpdatePassword: async (req, res) => {
    try {
      const { email, otp, password } = req.query;
      if (!email || !otp || !password) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ các trường: email, otp và password.",
        });
      }

      const response = await authService.verifyOtpAndUpdatePassword(
        email,
        otp,
        password
      );
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.query;
      if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({
          message:
            "Vui lòng nhập đầy đủ các trường: email, oldPassword và newPassword.",
        });
      }

      const response = await authService.changePassword(
        email,
        oldPassword,
        newPassword
      );
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = authControllers;
