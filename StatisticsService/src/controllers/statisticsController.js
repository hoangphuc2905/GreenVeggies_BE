const statisticsService = require("../services/statisticsService");

const statisticsController = {
  getDailyStatistics: async (req, res) => {
    try {
      const { date } = req.query;
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
      const { date } = req.query;
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
      const { day, month, year } = req.query;

      if (!year) {
        return res.status(400).json({
          errors: { year: "Vui lòng cung cấp năm để thống kê." },
        });
      }
      if (day && (!month || !year)) {
        return res.status(400).json({
          errors: { message: "Nếu nhập ngày, phải nhập đủ tháng và năm." },
        });
      }
      if (month && !year) {
        return res.status(400).json({
          errors: { message: "Nếu nhập tháng, phải nhập năm." },
        });
      }

      const stats = await statisticsService.getOrderStatisticsByStatus({
        day: day ? parseInt(day) : undefined,
        month: month ? parseInt(month) : undefined,
        year: year ? parseInt(year) : undefined,
      });

      res.status(200).json({
        message: "Thống kê đơn hàng theo trạng thái thành công.",
        stats,
      });
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
    }
  },

  getYearlyRevenueStatistics: async (req, res) => {
    try {
      const { year } = req.query;
      if (!year) {
        return res.status(400).json({
          errors: { year: "Vui lòng cung cấp năm để thống kê." },
        });
      }

      const stats = await statisticsService.getYearlyRevenueStatistics(year);
      const totalRevenue = stats.reduce(
        (total, month) => total + month.revenue,
        0
      );

      res.status(200).json({
        message: "Thống kê doanh thu theo năm thành công.",
        stats,
        totalRevenue,
      });
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
    }
  },

  getDailyOrderStatisticsByMonth: async (req, res) => {
    try {
      const month = parseInt(req.query.month, 10);
      const year = parseInt(req.query.year, 10);

      if (!month || !year || month < 1 || month > 12 || year < 1900) {
        return res.status(400).json({
          errors: {
            message: "Vui lòng cung cấp tháng và năm hợp lệ để thống kê.",
          },
        });
      }

      const stats = await statisticsService.getDailyOrderStatisticsByMonth(
        month,
        year
      );

      res.status(200).json({
        message: "Thống kê số lượng đơn hàng theo ngày trong tháng thành công.",
        stats,
      });
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
    }
  },

  getOrderStatisticsByDateAndStatus: async (req, res) => {
    try {
      const { day, month, year, status } = req.query;

      const orders = await statisticsService.getOrderStatisticsByDateAndStatus({
        day: day ? parseInt(day) : undefined,
        month: month ? parseInt(month) : undefined,
        year: year ? parseInt(year) : undefined,
        status,
      });

      res.status(200).json({
        message: "Thống kê danh sách đơn hàng thành công.",
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi thống kê danh sách đơn hàng.",
        error: error.message,
      });
    }
  },
};

module.exports = statisticsController;
