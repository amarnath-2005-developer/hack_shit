const mongoose = require('mongoose');
const { BADGE_TYPES } = require('../utils/constants');

const userStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    badges: {
      type: [String],
      enum: Object.values(BADGE_TYPES),
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserStats', userStatsSchema);
