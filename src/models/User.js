const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    firebaseId: {
      type: String,
      required: [true, "Please provide a firebase ID"],
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please provide a date of birth"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    avatar: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'guest'],
      default: 'guest', // default role khi người dùng chưa đăng nhập
    },
    accountStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
