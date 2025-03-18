const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderID: {
      type: String,
      required: [true, "Please provide an order ID"],
      unique: true,
    },
    userID: {
      type: String,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    orderDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderDetail",
      },
    ],
    totalQuantity: {
      type: Number,
      required: [true, "Please provide the total quantity of products ordered"],
      min: [1, "Total quantity must be at least 1"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Please provide the total amount for the order"],
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      ref: "PaymentMethod",
    },
  },
  { timestamps: true }
);

// Id hóa đơn theo quy tắc: 1.1	maHoaDon	String	Dãy số mã hóa đơn HĐXXXX + Mã userID + DDMMYY trong đó XXXX là số phát sinh theo quy luật tự tăng từ 1, DDMMYY là ngày tháng năm hiện tại	Tự phát sinh

orderSchema.pre("save", async function (next) {
  const currentDate = new Date();

  const orderDate = `${String(currentDate.getDate()).padStart(2, "0")}${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}${String(currentDate.getFullYear()).slice(2)}`;

  const orderCount = await this.constructor.countDocuments({
    createdAt: {
      $gte: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ),
      $lt: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      ),
    },
  });

  const orderNumber = String(orderCount + 1).padStart(4, "0");

  const userNumber = this.userID.replace(/\D/g, "");

  this.orderID = `HD${orderNumber}${userNumber}${orderDate}`;

  next();
});

module.exports = mongoose.model("Order", orderSchema);
