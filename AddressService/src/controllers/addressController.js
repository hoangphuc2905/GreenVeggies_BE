const addressService = require("../services/addressService");

const addressController = {
  createAddress: async (req, res) => {
    try {
      const { userID, city, district, ward, street, isDefault } = req.body;

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
      return res.status(500).json({ message: error.message });
    }
  },
  // Lấy danh sách địa chỉ của user
  getAddresses: async (req, res) => {
    try {
      const { userID } = req.query;
      const addresses = await addressService.getAddresses(userID);
      return res.status(200).json(addresses);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = addressController;
