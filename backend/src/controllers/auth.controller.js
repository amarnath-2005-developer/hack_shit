const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { user, token } = await authService.register(req.body);
      ApiResponse.created(res, { user, token }, 'Registration successful.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { user, token } = await authService.login(req.body);
      ApiResponse.success(res, { user, token }, 'Login successful.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      // JWT is stateless — client should discard the token.
      // This endpoint exists for API completeness.
      ApiResponse.success(res, null, 'Logged out successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/google/callback
   * Handles Google OAuth callback.
   */
  async googleCallback(req, res, next) {
    try {
      const { user, token } = await authService.googleAuth(req.user);
      // Redirect to frontend with token
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      res.redirect(`${clientUrl}/auth/callback?token=${token}`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user._id);
      ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   */
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user._id, req.body);
      ApiResponse.success(res, user, 'Profile updated successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
