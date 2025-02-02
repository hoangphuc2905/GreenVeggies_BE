const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const authService = {
  register: async (userData) => {
    const { email, phone, username, password } = userData;

    try {
      await admin.auth().getUserByEmail(email);
      throw new Error("Email đã được sử dụng, vui lòng xác thực hoặc chọn email khác.");
    } catch (error) {
      if (error.code !== "auth/user-not-found") {
        throw new Error("Lỗi kiểm tra email trên Firebase.");
      }
    }

    const firebaseUser = await admin.auth().createUser({
      email,
      emailVerified: false,  
      password,
      displayName: username,
      disabled: false,
    });

    console.log(`📩 Email xác thực đã được gửi đến ${email}`);

    return {
      message: "Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.",
    };
  },

  confirmAndSaveUser: async (email, phone, username, password) => {
    const firebaseUser = await admin.auth().getUserByEmail(email);
    if (!firebaseUser.emailVerified) {
      throw new Error("Email chưa được xác thực. Vui lòng xác thực trước khi tiếp tục.");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }, { username }] });
    if (existingUser) {
      throw new Error("User đã tồn tại.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, phone, username, password: hashedPassword });
    await user.save();

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

    const token = jwt.sign({ id: user._id }, process.env.MYSECRET, { expiresIn: "1h" });

    return { user, token };
  },
};

module.exports = authService;
