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
  getYearlyRevenueStatistics: async (year) => {
    try {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

      // Lấy doanh thu theo từng tháng trong năm
      const monthlyRevenue = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" }, // Nhóm theo tháng
            revenue: { $sum: "$totalAmount" }, // Tổng doanh thu
          },
        },
        {
          $sort: { _id: 1 }, // Sắp xếp theo tháng
        },
      ]);

      // Đảm bảo đủ 12 tháng, ngay cả khi không có doanh thu
      const stats = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        revenue: 0,
      }));

      monthlyRevenue.forEach((item) => {
        stats[item._id - 1].revenue = item.revenue;
      });

      return stats;
    } catch (error) {
      throw new Error("Lỗi khi thống kê doanh thu theo năm: " + error.message);
    }
  },

  getDailyOrderStatisticsByMonth: async (month, year) => {
    try {
      // Kiểm tra tháng và năm hợp lệ
      if (!month || !year || month < 1 || month > 12 || year < 1900) {
        throw new Error("Tháng hoặc năm không hợp lệ.");
      }

      // Tạo khoảng thời gian đầu tháng và cuối tháng
      const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
      const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      const dailyOrderStats = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
            status: "Delivered",
          },
        },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" }, 
            totalOrders: { $sum: 1 }, 
          },
        },
        {
          $sort: { _id: 1 }, 
        },
      ]);

      console.log("Daily Order Stats:", dailyOrderStats);

      const daysInMonth = new Date(year, month, 0).getDate();
      const stats = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        totalOrders: 0,
      }));

      // Gán số lượng đơn hàng vào mảng stats
      dailyOrderStats.forEach((item) => {
        stats[item._id - 1].totalOrders = item.totalOrders;
      });

      console.log("Final Stats:", stats);

      return stats;
    } catch (error) {
      throw new Error(
        "Lỗi khi thống kê số lượng đơn hàng theo ngày trong tháng: " +
          error.message
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
