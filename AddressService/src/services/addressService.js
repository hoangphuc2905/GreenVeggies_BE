const Address = require("../models/Address");
const User = require("../models/User");

const createAddress = async (
  userID,
  city,
  district,
  ward,
  street,
  isDefault
) => {
  // Kiểm tra user có tồn tại không
  const user = await User.findById(userID);
  if (!user) {
    throw new Error("User không tồn tại!");
  }

  // Nếu địa chỉ mới là mặc định, bỏ `default: true` ở các địa chỉ cũ
  if (isDefault) {
    await Address.updateMany({ userID }, { default: false });
  }

  // Tạo địa chỉ mới
  const newAddress = new Address({
    userID,
    city,
    district,
    ward,
    street,
    default: isDefault || false,
  });

  await newAddress.save();

  // Thêm địa chỉ vào user
  user.address.push(newAddress._id);
  await user.save();

  return newAddress;
};

const getAddresses = async (userID) => {
  const address = await Address.find({ userID });

  if (!address.length) {
    throw new Error("User chưa có địa chỉ nào!");
  }

  return address;
};

module.exports = { createAddress, getAddresses };
