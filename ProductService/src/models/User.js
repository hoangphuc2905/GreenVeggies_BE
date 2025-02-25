const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      unique: true,
      immutable: true,
    },
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
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user", "guest"],
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// USER + 000n+ngày tháng năm : mã userID
userSchema.pre("save", async function (next) {
  if (!this.userID) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const lastUser = await mongoose
      .model("User")
      .findOne()
      .sort({ userID: -1 });

    let newID = `USER0001${year}${month}${day}`;

    if (lastUser && lastUser.userID) {
      const lastID = lastUser.userID;
      const splitID = lastID.split("-");
      const lastNumber = parseInt(splitID[splitID.length - 1]);
      newID = `USER${String(lastNumber + 1).padStart(
        4,
        "0"
      )}${year}${month}${day}`;
    }

    this.userID = newID;
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
