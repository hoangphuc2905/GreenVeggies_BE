const authService = require("../services/authService");

const verifiedEmails = new Set();
const otpStore = {};
const verifiedPasswordResetEmails = new Set();

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
      if (response.message === "Xác thực OTP thành công!") {
        verifiedEmails.add(email);
      }
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // **Bước 2: Đăng ký tài khoản**
  registerUser: async (req, res) => {
    console.log("Nhận yêu cầu đăng ký:", req.query);

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
      } = req.query;

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

      const response = await authService.createUser({
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
      const { email, password } = req.body;
      const response = await authService.login(email, password);

      res
        .status(200)
        .header("Authorization", `Bearer ${response.token}`)
        .json(response);
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

  verifyOtpForPasswordReset: async (req, res) => {
    try {
      const { email, otp } = req.query;
      const response = await authService.verifyOtpForPasswordReset(email, otp);
      if (response.message === "Xác thực OTP thành công - tiếp tục đổi mật khẩu!") {
        verifiedPasswordResetEmails.add(email);
      }
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Cập nhật mật khẩu mới
  updatePassword: async (req, res) => {
    try {
      const { email, newPassword } = req.query;
      const response = await authService.updatePassword(email, newPassword);
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