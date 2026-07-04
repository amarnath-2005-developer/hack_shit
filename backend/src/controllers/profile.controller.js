const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

class ProfileController {
  /**
   * GET /api/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }
      
      const profile = user.toJSON();
      // joinedAt mapping for frontend
      profile.joinedAt = user.createdAt;
      
      ApiResponse.success(res, profile);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/profile
   */
  async updateProfile(req, res, next) {
    try {
      const allowedFields = ['name', 'bio', 'timezone', 'age', 'occupation', 'wakeUpTime', 'sleepTime', 'studyGoal', 'workoutGoal', 'waterGoal'];
      const updateData = {};
      
      Object.keys(req.body).forEach(key => {
        if (allowedFields.includes(key)) {
          updateData[key] = req.body[key];
        }
      });
      
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }
      
      const profile = user.toJSON();
      profile.joinedAt = user.createdAt;
      
      ApiResponse.success(res, profile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
