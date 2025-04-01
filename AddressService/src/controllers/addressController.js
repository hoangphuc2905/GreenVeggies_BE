const addressService = require("../services/addressService");

const addressController = {
  createAddress: async (req, res) => {
    try {
      const { userID, city, district, ward, street, isDefault } = req.body;

      if (!userID) {
        return res.status(400).json({ message: "Thiếu userID." });
      }
      if (!city) {
        return res.status(400).json({ message: "Thiếu tên thành phố." });
      }
      if (!district) {
        return res.status(400).json({ message: "Thiếu tên quận/huyện." });
      }
      if (!ward) {
        return res.status(400).json({ message: "Thiếu tên phường/xã." });
      }
      if (!street) {
        return res.status(400).json({ message: "Thiếu tên đường." });
      }

      console.log("Received userID:", userID);

      const defaultFlag = isDefault === "true" || isDefault === true;

      const newAddress = await addressService.createAddress(
        userID,
        city,
        district,
        ward,
        street,
        defaultFlag
      );
      return res
        .status(201)
        .json({ message: "Địa chỉ đã được thêm!", newAddress });
    } catch (error) {
      console.error("Lỗi trong createAddress:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ." });
    }
  },
  // Lấy danh sách địa chỉ của user
  getAddresses: async (req, res) => {
    try {
      const { userID } = req.query;

      if (!userID) {
        return res.status(400).json({ message: "Thiếu tham số userID." });
      }

      const addresses = await addressService.getAddresses(userID);
      return res.status(200).json(addresses);
    } catch (error) {
      console.error("Lỗi trong getAddresses:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi máy chủ." });
    }
  },
};

module.exports = addressController;
