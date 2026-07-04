const DailyLog = require('../models/DailyLog');
const { NotFoundError, ConflictError } = require('../utils/apiError');
const disciplineScoreService = require('./disciplineScore.service');

class DailyLogService {
  /**
   * Create a new daily log. Auto-calculates discipline score.
   */
  async create(userId, data) {
    // Normalize date to start of day (UTC)
    const logDate = new Date(data.date || Date.now());
    logDate.setUTCHours(0, 0, 0, 0);

    // Check if log already exists for this date
    const existing = await DailyLog.findOne({ userId, date: logDate });
    if (existing) {
      throw new ConflictError('A daily log already exists for this date. Use update instead.');
    }

    // Calculate discipline score
    const score = await disciplineScoreService.calculate(userId, data);

    const log = await DailyLog.create({
      ...data,
      userId,
      date: logDate,
      disciplineScore: score,
    });

    // Update user stats (XP, streak, badges)
    await disciplineScoreService.updateUserStats(userId, score);

    return log;
  }

  /**
   * Update an existing daily log. Recalculates score.
   */
  async update(userId, logId, data) {
    const log = await DailyLog.findOne({ _id: logId, userId });
    if (!log) {
      throw new NotFoundError('Daily log');
    }

    // Recalculate score with updated data
    const mergedData = {
      sleepHours: data.sleepHours ?? log.sleepHours,
      studyHours: data.studyHours ?? log.studyHours,
      workoutMinutes: data.workoutMinutes ?? log.workoutMinutes,
      waterIntake: data.waterIntake ?? log.waterIntake,
      tasksCompleted: data.tasksCompleted ?? log.tasksCompleted,
      screenTime: data.screenTime ?? log.screenTime,
    };

    const score = await disciplineScoreService.calculate(userId, mergedData);

    Object.assign(log, data, { disciplineScore: score });
    await log.save();

    return log;
  }

  /**
   * Delete a daily log.
   */
  async delete(userId, logId) {
    const log = await DailyLog.findOneAndDelete({ _id: logId, userId });
    if (!log) {
      throw new NotFoundError('Daily log');
    }
    return log;
  }

  /**
   * Get today's log.
   */
  async getToday(userId) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const log = await DailyLog.findOne({ userId, date: today });
    return log;
  }

  /**
   * Get all logs for a user with optional date range filtering.
   */
  async getAll(userId, { page = 1, limit = 30, startDate, endDate } = {}) {
    const query = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      DailyLog.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      DailyLog.countDocuments(query),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single log by ID.
   */
  async getById(userId, logId) {
    const log = await DailyLog.findOne({ _id: logId, userId });
    if (!log) {
      throw new NotFoundError('Daily log');
    }
    return log;
  }
}

module.exports = new DailyLogService();
