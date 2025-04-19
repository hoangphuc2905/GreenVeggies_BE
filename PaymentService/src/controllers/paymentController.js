const { generatePaymentQR } = require("../services/paymentService");

const paymentController = {
  createWithQR: async (req, res) => {
    try {
      const { amount } = req.body;

      // Kiểm tra nếu không có số tiền
      if (!amount || amount <= 0) {
        return res.status(400).json({
          errors: { amount: "Vui lòng cung cấp số tiền hợp lệ." },
        });
      }

      // Tạo mã QR thanh toán với các giá trị mặc định
      const qrURL = await generatePaymentQR(amount);

      res.status(200).json({
        message: "Tạo mã QR thanh toán thành công.",
        qrURL, // Trả về URL mã QR
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = paymentController;
