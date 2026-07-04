const Habit = require('../models/Habit');
const { NotFoundError } = require('../utils/apiError');

class HabitService {
  /**
   * Create a new habit.
   */
  async create(userId, data) {
    const habit = await Habit.create({ ...data, userId });
    return habit;
  }

  /**
   * Update a habit.
   */
  async update(userId, habitId, data) {
    const habit = await Habit.findOneAndUpdate(
      { _id: habitId, userId },
      data,
      { new: true, runValidators: true }
    );
    if (!habit) {
      throw new NotFoundError('Habit');
    }
    return habit;
  }

  /**
   * Delete a habit.
   */
  async delete(userId, habitId) {
    const habit = await Habit.findOneAndDelete({ _id: habitId, userId });
    if (!habit) {
      throw new NotFoundError('Habit');
    }
    return habit;
  }

  /**
   * Mark a habit as completed for today.
   * Updates streak calculation.
   */
  async markComplete(userId, habitId) {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      throw new NotFoundError('Habit');
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Check if already completed today
    const alreadyCompleted = habit.completedDates.some(
      (date) => new Date(date).toISOString().split('T')[0] === today.toISOString().split('T')[0]
    );

    if (alreadyCompleted) {
      return { habit, message: 'Already completed today' };
    }

    // Add today to completed dates
    habit.completedDates.push(today);

    // Calculate streak
    habit.streak = this._calculateStreak(habit.completedDates, habit.frequency);

    // Update best streak
    if (habit.streak > habit.bestStreak) {
      habit.bestStreak = habit.streak;
    }

    await habit.save();

    return { habit, message: 'Habit marked as complete!' };
  }

  /**
   * Get all habits for a user.
   */
  async getAll(userId, { activeOnly = false } = {}) {
    const query = { userId };
    if (activeOnly) query.isActive = true;

    const habits = await Habit.find(query).sort({ createdAt: -1 });
    return habits;
  }

  /**
   * Get a single habit with analytics.
   */
  async getById(userId, habitId) {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      throw new NotFoundError('Habit');
    }
    return habit;
  }

  /**
   * Get habit analytics: completion rate, streaks, weekly/monthly stats.
   */
  async getAnalytics(userId, habitId) {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      throw new NotFoundError('Habit');
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completionsLast30 = habit.completedDates.filter(
      (d) => new Date(d) >= thirtyDaysAgo
    ).length;

    const completionsLast7 = habit.completedDates.filter(
      (d) => new Date(d) >= sevenDaysAgo
    ).length;

    const daysSinceCreation = Math.max(
      1,
      Math.ceil((now - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24))
    );

    return {
      habit,
      analytics: {
        totalCompletions: habit.completedDates.length,
        currentStreak: habit.streak,
        bestStreak: habit.bestStreak,
        completionsLast7Days: completionsLast7,
        completionsLast30Days: completionsLast30,
        overallCompletionRate: Math.round(
          (habit.completedDates.length / daysSinceCreation) * 100
        ),
        weeklyCompletionRate: Math.round((completionsLast7 / 7) * 100),
        monthlyCompletionRate: Math.round((completionsLast30 / 30) * 100),
      },
    };
  }

  /**
   * Calculate current streak from completed dates.
   */
  _calculateStreak(completedDates, frequency) {
    if (completedDates.length === 0) return 0;

    // Sort dates descending
    const sorted = completedDates
      .map((d) => new Date(d))
      .sort((a, b) => b - a);

    let streak = 1;
    const intervalMs = frequency === 'weekly'
      ? 7 * 24 * 60 * 60 * 1000
      : frequency === 'monthly'
        ? 30 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000; // daily

    // Check if the most recent completion is today or yesterday
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const mostRecent = new Date(sorted[0]);
    mostRecent.setUTCHours(0, 0, 0, 0);

    const daysDiff = (today - mostRecent) / (24 * 60 * 60 * 1000);
    if (daysDiff > 1 && frequency === 'daily') return 0;
    if (daysDiff > 7 && frequency === 'weekly') return 0;
    if (daysDiff > 30 && frequency === 'monthly') return 0;

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = new Date(sorted[i]);
      const next = new Date(sorted[i + 1]);
      current.setUTCHours(0, 0, 0, 0);
      next.setUTCHours(0, 0, 0, 0);

      const diff = current - next;

      if (diff <= intervalMs * 1.5) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}

module.exports = new HabitService();
