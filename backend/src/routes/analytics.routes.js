const router = require('express').Router();
const analyticsController = require('../controllers/analytics.controller');
const auth = require('../middleware/auth');

// ===================== Routes =====================

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get comprehensive analytics summary
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           default: 30d
 *     responses:
 *       200:
 *         description: Analytics summary data
 */
router.get('/', auth, analyticsController.getSummary);

/**
 * @swagger
 * /api/analytics/weekly:
 *   get:
 *     summary: Get weekly discipline scores (last 7 days)
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Weekly score data with averages
 */
router.get('/weekly', auth, analyticsController.getWeekly);

/**
 * @swagger
 * /api/analytics/monthly:
 *   get:
 *     summary: Get monthly report (last 30 days)
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Monthly report with averages, best/worst days, mood distribution
 */
router.get('/monthly', auth, analyticsController.getMonthly);

/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     summary: Get productivity trends over time
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Trend data with weekly aggregations
 */
router.get('/trends', auth, analyticsController.getTrends);

/**
 * @swagger
 * /api/analytics/heatmap:
 *   get:
 *     summary: Get discipline score heatmap data
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 90
 *     responses:
 *       200:
 *         description: Heatmap data with dates, scores, and intensity levels
 */
router.get('/heatmap', auth, analyticsController.getHeatmap);

/**
 * @swagger
 * /api/analytics/habits:
 *   get:
 *     summary: Get habit completion analytics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Habit completion rates and streaks
 */
router.get('/habits', auth, analyticsController.getHabitStats);

/**
 * @swagger
 * /api/analytics/score-history:
 *   get:
 *     summary: Get discipline score history
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Score history data
 */
router.get('/score-history', auth, analyticsController.getScoreHistory);

module.exports = router;
