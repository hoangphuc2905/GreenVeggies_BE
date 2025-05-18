const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userTokenSchema = new Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "7d",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserToken", userTokenSchema);
