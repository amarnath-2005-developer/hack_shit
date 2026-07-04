const dashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/apiResponse');

class DashboardController {
  /**
   * GET /api/dashboard
   */
  async getDashboard(req, res, next) {
    try {
      const data = await dashboardService.getDashboard(req.user._id);
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
