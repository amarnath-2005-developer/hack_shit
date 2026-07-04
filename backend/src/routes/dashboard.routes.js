const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get complete dashboard data
 *     tags: [Dashboard]
 *     description: Returns discipline score, streak, XP, today's habits, weekly progress, and AI suggestions in a single call.
 *     responses:
 *       200:
 *         description: Complete dashboard payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     occupation:
 *                       type: string
 *                 disciplineScore:
 *                   type: number
 *                   example: 78
 *                 currentStreak:
 *                   type: number
 *                   example: 12
 *                 totalXP:
 *                   type: number
 *                   example: 1450
 *                 level:
 *                   type: number
 *                   example: 5
 *                 todaysHabits:
 *                   type: array
 *                   items:
 *                     type: object
 *                 weeklyProgress:
 *                   type: array
 *                   items:
 *                     type: object
 *                 aiSuggestion:
 *                   type: object
 */
router.get('/', auth, dashboardController.getDashboard);

module.exports = router;
