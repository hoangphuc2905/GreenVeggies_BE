const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryID: {
      type: String,
      required: [true, "Please provide a category ID"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
