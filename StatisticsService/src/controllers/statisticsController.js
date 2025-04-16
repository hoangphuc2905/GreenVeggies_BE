const statisticsService = require("../services/statisticsService");

const statisticsController = {
  getDailyStatistics: async (req, res) => {
    try {
      const { date } = req.query; // Ngày được truyền qua query param
      if (!date) {
        return res.status(400).json({
          errors: { date: "Vui lòng cung cấp ngày để thống kê." },
        });
      }

      const stats = await statisticsService.getDailyStatistics(date);
      res.status(200).json({
        message: "Thống kê hàng ngày thành công.",
        stats,
      });
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
    }
  },

  getRevenueByPaymentMethod: async (req, res) => {
    try {
      const { date } = req.query; // Ngày được truyền qua query param
      if (!date) {
        return res.status(400).json({
          errors: { date: "Vui lòng cung cấp ngày để thống kê." },
        });
      }

      const stats = await statisticsService.getRevenueByPaymentMethod(date);
      res.status(200).json({
        message: "Thống kê doanh thu theo phương thức thanh toán thành công.",
        stats,
      });
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
    }
  },
  getOrderStatisticsByStatus: async (req, res) => {
    try {
      const { date } = req.query; // Ngày được truyền qua query param
      if (!date) {
        return res.status(400).json({
          errors: { date: "Vui lòng cung cấp ngày để thống kê." },
        });
      }

      const stats = await statisticsService.getOrderStatisticsByStatus(date);
      res.status(200).json({
        message: "Thống kê đơn hàng theo trạng thái thành công.",
        stats,
      });
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
    }
  },
};

module.exports = statisticsController;
