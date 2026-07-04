const mongoose = require('mongoose');
const { HABIT_FREQUENCIES } = require('../utils/constants');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    frequency: {
      type: String,
      enum: {
        values: HABIT_FREQUENCIES,
        message: '{VALUE} is not a valid frequency',
      },
      default: 'daily',
    },
    target: {
      type: Number,
      default: 1,
      min: [1, 'Target must be at least 1'],
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedDates: {
      type: [Date],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Duplicate title to name for frontend compatibility
habitSchema.virtual('name').get(function () {
  return this.title;
}).set(function (val) {
  this.title = val;
});

habitSchema.set('toJSON', { virtuals: true });
habitSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Habit', habitSchema);
