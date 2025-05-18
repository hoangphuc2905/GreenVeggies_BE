const User = require("../models/User");
const authService = require("../services/authService");

const verifiedEmails = new Set();
const otpStore = {};
const verifiedPasswordResetEmails = new Set();

const authControllers = {
  // Gửi OTP khi người dùng nhập email
  sendOtp: async (req, res) => {
    try {
      const { email } = req.query;

      const errors = {};
      if (!email) errors.email = "Vui lòng nhập email.";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const response = await authService.sendOtp(email);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({
        errors: {
          server:
            "Không thể gửi OTP. Có thể email không hợp lệ hoặc hệ thống gặp sự cố.",
        },
      });
    }
  },

  // Kiểm tra OTP và tạo tài khoản người dùng
  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.query;

      const errors = {};
      if (!email) errors.email = "Vui lòng nhập email.";
      if (!otp) errors.otp = "Vui lòng nhập OTP.";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const response = await authService.verifyOtp(email, otp);
      if (response.message === "Xác thực OTP thành công!") {
        verifiedEmails.add(email);
      }
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({
        errors: {
          server:
            "Không thể xác thực OTP. OTP có thể không chính xác hoặc đã hết hạn.",
        },
      });
    }
  },

  // Đăng ký tài khoản
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

      const errors = {};
      if (!email) errors.email = "Vui lòng nhập email.";
      if (!phone) errors.phone = "Vui lòng nhập số điện thoại.";
      if (!username) errors.username = "Vui lòng nhập tên người dùng.";
      if (!password) errors.password = "Vui lòng nhập mật khẩu.";
      if (!dateOfBirth) errors.dateOfBirth = "Vui lòng nhập ngày sinh.";

      if (email && !verifiedEmails.has(email)) {
        errors.email = "Email chưa được xác thực OTP.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
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

      verifiedEmails.delete(email);
      res.status(201).json(response);
    } catch (err) {
      res.status(500).json({
        errors: { server: "Không thể đăng ký tài khoản. Hệ thống gặp sự cố." },
      });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const errors = {};
      if (!email) errors.email = "Vui lòng nhập email.";
      if (!password) errors.password = "Vui lòng nhập mật khẩu.";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          errors: { server: "Tài khoản không tồn tại." },
        });
      }
      if (user.accountStatus === "Suspended") {
        return res.status(403).json({
          errors: {
            server:
              "Tài khoản của bạn đã bị khóa. Vui lòng liên số điện thoại: 0333319121 hoặc email: smileshopptit@gmail.com để được hỗ trợ.",
          },
        });
      }
      if (user.accountStatus !== "Active") {
        return res.status(403).json({
          errors: { server: "Tài khoản chưa được kích hoạt." },
        });
      }

      const response = await authService.login(email, password);
      res
        .status(200)
        .header("Authorization", `Bearer ${response.token}`)
        .json(response);
    } catch (err) {
      res.status(500).json({
        errors: {
          server: "Không thể đăng nhập. Email hoặc mật khẩu không chính xác.",
        },
      });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res
          .status(400)
          .json({ errors: { refreshToken: "Refresh token required" } });
      }

      const result = await authService.refreshToken(refreshToken);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({
        errors: {
          server: err.message || "Không thể làm mới access token.",
        },
      });
    }
  },

  // Quên mật khẩu: Gửi OTP
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.query;

      const errors = {};
      if (!email) errors.email = "Vui lòng nhập email.";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const response = await authService.forgotPassword(email);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({
        errors: {
          server: "Không thể gửi OTP quên mật khẩu. Hệ thống gặp sự cố.",
        },
      });
    }
  },

  // Xác thực OTP để đặt lại mật khẩu
  verifyOtpForPasswordReset: async (req, res) => {
    try {
      const { email, otp } = req.query;

      const errors = {};
      if (!email) errors.email = "Vui lòng nhập email.";
      if (!otp) errors.otp = "Vui lòng nhập OTP.";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const response = await authService.verifyOtpForPasswordReset(email, otp);
      if (
        response.message === "Xác thực OTP thành công - tiếp tục đổi mật khẩu!"
      ) {
        verifiedPasswordResetEmails.add(email);
      }
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({
        errors: {
          server:
            "Không thể xác thực OTP. OTP có thể không chính xác hoặc đã hết hạn.",
        },
      });
    }
  },

  // Cập nhật mật khẩu mới
  updatePassword: async (req, res) => {
    try {
      const { email, newPassword } = req.query;

      const errors = {};
      if (!email) errors.email = "Vui lòng nhập email.";
      if (!newPassword) errors.newPassword = "Vui lòng nhập mật khẩu mới.";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const response = await authService.updatePassword(email, newPassword);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({
        errors: { server: "Không thể cập nhật mật khẩu. Hệ thống gặp sự cố." },
      });
    }
  },

  // Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.query;

      const errors = {};
      if (!email) errors.email = "Vui lòng nhập email.";
      if (!oldPassword) errors.oldPassword = "Vui lòng nhập mật khẩu cũ.";
      if (!newPassword) errors.newPassword = "Vui lòng nhập mật khẩu mới.";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const response = await authService.changePassword(
        email,
        oldPassword,
        newPassword
      );
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({
        errors: { server: "Không thể đổi mật khẩu. Hệ thống gặp sự cố." },
      });
    }
  },
};

module.exports = authControllers;
