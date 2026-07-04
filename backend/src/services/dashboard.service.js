const User = require('../models/User');
const UserStats = require('../models/UserStats');
const DailyLog = require('../models/DailyLog');
const Habit = require('../models/Habit');
const AIInsight = require('../models/AIInsight');

class DashboardService {
  /**
   * Assemble the complete dashboard payload for a user.
   */
  async getDashboard(userId) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Run all queries in parallel
    const [
      user,
      stats,
      todayLog,
      weekLogs,
      habits,
      recentInsight,
    ] = await Promise.all([
      User.findById(userId).select('name profileImage occupation studyGoal workoutGoal waterGoal'),
      UserStats.findOne({ userId }),
      DailyLog.findOne({ userId, date: today }),
      DailyLog.find({ userId, date: { $gte: sevenDaysAgo } })
        .select('date disciplineScore mood')
        .sort({ date: 1 }),
      Habit.find({ userId, isActive: true })
        .select('title streak completedDates frequency'),
      AIInsight.findOne({ userId })
        .sort({ createdAt: -1 })
        .select('type content createdAt'),
    ]);

    // Check which habits are completed today
    const todayStr = today.toISOString().split('T')[0];
    const todaysHabits = habits.map((h) => {
      const completedToday = h.completedDates.some(
        (d) => new Date(d).toISOString().split('T')[0] === todayStr
      );
      return {
        _id: h._id,
        title: h.title,
        streak: h.streak,
        frequency: h.frequency,
        completedToday,
      };
    });

    // Self-healing streak validation: check if last log was before yesterday
    const lastLog = await DailyLog.findOne({ userId }).sort({ date: -1 });
    let currentStreak = stats?.currentStreak || 0;
    if (stats) {
      if (!lastLog) {
        currentStreak = 0;
        stats.currentStreak = 0;
        await stats.save();
      } else {
        const lastLogDate = new Date(lastLog.date);
        lastLogDate.setUTCHours(0, 0, 0, 0);

        const yesterday = new Date();
        yesterday.setUTCHours(0, 0, 0, 0);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastLogDate < yesterday) {
          currentStreak = 0;
          stats.currentStreak = 0;
          await stats.save();
        }
      }
    }

    // Weekly progress
    const weeklyProgress = weekLogs.map((l) => ({
      date: l.date.toISOString(),
      disciplineScore: l.disciplineScore,
      mood: l.mood,
    }));

    // Calculate levelProgress
    const { LEVEL_THRESHOLDS } = require('../utils/constants');
    const currentLevel = stats?.level || 1;
    const currentXP = stats?.totalXP || 0;
    const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || (currentThreshold + 500);
    const needed = nextThreshold - currentThreshold;
    const progress = needed > 0 ? Math.round(((currentXP - currentThreshold) / needed) * 100) : 0;
    const levelProgress = Math.min(100, Math.max(0, progress));

    // Map AI Suggestions from rich content
    const aiSuggestions = [];
    if (recentInsight && recentInsight.content) {
      const content = recentInsight.content;
      if (recentInsight.type === 'review' && Array.isArray(content.suggestionsForTomorrow)) {
        content.suggestionsForTomorrow.forEach((s, idx) => {
          aiSuggestions.push({ _id: `suggestion-${idx}`, title: s, impact: 'High' });
        });
      } else if (recentInsight.type === 'coach' && Array.isArray(content.actionItems)) {
        content.actionItems.forEach((s, idx) => {
          aiSuggestions.push({ _id: `coach-${idx}`, title: s, impact: 'Medium' });
        });
      } else if (recentInsight.type === 'planner' && Array.isArray(content.keyFocusAreas)) {
        content.keyFocusAreas.forEach((s, idx) => {
          aiSuggestions.push({ _id: `planner-${idx}`, title: s, impact: 'Focus' });
        });
      } else if (content.rawResponse) {
        aiSuggestions.push({ _id: 'raw-1', title: content.rawResponse, impact: 'Coach' });
      }
    }

    return {
      user: {
        name: user?.name,
        profileImage: user?.profileImage,
        occupation: user?.occupation,
      },
      disciplineScore: todayLog?.disciplineScore || 0,
      currentStreak,
      bestStreak: stats?.bestStreak || 0,
      totalXP: stats?.totalXP || 0,
      level: stats?.level || 1,
      levelProgress,
      badges: stats?.badges || [],
      todaysLog: todayLog || null,
      todaysHabits,
      todaysGoals: todaysHabits.map((h) => ({ _id: h._id, title: h.title, done: h.completedToday })),
      weekly: weeklyProgress,
      aiSuggestions,
    };
  }
}

module.exports = new DashboardService();
