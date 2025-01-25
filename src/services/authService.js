const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// data test login  
// "email": "testuser@example.com",
//   "password": "password123"


const authService = {
  register: async (userData) => {
    const { email, phone, username, password } = userData;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }, { username }] });
    if (existingUser) {
      throw new Error("User with this email, phone, or username already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...userData, password: hashedPassword });
    return await user.save();
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