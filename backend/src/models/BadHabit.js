const mongoose = require('mongoose');
const { BAD_HABIT_TYPES, SEVERITY_LEVELS } = require('../utils/constants');

const badHabitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: BAD_HABIT_TYPES,
        message: '{VALUE} is not a valid bad habit type',
      },
      required: [true, 'Bad habit type is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [0, 'Duration cannot be negative'],
      max: [1440, 'Duration cannot exceed 24 hours'],
    },
    severity: {
      type: String,
      enum: {
        values: SEVERITY_LEVELS,
        message: '{VALUE} is not a valid severity level',
      },
      default: 'medium',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

badHabitSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('BadHabit', badHabitSchema);
