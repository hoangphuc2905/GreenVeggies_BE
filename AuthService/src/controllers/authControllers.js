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
        return res.status(400).json({ message: "Vui lòng nhập email." });
      }

      const response = await authService.sendOtp(email);
      res.status(200).json(response);
    } catch (err) {
      res
        .status(400)
        .json({
          message:
            "Không thể gửi OTP. Có thể email không hợp lệ hoặc hệ thống gặp sự cố.",
        });
    }
  },

  // Kiểm tra OTP và tạo tài khoản người dùng
  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email." });
      }
      if (!otp) {
        return res.status(400).json({ message: "Vui lòng nhập OTP." });
      }

      const response = await authService.verifyOtp(email, otp);
      if (response.message === "Xác thực OTP thành công!") {
        verifiedEmails.add(email);
      }
      res.status(200).json(response);
    } catch (err) {
      res
        .status(400)
        .json({
          message:
            "Không thể xác thực OTP. OTP có thể không chính xác hoặc đã hết hạn.",
        });
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
      } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email." });
      }
      if (!phone) {
        return res.status(400).json({ message: "Vui lòng nhập số điện thoại." });
      }
      if (!username) {
        return res.status(400).json({ message: "Vui lòng nhập tên người dùng." });
      }
      if (!password) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu." });
      }
      if (!dateOfBirth) {
        return res.status(400).json({ message: "Vui lòng nhập ngày sinh." });
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
      res
        .status(400)
        .json({
          message:
            "Không thể đăng ký tài khoản. Có thể thông tin không hợp lệ hoặc hệ thống gặp sự cố.",
        });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email." });
      }
      if (!password) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu." });
      }

      const response = await authService.login(email, password);

      res
        .status(200)
        .header("Authorization", `Bearer ${response.token}`)
        .json(response);
    } catch (err) {
      res
        .status(400)
        .json({
          message: "Không thể đăng nhập. Email hoặc mật khẩu không chính xác.",
        });
    }
  },

  // Quên mật khẩu: Gửi OTP
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email." });
      }

      const response = await authService.forgotPassword(email);
      res.status(200).json(response);
    } catch (err) {
      res
        .status(400)
        .json({
          message:
            "Không thể gửi OTP quên mật khẩu. Có thể email không hợp lệ hoặc hệ thống gặp sự cố.",
        });
    }
  },

  verifyOtpForPasswordReset: async (req, res) => {
    try {
      const { email, otp } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email." });
      }
      if (!otp) {
        return res.status(400).json({ message: "Vui lòng nhập OTP." });
      }

      const response = await authService.verifyOtpForPasswordReset(email, otp);
      if (
        response.message === "Xác thực OTP thành công - tiếp tục đổi mật khẩu!"
      ) {
        verifiedPasswordResetEmails.add(email);
      }
      res.status(200).json(response);
    } catch (err) {
      res
        .status(400)
        .json({
          message:
            "Không thể xác thực OTP. OTP có thể không chính xác hoặc đã hết hạn.",
        });
    }
  },

  // Cập nhật mật khẩu mới
  updatePassword: async (req, res) => {
    try {
      const { email, newPassword } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email." });
      }
      if (!newPassword) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới." });
      }

      const response = await authService.updatePassword(email, newPassword);
      res.status(200).json(response);
    } catch (err) {
      res
        .status(400)
        .json({
          message:
            "Không thể cập nhật mật khẩu. Có thể thông tin không hợp lệ hoặc hệ thống gặp sự cố.",
        });
    }
  },

  // Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.query;
      if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email." });
      }
      if (!oldPassword) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu cũ." });
      }
      if (!newPassword) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới." });
      }

      const response = await authService.changePassword(
        email,
        oldPassword,
        newPassword
      );
      res.status(200).json(response);
    } catch (err) {
      res
        .status(400)
        .json({
          message:
            "Không thể đổi mật khẩu. Có thể thông tin không hợp lệ hoặc hệ thống gặp sự cố.",
        });
    }
  },
};

module.exports = authControllers;
