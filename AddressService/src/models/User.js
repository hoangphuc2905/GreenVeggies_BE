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
    dateOfBirth: {
      type: Date,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
    avatar: {
      type: String,
      default: "default.jpg",
    },
    address: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: false,
    }],
    role: {
      type: String,
      enum: ['admin', 'user', 'guest'],
      default: 'guest', 
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
