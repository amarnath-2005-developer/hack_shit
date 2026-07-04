const BadHabit = require('../models/BadHabit');
const ApiResponse = require('../utils/apiResponse');
const { NotFoundError } = require('../utils/apiError');
const analyticsService = require('../services/analytics.service');

class BadHabitController {
  /**
   * POST /api/bad-habits
   */
  async create(req, res, next) {
    try {
      const badHabit = await BadHabit.create({
        ...req.body,
        userId: req.user._id,
      });
      ApiResponse.created(res, badHabit, 'Bad habit entry logged.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bad-habits
   */
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 30, type, startDate, endDate } = req.query;
      const query = { userId: req.user._id };

      if (type) query.type = type;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [entries, total] = await Promise.all([
        BadHabit.find(query).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
        BadHabit.countDocuments(query),
      ]);

      ApiResponse.paginated(res, entries, {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/bad-habits/:id
   */
  async update(req, res, next) {
    try {
      const entry = await BadHabit.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!entry) throw new NotFoundError('Bad habit entry');
      ApiResponse.success(res, entry, 'Bad habit entry updated.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/bad-habits/:id
   */
  async delete(req, res, next) {
    try {
      const entry = await BadHabit.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });
      if (!entry) throw new NotFoundError('Bad habit entry');
      ApiResponse.success(res, null, 'Bad habit entry deleted.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bad-habits/trends
   */
  async getTrends(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const trends = await analyticsService.getBadHabitTrends(
        req.user._id,
        parseInt(days)
      );
      ApiResponse.success(res, trends);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BadHabitController();
