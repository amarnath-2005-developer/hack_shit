const { GoogleGenerativeAI } = require('@google/generative-ai');
const AIInsight = require('../models/AIInsight');
const DailyLog = require('../models/DailyLog');
const User = require('../models/User');
const UserStats = require('../models/UserStats');
const { AppError } = require('../utils/apiError');

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  /**
   * Lazy-initialize Gemini client.
   */
  _getModel() {
    if (!this.model) {
      if (!process.env.GEMINI_API_KEY) {
        throw new AppError('Gemini API key is not configured.', 503);
      }
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
    return this.model;
  }

  /**
   * Generate personalized daily schedule.
   */
  async generatePlan(userId, input) {
    const user = await User.findById(userId);

    const prompt = `You are DisciplineOS AI Planner — a productivity and discipline coach.

Generate a detailed, realistic daily schedule for the following user:

**User Profile:**
- Name: ${user?.name || 'User'}
- Occupation: ${user?.occupation || 'Student'}
- Wake Up Time: ${input.wakeUpTime || user?.wakeUpTime || '06:00'}
- Sleep Time: ${input.sleepTime || user?.sleepTime || '22:00'}
- College/Work Hours: ${input.collegeHours || '6 hours'}
- Study Goal: ${input.studyGoal || user?.studyGoal || 4} hours/day
- Workout Goal: ${input.workoutGoal || user?.workoutGoal || 30} minutes/day

**Instructions:**
1. Create a time-blocked schedule from wake up to sleep time
2. Include study sessions, workout, meals, breaks, and leisure
3. Include buffer time between activities
4. Prioritize deep work sessions in the morning
5. Add a wind-down routine before sleep
6. Be practical and realistic

Return the schedule as a JSON object with this structure:
{
  "schedule": [
    { "time": "06:00 - 06:30", "activity": "Morning Routine", "category": "routine", "tip": "Start with hydration" }
  ],
  "motivationalQuote": "...",
  "keyFocusAreas": ["..."]
}

Return ONLY valid JSON, no markdown or code blocks.`;

    const result = await this._generate(prompt);
    const parsed = this._parseJSON(result);

    // Save insight
    await AIInsight.create({
      userId,
      type: 'planner',
      content: parsed,
    });

    return parsed;
  }

  /**
   * AI Accountability Coach — answers questions with personalized advice.
   */
  async getCoaching(userId, { question, context }) {
    const [user, stats, recentLogs] = await Promise.all([
      User.findById(userId),
      UserStats.findOne({ userId }),
      DailyLog.find({ userId }).sort({ date: -1 }).limit(7),
    ]);

    const avgScore = recentLogs.length > 0
      ? Math.round(recentLogs.reduce((s, l) => s + l.disciplineScore, 0) / recentLogs.length)
      : 0;

    const prompt = `You are DisciplineOS AI Coach — a supportive but honest accountability partner.

**User Context:**
- Name: ${user?.name || 'User'}
- Occupation: ${user?.occupation || 'Unknown'}
- Current Streak: ${stats?.currentStreak || 0} days
- Level: ${stats?.level || 1}
- Total XP: ${stats?.totalXP || 0}
- Average Discipline Score (7 days): ${avgScore}/100
- Study Goal: ${user?.studyGoal || 4}h | Workout Goal: ${user?.workoutGoal || 30}min
- Known Bad Habits: ${user?.badHabits?.join(', ') || 'None specified'}

**Recent Performance (last 7 days):**
${recentLogs.map((l) => `- ${new Date(l.date).toLocaleDateString()}: Score ${l.disciplineScore}, Sleep ${l.sleepHours}h, Study ${l.studyHours}h, Mood: ${l.mood}`).join('\n') || 'No logs yet'}

**User's Question:** "${question}"
${context ? `**Additional Context:** ${context}` : ''}

**Instructions:**
1. Directly answer the user's question with actionable, specific advice
2. Reference their actual data when relevant
3. Be motivating but honest about areas needing improvement
4. Include concrete next steps
5. Predict their trajectory if they maintain/improve current habits

Return as JSON:
{
  "answer": "...",
  "actionItems": ["..."],
  "prediction": "...",
  "motivationalNote": "..."
}

Return ONLY valid JSON, no markdown or code blocks.`;

    const result = await this._generate(prompt);
    const parsed = this._parseJSON(result);

    await AIInsight.create({
      userId,
      type: 'coach',
      content: {
        question,
        ...parsed,
      },
    });

    return parsed;
  }

  /**
   * Generate daily review for today's log.
   */
  async generateDailyReview(userId) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [todayLog, user, stats, weekLogs] = await Promise.all([
      DailyLog.findOne({ userId, date: today }),
      User.findById(userId),
      UserStats.findOne({ userId }),
      DailyLog.find({ userId }).sort({ date: -1 }).limit(7),
    ]);

    if (!todayLog) {
      throw new AppError('No daily log found for today. Please log your day first.', 404);
    }

    const prompt = `You are DisciplineOS Daily Reviewer — analyze the user's day and provide insights.

**Today's Log:**
- Date: ${todayLog.date.toLocaleDateString()}
- Discipline Score: ${todayLog.disciplineScore}/100
- Sleep: ${todayLog.sleepHours} hours
- Study: ${todayLog.studyHours} hours (Goal: ${user?.studyGoal || 4}h)
- Workout: ${todayLog.workoutMinutes} minutes (Goal: ${user?.workoutGoal || 30}min)
- Water: ${todayLog.waterIntake} liters (Goal: ${user?.waterGoal || 3}L)
- Screen Time: ${todayLog.screenTime} hours
- Tasks Completed: ${todayLog.tasksCompleted}
- Mood: ${todayLog.mood}
- Notes: ${todayLog.notes || 'None'}

**User Stats:**
- Current Streak: ${stats?.currentStreak || 0} days
- Level: ${stats?.level || 1}

**Week Context (last 7 days avg scores):**
${weekLogs.map((l) => `${new Date(l.date).toLocaleDateString()}: ${l.disciplineScore}`).join(', ') || 'No history'}

**Instructions:**
Provide a detailed review with these sections:
1. Score Explanation: Break down why they got this score
2. What Went Well: Highlight positives
3. Areas to Improve: Be specific and constructive
4. Tomorrow's Suggestions: 3-5 actionable tips
5. Overall Verdict: One-line summary

Return as JSON:
{
  "scoreExplanation": "...",
  "whatWentWell": ["..."],
  "areasToImprove": ["..."],
  "suggestionsForTomorrow": ["..."],
  "verdict": "...",
  "emoji": "..."
}

Return ONLY valid JSON, no markdown or code blocks.`;

    const result = await this._generate(prompt);
    const parsed = this._parseJSON(result);

    await AIInsight.create({
      userId,
      type: 'review',
      content: parsed,
    });

    return parsed;
  }

  /**
   * Generate future predictions based on user trends.
   */
  async getPredictions(userId) {
    const [user, stats, logs] = await Promise.all([
      User.findById(userId),
      UserStats.findOne({ userId }),
      DailyLog.find({ userId }).sort({ date: -1 }).limit(30),
    ]);

    if (logs.length < 3) {
      throw new AppError('Need at least 3 days of logs for predictions.', 400);
    }

    const avgScore = Math.round(logs.reduce((s, l) => s + l.disciplineScore, 0) / logs.length);
    let trend = 'stable';
    if (logs.length >= 2) {
      const half = Math.floor(logs.length / 2);
      const recentAvg = logs.slice(0, half).reduce((s, l) => s + l.disciplineScore, 0) / half;
      const olderAvg = logs.slice(half).reduce((s, l) => s + l.disciplineScore, 0) / (logs.length - half);
      trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
    } else {
      trend = 'insufficient data';
    }

    const prompt = `You are DisciplineOS Predictor — forecast the user's trajectory.

**User Data (${logs.length} days):**
- Average Score: ${avgScore}/100
- Current Trend: ${trend}
- Current Streak: ${stats?.currentStreak || 0}
- Level: ${stats?.level || 1}
- Bad Habits: ${user?.badHabits?.join(', ') || 'None'}

**Score History (recent first):**
${logs.slice(0, 14).map((l) => `${new Date(l.date).toLocaleDateString()}: ${l.disciplineScore}`).join(', ')}

**Instructions:**
Make realistic predictions for:
1. Next 7 days
2. Next 30 days
3. Next 90 days

Include: productivity forecast, habit consistency, goal achievement probability, and risks.

Return as JSON:
{
  "sevenDayForecast": { "predictedAvgScore": 0, "insight": "..." },
  "thirtyDayForecast": { "predictedAvgScore": 0, "insight": "..." },
  "ninetyDayForecast": { "predictedAvgScore": 0, "insight": "..." },
  "risks": ["..."],
  "opportunities": ["..."],
  "overallOutlook": "..."
}

Return ONLY valid JSON, no markdown or code blocks.`;

    const result = await this._generate(prompt);
    const parsed = this._parseJSON(result);

    await AIInsight.create({
      userId,
      type: 'prediction',
      content: parsed,
    });

    return parsed;
  }

  /**
   * Get formatting chat history for AI coach.
   */
  async getCoachingHistory(userId) {
    const insights = await AIInsight.find({
      userId,
      type: 'coach',
    }).sort({ createdAt: 1 });

    const messages = [];
    insights.forEach((ins) => {
      const content = ins.content || {};
      messages.push({
        _id: `${ins._id}-user`,
        role: 'user',
        content: content.question || 'Discipline guidance request',
        createdAt: ins.createdAt.toISOString(),
      });
      messages.push({
        _id: `${ins._id}-assistant`,
        role: 'assistant',
        content: content.answer || content.rawResponse || 'Let\'s keep moving forward!',
        createdAt: ins.createdAt.toISOString(),
      });
    });

    return messages;
  }

  /**
   * Internal: call Gemini and return text.
   */
  async _generate(prompt) {
    try {
      const model = this._getModel();
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      throw new AppError(`AI service error: ${error.message}`, 503);
    }
  }

  /**
   * Parse JSON from AI response, handling markdown code blocks.
   */
  _parseJSON(text) {
    try {
      // Strip markdown code blocks if present
      let cleaned = text.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }
      return JSON.parse(cleaned);
    } catch {
      // Return as raw text if JSON parsing fails
      return { rawResponse: text };
    }
  }
}

module.exports = new AIService();
