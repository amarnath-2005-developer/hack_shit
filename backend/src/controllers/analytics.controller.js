const analyticsService = require('../services/analytics.service');
const disciplineScoreService = require('../services/disciplineScore.service');
const ApiResponse = require('../utils/apiResponse');

class AnalyticsController {
  /**
   * GET /api/analytics
   */
  async getSummary(req, res, next) {
    try {
      const range = req.query.range || '30d';
      const days = parseInt(range.replace('d', '')) || 30;
      const data = await analyticsService.getSummary(req.user._id, days);
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/weekly
   */
  async getWeekly(req, res, next) {
    try {
      const data = await analyticsService.getWeeklyScores(req.user._id);
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/monthly
   */
  async getMonthly(req, res, next) {
    try {
      const data = await analyticsService.getMonthlyReport(req.user._id);
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/trends
   */
  async getTrends(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const data = await analyticsService.getTrends(req.user._id, parseInt(days));
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/heatmap
   */
  async getHeatmap(req, res, next) {
    try {
      const { days = 90 } = req.query;
      const data = await analyticsService.getHeatmap(req.user._id, parseInt(days));
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/habits
   */
  async getHabitStats(req, res, next) {
    try {
      const data = await analyticsService.getHabitStats(req.user._id);
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/analytics/score-history
   */
  async getScoreHistory(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const data = await disciplineScoreService.getHistory(req.user._id, parseInt(days));
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
