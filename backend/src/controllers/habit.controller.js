const habitService = require('../services/habit.service');
const ApiResponse = require('../utils/apiResponse');

class HabitController {
  /**
   * POST /api/habits
   */
  async create(req, res, next) {
    try {
      const habit = await habitService.create(req.user._id, req.body);
      ApiResponse.created(res, habit, 'Habit created successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/habits/:id
   */
  async update(req, res, next) {
    try {
      const habit = await habitService.update(req.user._id, req.params.id, req.body);
      ApiResponse.success(res, habit, 'Habit updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/habits/:id
   */
  async delete(req, res, next) {
    try {
      await habitService.delete(req.user._id, req.params.id);
      ApiResponse.success(res, null, 'Habit deleted successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/habits/:id/complete
   */
  async markComplete(req, res, next) {
    try {
      const result = await habitService.markComplete(req.user._id, req.params.id);
      ApiResponse.success(res, result.habit, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/habits
   */
  async getAll(req, res, next) {
    try {
      const { activeOnly } = req.query;
      const habits = await habitService.getAll(req.user._id, {
        activeOnly: activeOnly === 'true',
      });
      ApiResponse.success(res, habits);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/habits/:id
   */
  async getById(req, res, next) {
    try {
      const habit = await habitService.getById(req.user._id, req.params.id);
      ApiResponse.success(res, habit);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/habits/:id/analytics
   */
  async getAnalytics(req, res, next) {
    try {
      const data = await habitService.getAnalytics(req.user._id, req.params.id);
      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HabitController();
