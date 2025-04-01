const StockEntry = require("../models/StockEntry");
const Product = require("../models/Product");

const stockEntryController = {
  createStockEntry: async (req, res) => {
    try {
      const { productID, entryPrice, entryQuantity } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!productID) {
        return res
          .status(400)
          .json({ error: "Vui lòng cung cấp mã sản phẩm (productID)." });
      }
      if (!entryPrice) {
        return res
          .status(400)
          .json({ error: "Vui lòng cung cấp giá nhập (entryPrice)." });
      }
      if (!entryQuantity) {
        return res
          .status(400)
          .json({ error: "Vui lòng cung cấp số lượng nhập (entryQuantity)." });
      }

      // Tìm sản phẩm theo productID
      const product = await Product.findOne({ productID });
      if (!product) {
        return res
          .status(404)
          .json({
            error: "Không tìm thấy sản phẩm với mã sản phẩm đã cung cấp.",
          });
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
      product.import += entryQuantity;
      await product.save();

      res.status(201).json(stockEntry);
    } catch (error) {
      res.status(400).json({ error: `Đã xảy ra lỗi: ${error.message}` });
    }
  },

  getAllStockEntries: async (req, res) => {
    try {
      const stockEntries = await StockEntry.find().populate("product");
      res.status(200).json(stockEntries);
    } catch (error) {
      res.status(400).json({ error: `Đã xảy ra lỗi: ${error.message}` });
    }
  },

  getStockEntryById: async (req, res) => {
    try {
      const stockEntry = await StockEntry.findById(req.params.id).populate(
        "product"
      );
      if (!stockEntry) {
        return res
          .status(404)
          .json({
            error: "Không tìm thấy bản ghi nhập hàng với ID đã cung cấp.",
          });
      }
      res.status(200).json(stockEntry);
    } catch (error) {
      res.status(400).json({ error: `Đã xảy ra lỗi: ${error.message}` });
    }
  },
};

module.exports = stockEntryController;
