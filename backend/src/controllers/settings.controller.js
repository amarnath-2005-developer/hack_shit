const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

class SettingsController {
  /**
   * GET /api/settings
   */
  async getSettings(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }
      
      ApiResponse.success(res, user.settings || {
        notifications: { email: true, push: true, dailyReminder: true },
        theme: 'dark',
        weekStart: 'monday',
        aiCoachEnabled: true
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/settings
   */
  async updateSettings(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }
      
      // Get plain object representation to avoid spreading Mongoose internals
      const currentSettings = user.settings ? user.settings.toObject() : {
        notifications: { email: true, push: true, dailyReminder: true },
        theme: 'dark',
        weekStart: 'monday',
        aiCoachEnabled: true
      };
      
      const newSettings = {
        ...currentSettings,
        ...req.body
      };
      
      // If notifications is nested in the request, merge it properly
      if (req.body.notifications) {
        newSettings.notifications = {
          ...currentSettings.notifications,
          ...req.body.notifications
        };
      }
      
      user.settings = newSettings;
      await user.save();
      
      ApiResponse.success(res, user.settings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();
