const StockEntry = require("../models/StockEntry");
const Product = require("../models/Product");

const stockEntryController = {
  createStockEntry: async (req, res) => {
    try {
      const { productID, entryPrice, entryQuantity } = req.body;

      // Tìm sản phẩm theo productID
      const product = await Product.findOne({ productID });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
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

      res.status(201).json(stockEntry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllStockEntries: async (req, res) => {
    try {
      const stockEntries = await StockEntry.find().populate("product");
      res.status(200).json(stockEntries);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getStockEntryById: async (req, res) => {
    try {
      const stockEntry = await StockEntry.findById(req.params.id).populate(
        "product"
      );
      res.status(200).json(stockEntry);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = stockEntryController;
