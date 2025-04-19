const { generatePaymentQR } = require("../services/paymentService");
const Payment = require("../models/Payment"); // Import model Payment

const paymentController = {
  createWithQR: async (req, res) => {
    try {
      const { amount, orderID } = req.body;

      // Kiểm tra số tiền và orderID
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

      // Tạo orderCode duy nhất (dùng để gắn vào addInfo của mã QR)
      const orderCode = `ORDER_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Tạo mã QR với orderCode
      const qrURL = await generatePaymentQR(amount, orderCode);

      // Lưu giao dịch vào collection Payment
      const payment = new Payment({
        orderID,
        paymentMethod: "Bank Transfer",
        paymentStatus: "Pending",
        amount,
        qrURL, // Lưu qrURL (tùy chọn, nếu bạn muốn lưu)
        orderCode, // Lưu orderCode để đối chiếu sau
      });
      await payment.save();

      res.status(200).json({
        message: "Tạo mã QR thanh toán thành công.",
        qrURL,
        paymentID: payment.paymentID,
        orderCode,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = paymentController;
