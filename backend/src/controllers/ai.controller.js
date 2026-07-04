const aiService = require('../services/ai.service');
const ApiResponse = require('../utils/apiResponse');

class AIController {
  /**
   * POST /api/ai/planner
   */
  async generatePlan(req, res, next) {
    try {
      const plan = await aiService.generatePlan(req.user._id, req.body);
      ApiResponse.success(res, plan, 'Daily plan generated successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/coach
   */
  async getCoaching(req, res, next) {
    try {
      const response = await aiService.getCoaching(req.user._id, req.body);
      ApiResponse.success(res, response, 'Coaching advice generated.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/review
   */
  async getDailyReview(req, res, next) {
    try {
      const review = await aiService.generateDailyReview(req.user._id);
      ApiResponse.success(res, review, 'Daily review generated.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/predict
   */
  async getPredictions(req, res, next) {
    try {
      const predictions = await aiService.getPredictions(req.user._id);
      ApiResponse.success(res, predictions, 'Predictions generated.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/ai/history
   */
  async getHistory(req, res, next) {
    try {
      const history = await aiService.getCoachingHistory(req.user._id);
      ApiResponse.success(res, history, 'Chat history retrieved.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/ai/chat
   */
  async chat(req, res, next) {
    try {
      const question = req.body.content || '';
      const response = await aiService.getCoaching(req.user._id, { question });
      
      const reply = {
        role: 'assistant',
        content: response.answer || response.rawResponse || 'Stay consistent and focus on your goals!',
        createdAt: new Date().toISOString(),
      };
      
      ApiResponse.success(res, { reply }, 'Message processed.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
