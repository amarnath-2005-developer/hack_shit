const dailyLogService = require('../services/dailyLog.service');
const ApiResponse = require('../utils/apiResponse');

class DailyLogController {
  /**
   * POST /api/daily-logs
   */
  async create(req, res, next) {
    try {
      const data = { ...req.body };
      if (data.focusMinutes !== undefined) {
        data.studyHours = data.focusMinutes / 60;
      }
      const log = await dailyLogService.create(req.user._id, data);
      ApiResponse.created(res, log, 'Daily log created successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/daily-logs/:id
   */
  async update(req, res, next) {
    try {
      const data = { ...req.body };
      if (data.focusMinutes !== undefined) {
        data.studyHours = data.focusMinutes / 60;
      }
      const log = await dailyLogService.update(req.user._id, req.params.id, data);
      ApiResponse.success(res, log, 'Daily log updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/daily-logs/:id
   */
  async delete(req, res, next) {
    try {
      await dailyLogService.delete(req.user._id, req.params.id);
      ApiResponse.success(res, null, 'Daily log deleted successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/daily-logs/today
   */
  async getToday(req, res, next) {
    try {
      const log = await dailyLogService.getToday(req.user._id);
      ApiResponse.success(res, log);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/daily-logs
   */
  async getAll(req, res, next) {
    try {
      const { page, limit, startDate, endDate } = req.query;
      const result = await dailyLogService.getAll(req.user._id, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 30,
        startDate,
        endDate,
      });
      ApiResponse.paginated(res, result.logs, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/daily-logs/:id
   */
  async getById(req, res, next) {
    try {
      const log = await dailyLogService.getById(req.user._id, req.params.id);
      ApiResponse.success(res, log);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DailyLogController();
