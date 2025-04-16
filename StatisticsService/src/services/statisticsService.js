const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetails");
const Product = require("../models/Product");
const User = require("../models/User");
const StockEntry = require("../models/StockEntry");
const mongoose = require("mongoose");

const statisticsService = {
  getDailyStatistics: async (date) => {
    try {
      const [day, month, year] = date.split("-");
      const formattedDate = `${year}-${month}-${day}`;

      const startOfDay = new Date(formattedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(formattedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const previousDay = new Date(startOfDay);
      previousDay.setDate(previousDay.getDate() - 1);

      const startOfPreviousDay = new Date(previousDay);
      startOfPreviousDay.setHours(0, 0, 0, 0);

      const endOfPreviousDay = new Date(previousDay);
      endOfPreviousDay.setHours(23, 59, 59, 999);

      const currentDayOrderDetails = await OrderDetail.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      const previousDayOrderDetails = await OrderDetail.find({
        createdAt: { $gte: startOfPreviousDay, $lte: endOfPreviousDay },
      });

      const currentDayProducts = await Product.find({
        productID: {
          $in: currentDayOrderDetails.map((detail) => detail.productID),
        },
      });

      const previousDayProducts = await Product.find({
        productID: {
          $in: previousDayOrderDetails.map((detail) => detail.productID),
        },
      });

      const currentDayStockEntries = await StockEntry.find({
        entryDate: { $gte: startOfDay, $lte: endOfDay },
      });
      const currentTotalCost = currentDayStockEntries.reduce((acc, entry) => {
        return acc + entry.entryPrice * entry.entryQuantity;
      }, 0);

      const previousDayStockEntries = await StockEntry.find({
        entryDate: { $gte: startOfPreviousDay, $lte: endOfPreviousDay },
      });
      const previousTotalCost = previousDayStockEntries.reduce((acc, entry) => {
        return acc + entry.entryPrice * entry.entryQuantity;
      }, 0);

      const currentStats = await calculateStats(
        currentDayOrderDetails,
        currentDayProducts
      );
      currentStats.totalCost = currentTotalCost;

      const previousStats = await calculateStats(
        previousDayOrderDetails,
        previousDayProducts
      );
      previousStats.totalCost = previousTotalCost;

      const percentageDifference = calculatePercentageDifference(
        currentStats,
        previousStats
      );

      return { currentStats, percentageDifference };
    } catch (error) {
      throw new Error("Lỗi khi lấy thống kê hàng ngày: " + error.message);
    }
  },

  getRevenueByPaymentMethod: async (date) => {
    try {
      const [day, month, year] = date.split("-");
      const formattedDate = `${year}-${month}-${day}`;

      const startOfDay = new Date(formattedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(formattedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const orders = await Order.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      const revenueByPaymentMethod = {};

      for (const order of orders) {
        const paymentMethod = order.paymentMethod || "Unknown";
        const revenue = order.totalAmount;

        if (!revenueByPaymentMethod[paymentMethod]) {
          revenueByPaymentMethod[paymentMethod] = 0;
        }

        revenueByPaymentMethod[paymentMethod] += revenue;
      }

      return revenueByPaymentMethod;
    } catch (error) {
      throw new Error(
        "Lỗi khi thống kê doanh thu theo phương thức thanh toán: " +
          error.message
      );
    }
  },

  getOrderStatisticsByStatus: async (date) => {
    try {
      const [day, month, year] = date.split("-");
      const formattedDate = `${year}-${month}-${day}`;

      const startOfDay = new Date(formattedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(formattedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const previousDay = new Date(startOfDay);
      previousDay.setDate(previousDay.getDate() - 1);

      const startOfPreviousDay = new Date(previousDay);
      startOfPreviousDay.setHours(0, 0, 0, 0);

      const endOfPreviousDay = new Date(previousDay);
      endOfPreviousDay.setHours(23, 59, 59, 999);

      const currentDayOrders = await Order.aggregate([
        { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const previousDayOrders = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfPreviousDay, $lte: endOfPreviousDay },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const currentStats = currentDayOrders.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const previousStats = previousDayOrders.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const percentageDifference = {};
      for (const status of ["Pending", "Shipped", "Delivered", "Cancelled"]) {
        const currentValue = currentStats[status] || 0;
        const previousValue = previousStats[status] || 0;
        percentageDifference[status] = calculateChange(
          currentValue,
          previousValue
        );
      }

      return { currentStats, percentageDifference };
    } catch (error) {
      throw new Error(
        "Lỗi khi thống kê đơn hàng theo trạng thái: " + error.message
      );
    }
  },
};

async function calculateStats(orderDetails) {
  let totalRevenue = 0;
  let totalProfit = 0;
  let totalOrders = orderDetails.length;

  for (const detail of orderDetails) {
    const revenue = detail.totalAmount || 0;
    totalRevenue += revenue;
  }

  const totalCost = totalRevenue / 1.5;
  totalProfit = totalRevenue - totalCost;

  return { totalRevenue, totalProfit, totalOrders };
}

function calculatePercentageDifference(current, previous) {
  return {
    revenueChangePercentage: calculateChange(
      current.totalRevenue,
      previous.totalRevenue
    ),
    profitChangePercentage: calculateChange(
      current.totalProfit,
      previous.totalProfit
    ),
    orderChangePercentage: calculateChange(
      current.totalOrders,
      previous.totalOrders
    ),
    costChangePercentage: calculateChange(
      current.totalCost,
      previous.totalCost
    ),
  };
}

function calculateChange(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  return (((currentValue - previousValue) / previousValue) * 100).toFixed(2);
}

module.exports = statisticsService;
