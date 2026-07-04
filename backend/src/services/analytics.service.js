const DailyLog = require('../models/DailyLog');
const Habit = require('../models/Habit');
const BadHabit = require('../models/BadHabit');

class AnalyticsService {
  /**
   * Get comprehensive analytics summary
   */
  async getSummary(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);

    const logs = await DailyLog.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const avgDiscipline = logs.length > 0 
      ? Math.round(logs.reduce((sum, l) => sum + l.disciplineScore, 0) / logs.length)
      : 0;
      
    const avgSleep = logs.length > 0
      ? +(logs.reduce((sum, l) => sum + l.sleepHours, 0) / logs.length).toFixed(1)
      : 0;

    const focusMinutesTotal = logs.reduce((sum, l) => sum + (l.studyHours || 0) * 60, 0);
    
    const disciplineScoreService = require('./disciplineScore.service');
    const userStats = await require('../models/UserStats').findOne({ userId });
    const streakDays = userStats ? userStats.currentStreak : 0;

    const weekly = logs.map(l => ({
      date: l.date.toISOString().split('T')[0],
      disciplineScore: l.disciplineScore,
      sleepHours: l.sleepHours,
      focusMinutes: (l.studyHours || 0) * 60,
    }));

    return {
      weekly,
      averageDiscipline: avgDiscipline,
      averageSleep: avgSleep,
      focusMinutesTotal,
      streakDays
    };
  }

  /**
   * Get weekly discipline scores (last 7 days).
   */
  async getWeeklyScores(userId) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setUTCHours(0, 0, 0, 0);

    const logs = await DailyLog.find({
      userId,
      date: { $gte: startDate },
    })
      .select('date disciplineScore mood')
      .sort({ date: 1 });

    const avgScore = logs.length > 0
      ? Math.round(logs.reduce((sum, l) => sum + l.disciplineScore, 0) / logs.length)
      : 0;

    return {
      scores: logs.map((l) => ({
        date: l.date,
        score: l.disciplineScore,
        mood: l.mood,
      })),
      average: avgScore,
      totalDaysLogged: logs.length,
    };
  }

  /**
   * Get monthly report (last 30 days).
   */
  async getMonthlyReport(userId) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate.setUTCHours(0, 0, 0, 0);

    const logs = await DailyLog.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    if (logs.length === 0) {
      return {
        totalDays: 0,
        averageScore: 0,
        bestDay: null,
        worstDay: null,
        averages: {},
        moodDistribution: {},
      };
    }

    const avgScore = Math.round(logs.reduce((s, l) => s + l.disciplineScore, 0) / logs.length);
    const bestDay = logs.reduce((best, l) => (l.disciplineScore > best.disciplineScore ? l : best));
    const worstDay = logs.reduce((worst, l) => (l.disciplineScore < worst.disciplineScore ? l : worst));

    // Calculate averages
    const averages = {
      sleepHours: +(logs.reduce((s, l) => s + l.sleepHours, 0) / logs.length).toFixed(1),
      studyHours: +(logs.reduce((s, l) => s + l.studyHours, 0) / logs.length).toFixed(1),
      workoutMinutes: +(logs.reduce((s, l) => s + l.workoutMinutes, 0) / logs.length).toFixed(0),
      waterIntake: +(logs.reduce((s, l) => s + l.waterIntake, 0) / logs.length).toFixed(1),
      screenTime: +(logs.reduce((s, l) => s + l.screenTime, 0) / logs.length).toFixed(1),
      tasksCompleted: +(logs.reduce((s, l) => s + l.tasksCompleted, 0) / logs.length).toFixed(0),
    };

    // Mood distribution
    const moodDistribution = {};
    logs.forEach((l) => {
      moodDistribution[l.mood] = (moodDistribution[l.mood] || 0) + 1;
    });

    return {
      totalDays: logs.length,
      averageScore: avgScore,
      bestDay: { date: bestDay.date, score: bestDay.disciplineScore },
      worstDay: { date: worstDay.date, score: worstDay.disciplineScore },
      averages,
      moodDistribution,
    };
  }

  /**
   * Get productivity trends over time.
   */
  async getTrends(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);

    const logs = await DailyLog.find({
      userId,
      date: { $gte: startDate },
    })
      .select('date disciplineScore sleepHours studyHours workoutMinutes waterIntake screenTime mood')
      .sort({ date: 1 });

    // Weekly aggregation
    const weeklyData = [];
    for (let i = 0; i < logs.length; i += 7) {
      const week = logs.slice(i, i + 7);
      if (week.length === 0) continue;

      weeklyData.push({
        weekStart: week[0].date,
        weekEnd: week[week.length - 1].date,
        avgScore: Math.round(week.reduce((s, l) => s + l.disciplineScore, 0) / week.length),
        avgSleep: +(week.reduce((s, l) => s + l.sleepHours, 0) / week.length).toFixed(1),
        avgStudy: +(week.reduce((s, l) => s + l.studyHours, 0) / week.length).toFixed(1),
        avgWorkout: +(week.reduce((s, l) => s + l.workoutMinutes, 0) / week.length).toFixed(0),
        daysLogged: week.length,
      });
    }

    // Trend direction
    let trend = 'neutral';
    if (weeklyData.length >= 2) {
      const lastWeek = weeklyData[weeklyData.length - 1].avgScore;
      const prevWeek = weeklyData[weeklyData.length - 2].avgScore;
      trend = lastWeek > prevWeek ? 'improving' : lastWeek < prevWeek ? 'declining' : 'stable';
    }

    return {
      dailyScores: logs.map((l) => ({ date: l.date, score: l.disciplineScore })),
      weeklyData,
      trend,
    };
  }

  /**
   * Get a heatmap of discipline scores (last N days).
   */
  async getHeatmap(userId, days = 90) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);

    const logs = await DailyLog.find({
      userId,
      date: { $gte: startDate },
    })
      .select('date disciplineScore')
      .sort({ date: 1 });

    return logs.map((l) => ({
      date: l.date.toISOString().split('T')[0],
      score: l.disciplineScore,
      intensity: l.disciplineScore >= 80 ? 'high' : l.disciplineScore >= 50 ? 'medium' : 'low',
    }));
  }

  /**
   * Get habit completion analytics.
   */
  async getHabitStats(userId) {
    const habits = await Habit.find({ userId, isActive: true });

    const stats = habits.map((h) => {
      const totalDays = Math.max(
        1,
        Math.ceil((Date.now() - new Date(h.createdAt)) / (1000 * 60 * 60 * 24))
      );

      return {
        habitId: h._id,
        title: h.title,
        streak: h.streak,
        bestStreak: h.bestStreak,
        totalCompletions: h.completedDates.length,
        completionRate: Math.round((h.completedDates.length / totalDays) * 100),
      };
    });

    return stats;
  }

  /**
   * Get bad habit trends.
   */
  async getBadHabitTrends(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);

    const badHabits = await BadHabit.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Group by type
    const byType = {};
    badHabits.forEach((bh) => {
      if (!byType[bh.type]) {
        byType[bh.type] = { count: 0, totalDuration: 0, entries: [] };
      }
      byType[bh.type].count++;
      byType[bh.type].totalDuration += bh.duration;
      byType[bh.type].entries.push({
        date: bh.date,
        duration: bh.duration,
        severity: bh.severity,
      });
    });

    return {
      totalEntries: badHabits.length,
      byType,
    };
  }
}

module.exports = new AnalyticsService();
