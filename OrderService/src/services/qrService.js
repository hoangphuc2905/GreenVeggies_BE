const generatePaymentQR = async (amount) => {
  // Giá trị mặc định
  const bankCode = "MB";
  const accountNumber = "868629052003";
  const accountName = "HUYNH HOANG PHUC";
  const description = "Thanh toan don hang";

  // Mã hóa các giá trị
  const encodedDescription = encodeURIComponent(description);
  const encodedName = encodeURIComponent(accountName);

  // Tạo URL mã QR
  const qrURL = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodedName}&acqId=970422`;

  return qrURL; // Trả về link ảnh QR thanh toán
};

module.exports = { generatePaymentQR };
