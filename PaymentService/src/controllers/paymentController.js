const {
  generatePaymentQR,
  updatePaymentStatus,
} = require("../services/paymentService");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

const paymentController = {
  createPayment: async (req, res) => {
    try {
      const { amount, orderID, paymentMethod } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          errors: { amount: "Vui lòng cung cấp số tiền hợp lệ." },
        });
      }
      if (!orderID) {
        return res.status(400).json({
          errors: { orderID: "Vui lòng cung cấp orderID." },
        });
      }
      if (
        !paymentMethod ||
        !["Bank Transfer", "Cash"].includes(paymentMethod)
      ) {
        return res.status(400).json({
          errors: {
            paymentMethod: "Vui lòng cung cấp phương thức thanh toán hợp lệ.",
          },
        });
      }

      const order = await Order.findOne({ orderID });
      if (!order) {
        return res.status(404).json({
          errors: { orderID: "Không tìm thấy đơn hàng với ID đã cung cấp." },
        });
      }

      const randomCode = Math.floor(100000 + Math.random() * 900000);
      const content = `TT${randomCode}`;

      let qrURL = null;
      if (paymentMethod === "Bank Transfer") {
        qrURL = await generatePaymentQR(amount, content);
      }

      const payment = new Payment({
        orderID,
        paymentMethod,
        paymentStatus: "Pending",
        amount,
        content,
      });
      await payment.save();

      res.status(200).json({
        message: "Tạo thanh toán thành công.",
        paymentID: payment.paymentID,
        qrURL,
        orderID,
        paymentMethod,
        paymentStatus: payment.paymentStatus,
        amount,
        content,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { paymentID, newStatus } = req.body;

      if (!paymentID || !newStatus) {
        return res.status(400).json({
          errors: { message: "Vui lòng cung cấp paymentID và trạng thái mới." },
        });
      }

      const updatedPayment = await updatePaymentStatus(paymentID, newStatus);

      res.status(200).json({
        message: "Cập nhật trạng thái thanh toán thành công.",
        payment: updatedPayment,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = paymentController;
