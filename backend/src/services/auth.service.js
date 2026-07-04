const User = require('../models/User');
const UserStats = require('../models/UserStats');
const { AuthError, ConflictError, ValidationError } = require('../utils/apiError');

class AuthService {
  /**
   * Register a new user.
   */
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('An account with this email already exists.');
    }

    const user = await User.create({ name, email, password, provider: 'local' });

    // Initialize user stats
    await UserStats.create({ userId: user._id });

    const token = user.generateToken();

    return { user, token };
  }

  /**
   * Login with email and password.
   */
  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AuthError('Invalid email or password.');
    }

    if (user.provider === 'google') {
      throw new AuthError('This account uses Google Sign-In. Please login with Google.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthError('Invalid email or password.');
    }

    const token = user.generateToken();

    // Remove password from response
    user.password = undefined;

    return { user, token };
  }

  /**
   * Handle Google OAuth callback — returns JWT for the authenticated user.
   */
  async googleAuth(user) {
    if (!user) {
      throw new AuthError('Google authentication failed.');
    }

    const token = user.generateToken();
    return { user, token };
  }

  /**
   * Get user profile.
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AuthError('User not found.');
    }
    return user;
  }

  /**
   * Update user profile fields.
   */
  async updateProfile(userId, updates) {
    const allowedFields = [
      'name', 'age', 'occupation', 'wakeUpTime', 'sleepTime',
      'studyGoal', 'workoutGoal', 'waterGoal', 'badHabits', 'profileImage',
    ];

    // Filter out any non-allowed fields
    const filteredUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      throw new ValidationError('No valid fields provided for update.');
    }

    const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true,
      runValidators: true,
    });

    return user;
  }
}

module.exports = new AuthService();
