const Payment = require("../models/Payment");

const generatePaymentQR = async (amount, orderCode) => {
  const bankCode = "MB";
  const accountNumber = "868629052003";
  const accountName = "HUYNH HOANG PHUC";
  const description = `Thanh toan don hang ${orderCode}`;
  const encodedDescription = encodeURIComponent(description);
  const encodedName = encodeURIComponent(accountName);
  const qrURL = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodedName}&acqId=970422`;
  return qrURL;
};

const updatePaymentStatus = async (paymentID, newStatus) => {
  try {
    const validStatuses = ["Pending", "Completed", "Failed", "Refunded"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Trạng thái thanh toán không hợp lệ.");
    }

    const payment = await Payment.findOneAndUpdate(
      { paymentID },
      { paymentStatus: newStatus },
      { new: true }
    );

    if (!payment) {
      throw new Error("Không tìm thấy thanh toán với ID đã cung cấp.");
    }

    return payment;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật trạng thái thanh toán: ${error.message}`);
  }
};

module.exports = { generatePaymentQR, updatePaymentStatus };
