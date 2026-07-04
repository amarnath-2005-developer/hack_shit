const mongoose = require('mongoose');
const { MOODS } = require('../utils/constants');

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    sleepHours: {
      type: Number,
      default: 8,
      min: [0, 'Sleep hours cannot be negative'],
      max: [24, 'Sleep hours cannot exceed 24'],
    },
    studyHours: {
      type: Number,
      default: 0,
      min: [0, 'Study hours cannot be negative'],
      max: [24, 'Study hours cannot exceed 24'],
    },
    workoutMinutes: {
      type: Number,
      default: 0,
      min: [0, 'Workout minutes cannot be negative'],
      max: [600, 'Workout minutes cannot exceed 600'],
    },
    waterIntake: {
      type: Number,
      default: 0,
      min: [0, 'Water intake cannot be negative'],
      max: [20, 'Water intake cannot exceed 20 liters'],
    },
    mood: {
      type: String,
      set: function(val) {
        if (typeof val === 'number') {
          if (val >= 9) return 'great';
          if (val >= 7) return 'good';
          if (val >= 4) return 'okay';
          if (val >= 2) return 'bad';
          return 'terrible';
        }
        return val;
      },
      enum: {
        values: MOODS,
        message: '{VALUE} is not a valid mood',
      },
      default: 'okay',
    },
    screenTime: {
      type: Number,
      default: 0,
      min: [0, 'Screen time cannot be negative'],
      max: [24, 'Screen time cannot exceed 24 hours'],
    },
    tasksCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Tasks completed cannot be negative'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    disciplineScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Map focusMinutes to studyHours
dailyLogSchema.virtual('focusMinutes').get(function () {
  return (this.studyHours || 0) * 60;
}).set(function (val) {
  this.studyHours = (val || 0) / 60;
});

dailyLogSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    const moodMap = { great: 10, good: 8, okay: 5, bad: 3, terrible: 1 };
    if (ret.mood && moodMap[ret.mood]) {
      ret.mood = moodMap[ret.mood];
    }
    return ret;
  }
});
dailyLogSchema.set('toObject', { virtuals: true });

// Compound unique index: one log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
