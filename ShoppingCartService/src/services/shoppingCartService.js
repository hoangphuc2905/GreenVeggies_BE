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
    const deletedCart = await ShoppingCart.findOneAndDelete({ shoppingCartID });

    if (!deletedCart) {
      return null;
    }

    // Xóa luôn chi tiết giỏ hàng liên quan
    await ShoppingCartDetail.deleteMany({ shoppingCartID });

    return deletedCart;
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    return null;
  }
};

// hàm xóa chi tiết giỏ hàng
exports.deleteShoppingCartDetail = async (shoppingCartDetailID) => {
  try {
    const deletedCartDetail = await ShoppingCartDetail.findOneAndDelete({
      shoppingCartDetailID,
    });

    if (!deletedCartDetail) {
      console.log("Không tìm thấy chi tiết giỏ hàng để xóa.");
      return null;
    }

    // Cập nhật giỏ hàng chính để loại bỏ shoppingCartDetailID tương ứng
    await ShoppingCart.updateOne(
      { shoppingCartID: deletedCartDetail.shoppingCartID },
      { $pull: { shoppingCartDetailID: shoppingCartDetailID } }
    );

    console.log("Đã xóa chi tiết giỏ hàng:", deletedCartDetail);
    return deletedCartDetail;
  } catch (error) {
    console.error("Lỗi khi xóa chi tiết giỏ hàng:", error);
    throw error; // Ném lỗi để controller bắt và xử lý
  }
};
