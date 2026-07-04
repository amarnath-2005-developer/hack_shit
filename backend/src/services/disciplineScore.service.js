const User = require('../models/User');
const UserStats = require('../models/UserStats');
const DailyLog = require('../models/DailyLog');
const { SCORE_WEIGHTS, XP_REWARDS, LEVEL_THRESHOLDS, BADGE_TYPES } = require('../utils/constants');

class DisciplineScoreService {
  /**
   * Calculate discipline score (0-100) from daily log data.
   *
   * Weights:
   *   Sleep: 20% | Study: 20% | Workout: 15%
   *   Water: 15% | Tasks: 20% | ScreenTime: 10%
   */
  async calculate(userId, logData) {
    // Fetch user goals for personalized scoring
    const user = await User.findById(userId);
    const goals = {
      studyGoal: user?.studyGoal || 4,
      workoutGoal: user?.workoutGoal || 30,
      waterGoal: user?.waterGoal || 3,
    };

    const scores = {};

    // --- Sleep Score (optimal: 7-9 hours) ---
    const sleep = logData.sleepHours || 0;
    if (sleep >= 7 && sleep <= 9) {
      scores.sleep = 100;
    } else if (sleep >= 6 && sleep < 7) {
      scores.sleep = 70;
    } else if (sleep > 9 && sleep <= 10) {
      scores.sleep = 80;
    } else if (sleep >= 5 && sleep < 6) {
      scores.sleep = 50;
    } else if (sleep > 10) {
      scores.sleep = 40;
    } else {
      scores.sleep = Math.max(0, (sleep / 7) * 100);
    }

    // --- Study Score (based on user's study goal) ---
    const study = logData.studyHours || 0;
    scores.study = goals.studyGoal <= 0 ? 100 : Math.min(100, (study / goals.studyGoal) * 100);

    // --- Workout Score (based on user's workout goal) ---
    const workout = logData.workoutMinutes || 0;
    scores.workout = goals.workoutGoal <= 0 ? 100 : Math.min(100, (workout / goals.workoutGoal) * 100);

    // --- Water Intake Score (based on user's water goal) ---
    const water = logData.waterIntake || 0;
    scores.water = goals.waterGoal <= 0 ? 100 : Math.min(100, (water / goals.waterGoal) * 100);

    // --- Task Completion Score (dynamic: uses tasksPlanned from log, or defaults to 10) ---
    const tasks = logData.tasksCompleted || 0;
    const taskGoal = logData.tasksPlanned || 10; // Use planned tasks if provided, else sensible default
    scores.tasks = taskGoal <= 0 ? 100 : Math.min(100, (tasks / taskGoal) * 100);

    // --- Screen Time Score (inverse — less is better) ---
    const screen = logData.screenTime || 0;
    const maxScreen = 8; // 8 hours max
    if (screen <= 2) {
      scores.screenTime = 100;
    } else if (screen <= 4) {
      scores.screenTime = 80;
    } else if (screen <= 6) {
      scores.screenTime = 60;
    } else if (screen <= 8) {
      scores.screenTime = 40;
    } else {
      scores.screenTime = Math.max(0, 100 - ((screen - maxScreen) * 15));
    }

    // --- Weighted Total ---
    const totalScore = Math.round(
      scores.sleep * SCORE_WEIGHTS.sleep +
      scores.study * SCORE_WEIGHTS.study +
      scores.workout * SCORE_WEIGHTS.workout +
      scores.water * SCORE_WEIGHTS.water +
      scores.tasks * SCORE_WEIGHTS.tasks +
      scores.screenTime * SCORE_WEIGHTS.screenTime
    );

    return Math.min(100, Math.max(0, totalScore));
  }

  /**
   * Update user stats after logging: XP, streak, level, badges.
   */
  async updateUserStats(userId, score) {
    let stats = await UserStats.findOne({ userId });
    if (!stats) {
      stats = await UserStats.create({ userId });
    }

    // Award XP
    let xpEarned = XP_REWARDS.DAILY_LOG;
    if (score >= 80) xpEarned += XP_REWARDS.HIGH_SCORE;
    if (score === 100) xpEarned += XP_REWARDS.PERFECT_SCORE;

    stats.totalXP += xpEarned;

    // Calculate streak
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayLog = await DailyLog.findOne({
      userId,
      date: { $gte: yesterday, $lt: today },
    });

    if (yesterdayLog) {
      stats.currentStreak += 1;
    } else {
      // Check if this is the first log (streak = 1) or a break (reset)
      const anyPreviousLog = await DailyLog.findOne({
        userId,
        date: { $lt: today },
      });
      stats.currentStreak = anyPreviousLog ? 1 : 1;
    }

    // Update best streak
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }

    // Streak XP bonus
    stats.totalXP += stats.currentStreak * XP_REWARDS.STREAK_BONUS;

    // Calculate level
    stats.level = this._calculateLevel(stats.totalXP);

    // Check for badges
    stats.badges = this._checkBadges(stats, score);

    await stats.save();

    return { stats, xpEarned };
  }

  /**
   * Calculate level from total XP.
   */
  _calculateLevel(totalXP) {
    let level = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
        break;
      }
    }
    return level;
  }

  /**
   * Check and award badges based on stats.
   */
  _checkBadges(stats, latestScore) {
    const badges = new Set(stats.badges);

    if (stats.currentStreak >= 7) badges.add(BADGE_TYPES.STREAK_7);
    if (stats.currentStreak >= 30) badges.add(BADGE_TYPES.STREAK_30);
    if (stats.currentStreak >= 100) badges.add(BADGE_TYPES.STREAK_100);
    if (latestScore === 100) badges.add(BADGE_TYPES.CENTURION);

    return [...badges];
  }

  /**
   * Get score history for a user.
   */
  async getHistory(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);

    const logs = await DailyLog.find({
      userId,
      date: { $gte: startDate },
    })
      .select('date disciplineScore')
      .sort({ date: 1 });

    return logs;
  }
}

module.exports = new DisciplineScoreService();
