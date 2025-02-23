const StockEntry = require("../models/StockEntry");
const Product = require("../models/Product");

const stockEntryService = {
  createStockEntry: async (stockEntryData) => {
    const { productID, entryPrice, entryQuantity } = stockEntryData;

    // Tìm sản phẩm theo productID
    const product = await Product.findOne({ productID });
    if (!product) {
      throw new Error("Product not found");
    }

    // Tạo bản ghi nhập hàng mới
    const stockEntry = new StockEntry({
      product: product._id,
      entryPrice,
      entryQuantity,
    });
    await stockEntry.save();

    // Cập nhật sản phẩm với bản ghi nhập hàng mới
    product.stockEntries.push(stockEntry._id);
    product.quantity += entryQuantity;
    await product.save();

    return stockEntry;
  },

  getAllStockEntries: async () => {
    return await StockEntry.find().populate("product");
  },

  getStockEntryById: async (id) => {
    return await StockEntry.findById(id).populate("product");
  },
};

module.exports = stockEntryService;