/**
 * Application-wide constants.
 */

const MOODS = ['great', 'good', 'okay', 'bad', 'terrible'];

const HABIT_FREQUENCIES = ['daily', 'weekly', 'monthly'];

const BAD_HABIT_TYPES = ['socialMedia', 'procrastination', 'junkFood', 'gaming'];

const SEVERITY_LEVELS = ['low', 'medium', 'high'];

const AUTH_PROVIDERS = ['local', 'google'];

const AI_INSIGHT_TYPES = ['planner', 'coach', 'review', 'prediction'];

const BADGE_TYPES = {
  STREAK_7: '7-Day Streak',
  STREAK_30: '30-Day Streak',
  STREAK_100: '100-Day Streak',
  EARLY_BIRD: 'Early Bird',
  STUDY_MASTER: 'Study Master',
  FITNESS_WARRIOR: 'Fitness Warrior',
  DISCIPLINE_MONK: 'Discipline Monk',
  HYDRATION_HERO: 'Hydration Hero',
  PERFECT_WEEK: 'Perfect Week',
  CENTURION: 'Centurion Score',
};

/**
 * Discipline score weights — must sum to 1.0
 */
const SCORE_WEIGHTS = {
  sleep: 0.20,
  study: 0.20,
  workout: 0.15,
  water: 0.15,
  tasks: 0.20,
  screenTime: 0.10,
};

/**
 * XP rewards for various actions.
 */
const XP_REWARDS = {
  DAILY_LOG: 10,
  HABIT_COMPLETE: 5,
  STREAK_BONUS: 2,       // per streak day
  HIGH_SCORE: 20,         // score >= 80
  PERFECT_SCORE: 50,      // score === 100
  BADGE_EARNED: 25,
};

/**
 * Level thresholds — XP required for each level.
 */
const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2200,   // Level 7
  3000,   // Level 8
  4000,   // Level 9
  5500,   // Level 10
];

module.exports = {
  MOODS,
  HABIT_FREQUENCIES,
  BAD_HABIT_TYPES,
  SEVERITY_LEVELS,
  AUTH_PROVIDERS,
  AI_INSIGHT_TYPES,
  BADGE_TYPES,
  SCORE_WEIGHTS,
  XP_REWARDS,
  LEVEL_THRESHOLDS,
};
