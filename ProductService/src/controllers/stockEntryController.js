const StockEntry = require("../models/StockEntry");
const Product = require("../models/Product");

const stockEntryController = {
  createStockEntry: async (req, res) => {
    try {
      const errors = {};
      const { productID, entryPrice, entryQuantity } = req.body;

      if (!productID) {
        errors.productID = "Vui lòng cung cấp mã sản phẩm (productID).";
      }
      if (!entryPrice) {
        errors.entryPrice = "Vui lòng cung cấp giá nhập (entryPrice).";
      }
      if (!entryQuantity) {
        errors.entryQuantity =
          "Vui lòng cung cấp số lượng nhập (entryQuantity).";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const product = await Product.findOne({ productID });
      if (!product) {
        return res.status(404).json({
          errors: {
            productID: "Không tìm thấy sản phẩm với mã sản phẩm đã cung cấp.",
          },
        });
      }

      const stockEntry = new StockEntry({
        product: product._id,
        entryPrice,
        entryQuantity,
      });
      await stockEntry.save();

      product.stockEntries.push(stockEntry._id);
      product.quantity += entryQuantity;
      product.import += entryQuantity;
      await product.save();

      res.status(201).json(stockEntry);
    } catch (error) {
      res
        .status(400)
        .json({ errors: { server: `Đã xảy ra lỗi: ${error.message}` } });
    }
  },

  getAllStockEntries: async (req, res) => {
    try {
      const stockEntries = await StockEntry.find().populate("product");
      res.status(200).json(stockEntries);
    } catch (error) {
      res
        .status(400)
        .json({ errors: { server: `Đã xảy ra lỗi: ${error.message}` } });
    }
  },

  getStockEntryById: async (req, res) => {
    try {
      const stockEntry = await StockEntry.findById(req.params.id).populate(
        "product"
      );
      if (!stockEntry) {
        return res.status(404).json({
          errors: {
            stockEntryID:
              "Không tìm thấy bản ghi nhập hàng với ID đã cung cấp.",
          },
        });
      }
      res.status(200).json(stockEntry);
    } catch (error) {
      res
        .status(400)
        .json({ errors: { server: `Đã xảy ra lỗi: ${error.message}` } });
    }
  },
};

module.exports = stockEntryController;
