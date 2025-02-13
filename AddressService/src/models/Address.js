const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    city: {
      type: String,
      required: [true, "Please provide a city"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "Please provide a district"],
      trim: true,
    },
    ward: {
      type: String,
      required: [true, "Please provide a ward"],
      trim: true,
    },
    street: {
      type: String,
      required: [true, "Please provide a street"],
      trim: true,
    },
    default: {
      type: Boolean,
      default: false, // đánh dấu địa chỉ mặc định
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
