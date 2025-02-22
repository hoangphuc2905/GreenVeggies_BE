const User = require("../models/User");
const Address = require("../models/Address");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../configs/firebase");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const otpStore = {};
const verifiedEmails = new Set();
const verifiedPasswordResetEmails = new Set();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const authService = {
  sendOtp: async (email) => {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email đã được sử dụng, vui lòng chọn email khác.");
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Xác thực OTP",
        text: `Mã OTP của bạn: ${otp}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });

      return { message: "Vui lòng kiểm tra email để nhận mã xác thực OTP." };
    } catch (error) {
      throw new Error("Lỗi gửi OTP: " + error.message);
    }
  },

  verifyOtp: async (email, otp) => {
    const storedOtp = otpStore[email];
    if (
      !storedOtp ||
      storedOtp.otp !== otp ||
      storedOtp.expiresAt < Date.now()
    ) {
      throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn.");
    }

    verifiedEmails.add(email);
    delete otpStore[email];
    console.log("Danh sách email đã xác thực:", verifiedEmails);

    return { message: "Xác thực OTP thành công!" };
  },

  // Đăng ký tài khoản
  createUser: async (userData) => {
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
    } = userData;

    console.log("Danh sách email đã xác thực khi đăng ký:", verifiedEmails);
    console.log("Dữ liệu đăng ký:", userData);
    if (!verifiedEmails.has(email)) {
      throw new Error("Email chưa được xác thực OTP.");
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { username }],
    });
    if (existingUser) {
      throw new Error("User đã tồn tại.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const dob = new Date(dateOfBirth);

    const user = new User({
      email,
      phone,
      username,
      password: hashedPassword,
      dateOfBirth: dob,
      avatar: avatar || "",
      role: role || "guest",
      accountStatus: accountStatus || "Active",
    });

    await user.save();

    if (address) {
      const newAddress = new Address({ userID: user._id, ...address });
      await newAddress.save();

      user.address = newAddress._id;
      await user.save();
    }

    // Remove email from verifiedEmails after successful registration
    verifiedEmails.delete(email);

    return { message: "Tài khoản đã được tạo thành công!", user };
  },

  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user._id }, process.env.MYSECRET, {
      expiresIn: "1h",
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  },

  getLatestOtp: (email) => {
    const storedOtp = otpStore[email];
    if (!storedOtp) {
      throw new Error("No OTP found for this email.");
    }
    return storedOtp.otp;
  },

  // Quên mật khẩu: Gửi OTP
  forgotPassword: async (email) => {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("User not found");
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác thực OTP",
      text: `Mã OTP của bạn: ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    return { message: "Vui lòng kiểm tra email để nhận mã xác thực OTP." };
  },

  verifyOtpForPasswordReset: async (email, otp) => {
    const storedOtp = otpStore[email];
    if (
      !storedOtp ||
      storedOtp.otp !== otp ||
      storedOtp.expiresAt < Date.now()
    ) {
      throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn.");
    }

    verifiedPasswordResetEmails.add(email);
    delete otpStore[email];

    return { message: "Xác thực OTP thành công - tiếp tục đổi mật khẩu!" };
  },

  // Cập nhật mật khẩu mới sau khi OTP đã được xác thực
  updatePassword: async (email, newPassword) => {
    if (!verifiedPasswordResetEmails.has(email)) {
      throw new Error("Email chưa được xác thực OTP.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    verifiedPasswordResetEmails.delete(email); // Xóa email khỏi danh sách đã xác thực
    return { message: "Mật khẩu đã được cập nhật thành công!" };
  },

  // Đổi mật khẩu
  changePassword: async (email, oldPassword, newPassword) => {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    return { message: "Mật khẩu đã được cập nhật thành công!" };
  },
};

module.exports = authService;