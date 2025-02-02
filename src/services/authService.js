const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("../configs/firebaseConfig");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const otpStore = {};

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

  verifyOtpAndCreateUser: async (userData) => {
    const {
      email,
      otp,
      phone,
      username,
      password,
      dateOfBirth,
      avatar,
      address,
      role,
      accountStatus,
    } = userData;

    const storedOtp = otpStore[email];
    if (
      !storedOtp ||
      storedOtp.otp !== otp ||
      storedOtp.expiresAt < Date.now()
    ) {
      throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn.");
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
      address: address || "",
      role: role || "guest",
      accountStatus: accountStatus || "Active",
    });

    await user.save();
    delete otpStore[email];  
    return { message: "Tài khoản đã được xác thực và lưu thành công!", user };
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
    return { user, token };
  },

  getLatestOtp: (email) => {
    const storedOtp = otpStore[email];
    if (!storedOtp) {
      throw new Error("No OTP found for this email.");
    }
    return storedOtp.otp;
  },
};

module.exports = authService;