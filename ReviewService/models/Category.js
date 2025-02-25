const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryID: {
      type: String,
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

// Tạo categoryID tự động
categorySchema.pre("save", async function (next) {
  if (!this.categoryID) {
    const lastCategory = await this.constructor
      .findOne()
      .sort({ createdAt: -1 });
    const lastNumber = lastCategory
      ? parseInt(lastCategory.categoryID.replace("CATE", ""))
      : 0;
    this.categoryID = `CATE${String(lastNumber + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
