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
  const user = await User.findOne({ userID });
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

const updateAddress = async (addressID, userID, updateData) => {
  const address = await Address.findOne({ _id: addressID, userID });
  if (!address) {
    throw new Error("Địa chỉ không tồn tại hoặc không thuộc về người dùng!");
  }

  if (updateData.default === true) {
    await Address.updateMany({ userID }, { default: false });
  }

  Object.assign(address, updateData);
  await address.save();
  return address;
};

// ...existing code...
const getAddresses = async (userID) => {
  const address = await Address.find({ userID });

  if (!address.length) {
    throw new Error("User chưa có địa chỉ nào!");
  }
  return address;
};

const getUserByID = async (userID) => {
  const user = await User.findOne({ userID });
  if (!user) {
    throw new Error("Người dùng không tồn tại!");
  }
  return user;
};

const deleteAddress = async (addressID, userID) => {
  const address = await Address.findOne({ _id: addressID, userID });
  if (!address) {
    throw new Error("Địa chỉ không tồn tại hoặc không thuộc về người dùng!");
  }

  await Address.deleteOne({ _id: addressID });
  await User.updateOne({ userID }, { $pull: { address: addressID } });

  return { message: "Xóa địa chỉ thành công!" };
};

module.exports = {
  createAddress,
  getAddresses,
  getUserByID,
  updateAddress,
  deleteAddress,
};
