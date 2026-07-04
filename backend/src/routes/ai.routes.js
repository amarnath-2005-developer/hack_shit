const router = require('express').Router();
const Joi = require('joi');
const aiController = require('../controllers/ai.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// ===================== Validation Schemas =====================

const plannerSchema = Joi.object({
  wakeUpTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  sleepTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  collegeHours: Joi.string().max(50),
  studyGoal: Joi.number().min(0).max(16),
  workoutGoal: Joi.number().min(0).max(300),
});

const coachSchema = Joi.object({
  question: Joi.string().min(5).max(1000).required(),
  context: Joi.string().max(500).allow(''),
});

// ===================== Routes =====================

/**
 * @swagger
 * /api/ai/planner:
 *   post:
 *     summary: Generate a personalized daily schedule using AI
 *     tags: [AI]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wakeUpTime:
 *                 type: string
 *                 example: "06:00"
 *               sleepTime:
 *                 type: string
 *                 example: "22:00"
 *               collegeHours:
 *                 type: string
 *                 example: "9am to 3pm"
 *               studyGoal:
 *                 type: number
 *                 example: 4
 *               workoutGoal:
 *                 type: number
 *                 example: 45
 *     responses:
 *       200:
 *         description: AI-generated daily schedule
 */
router.post('/planner', auth, validate(plannerSchema), aiController.generatePlan);

/**
 * @swagger
 * /api/ai/coach:
 *   post:
 *     summary: Get personalized coaching advice from AI
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question]
 *             properties:
 *               question:
 *                 type: string
 *                 example: "How can I reduce screen time and be more productive?"
 *               context:
 *                 type: string
 *                 example: "I have exams coming up"
 *     responses:
 *       200:
 *         description: AI coaching response
 */
router.post('/coach', auth, validate(coachSchema), aiController.getCoaching);

/**
 * @swagger
 * /api/ai/review:
 *   post:
 *     summary: Generate AI review of today's performance
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI-generated daily review
 *       404:
 *         description: No daily log found for today
 */
router.post('/review', auth, aiController.getDailyReview);

/**
 * @swagger
 * /api/ai/predict:
 *   post:
 *     summary: Get AI predictions for future performance
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI-generated predictions
 *       400:
 *         description: Not enough data for predictions
 */
router.post('/predict', auth, aiController.getPredictions);
router.get('/history', auth, aiController.getHistory);
router.post('/chat', auth, aiController.chat);

module.exports = router;
