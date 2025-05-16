const ShoppingCart = require("../models/ShoppingCart");
const ShoppingCartDetail = require("../models/ShoppingCartDetail");

exports.createShoppingCart = async (shoppingCartData) => {
  const shoppingCart = new ShoppingCart(shoppingCartData);
  return await shoppingCart.save();
};

exports.getAllShoppingCarts = async () => {
  try {
    const shoppingCarts = await ShoppingCart.find();

    const detailedShoppingCarts = await Promise.all(
      shoppingCarts.map(async (cart) => {
        const details = await ShoppingCartDetail.find({
          shoppingCartID: cart.shoppingCartID,
        });

        return {
          ...cart.toObject(),
          shoppingCartDetails: details,
        };
      })
    );

    return detailedShoppingCarts;
  } catch (error) {
    console.error("Lỗi khi truy vấn tất cả giỏ hàng:", error);
    return [];
  }
};

exports.getShoppingCartByID = async (shoppingCartID) => {
  try {
    const shoppingCart = await ShoppingCart.findOne({ shoppingCartID });

    if (!shoppingCart) return null;

    // Truy vấn ShoppingCartDetail thủ công
    const shoppingCartDetails = await ShoppingCartDetail.find({
      shoppingCartID: shoppingCart.shoppingCartID,
    });

    return {
      ...shoppingCart.toObject(),
      shoppingCartDetails,
    };
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng theo ID:", error);
    return null;
  }
};

exports.getShoppingCartByUserID = async (userID) => {
  try {
    const shoppingCart = await ShoppingCart.findOne({ userID });

    if (!shoppingCart) return null;

    // Truy vấn ShoppingCartDetail thủ công
    const shoppingCartDetails = await ShoppingCartDetail.find({
      shoppingCartID: shoppingCart.shoppingCartID,
    });

    return {
      ...shoppingCart.toObject(),
      shoppingCartDetails,
    };
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng theo User ID:", error);
    return null;
  }
};

exports.deleteShoppingCart = async (shoppingCartID) => {
  try {
    // Xóa tất cả chi tiết giỏ hàng trước
    await ShoppingCartDetail.deleteMany({ shoppingCartID });

    // Xóa giỏ hàng chính
    const deletedCart = await ShoppingCart.findOneAndDelete({ shoppingCartID });

    if (!deletedCart) {
      console.log("Không tìm thấy giỏ hàng để xóa.");
      return null;
    }

    return deletedCart;
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    return null;
  }
};

// Xóa một chi tiết giỏ hàng
exports.deleteShoppingCartDetail = async (shoppingCartDetailID) => {
  try {
    // Tìm và xóa chi tiết giỏ hàng
    const deletedCartDetail = await ShoppingCartDetail.findOneAndDelete({
      shoppingCartDetailID,
    });

    if (!deletedCartDetail) {
      console.log("Không tìm thấy chi tiết giỏ hàng để xóa.");
      return null;
    }

    // Xóa ID chi tiết khỏi mảng shoppingCartDetailID trong ShoppingCart
    await ShoppingCart.updateOne(
      { shoppingCartID: deletedCartDetail.shoppingCartID },
      { $pull: { shoppingCartDetailID: shoppingCartDetailID } }
    );

    return deletedCartDetail;
  } catch (error) {
    console.error("Lỗi khi xóa chi tiết giỏ hàng:", error);
    return null;
  }
};
