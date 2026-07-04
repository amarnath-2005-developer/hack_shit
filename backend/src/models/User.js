const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    profileImage: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    // Profile fields (embedded — no separate collection)
    age: {
      type: Number,
      min: [10, 'Age must be at least 10'],
      max: [120, 'Age must be realistic'],
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    wakeUpTime: {
      type: String,
      default: '06:00',
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm format'],
    },
    sleepTime: {
      type: String,
      default: '22:00',
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm format'],
    },
    studyGoal: {
      type: Number,
      default: 4, // hours per day
      min: 0,
      max: 16,
    },
    workoutGoal: {
      type: Number,
      default: 30, // minutes per day
      min: 0,
      max: 300,
    },
    waterGoal: {
      type: Number,
      default: 3, // liters per day
      min: 0,
      max: 10,
    },
    badHabits: {
      type: [String],
      default: [],
    },
    
    // Additional Profile fields
    bio: {
      type: String,
      default: '',
      maxlength: 300,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },

    // Settings fields
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        dailyReminder: { type: Boolean, default: true }
      },
      theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
      weekStart: { type: String, enum: ['monday', 'sunday'], default: 'monday' },
      aiCoachEnabled: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before saving.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Compare entered password with hashed password.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate JWT token.
 */
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Remove sensitive fields from JSON output.
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
