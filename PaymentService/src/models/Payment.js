const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentID: {
      type: String,
      required: [true, "Please provide a payment ID"],
      unique: true,
    },
    orderID: {
      type: String,
      ref: "Order",
      required: [true, "Please provide an order ID"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Please provide a payment method"],
      enum: ["Momo", "Bank Transfer", "Cash"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    amount: {
      type: Number,
      required: [true, "Please provide the payment amount"],
      min: [0, "Payment amount must be greater than or equal to 0"],
    },
    qrURL: {
      type: String, // Lưu URL mã QR
    },
    orderCode: {
      type: String, // Lưu mã giao dịch để đối chiếu
    },
  },
  { timestamps: true }
);

// Middleware để tự động tạo paymentID
paymentSchema.pre("save", async function (next) {
  if (!this.paymentID) {
    const currentDate = new Date();
    const datePart = `${String(currentDate.getDate()).padStart(2, "0")}${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}${String(currentDate.getFullYear()).slice(2)}`;

    const paymentCount = await this.constructor.countDocuments({
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

    const paymentNumber = String(paymentCount + 1).padStart(4, "0");
    this.paymentID = `PM${paymentNumber}${datePart}`;
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
