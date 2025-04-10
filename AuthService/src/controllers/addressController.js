const addressService = require("../services/addressService");

const addressController = {
  createAddress: async (req, res) => {
    try {
      const { userID, city, district, ward, street, isDefault } = req.body;

      const errors = {};

      // Kiểm tra userID
      if (!userID) {
        errors.userID = "Vui lòng cung cấp mã người dùng";
      } else {
        try {
          const user = await addressService.getUserByID(userID);
        } catch (error) {
          errors.userID = error.message; 
          return res.status(404).json({ errors });
        }
      }

      // Kiểm tra các trường bắt buộc
      if (!city) errors.city = "Vui lòng cung cấp tên thành phố/tỉnh.";
      if (!district) errors.district = "Vui lòng cung cấp tên quận/huyện.";
      if (!ward) errors.ward = "Vui lòng cung cấp tên phường/xã.";
      if (!street) errors.street = "Vui lòng cung cấp tên đường.";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

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

      // Kiểm tra thiếu tham số
      if (!userID) {
        return res
          .status(400)
          .json({ errors: { userID: "Vui lòng cung cấp mã người dùng" } });
      }

      const addresses = await addressService.getAddresses(userID);

      return res.status(200).json(addresses);
    } catch (error) {
      console.error("Lỗi trong getAddresses:", error);
      return res
        .status(500)
        .json({ errors: { server: "Đã xảy ra lỗi máy chủ." } });
    }
  },
};

module.exports = addressController;
