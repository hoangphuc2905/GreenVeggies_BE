const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("AuthService: Connected to MongoDB");
  } catch (err) {
    console.error("AuthService: Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;
