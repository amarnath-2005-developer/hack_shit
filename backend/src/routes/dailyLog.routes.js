const router = require('express').Router();
const Joi = require('joi');
const dailyLogController = require('../controllers/dailyLog.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { MOODS } = require('../utils/constants');

// ===================== Validation Schemas =====================

const createLogSchema = Joi.object({
  date: Joi.date().iso().optional(),
  sleepHours: Joi.number().min(0).max(24).optional().default(8),
  studyHours: Joi.number().min(0).max(24).optional().default(0),
  focusMinutes: Joi.number().min(0).max(1440).optional(),
  workoutMinutes: Joi.number().min(0).max(600).optional().default(0),
  waterIntake: Joi.number().min(0).max(20).optional().default(0),
  mood: Joi.alternatives().try(
    Joi.string().valid(...MOODS),
    Joi.number().min(1).max(10)
  ).optional().default('okay'),
  screenTime: Joi.number().min(0).max(24).optional().default(0),
  tasksCompleted: Joi.number().integer().min(0).optional().default(0),
  notes: Joi.string().max(1000).allow('').optional().default(''),
});

const updateLogSchema = Joi.object({
  sleepHours: Joi.number().min(0).max(24),
  studyHours: Joi.number().min(0).max(24),
  focusMinutes: Joi.number().min(0).max(1440),
  workoutMinutes: Joi.number().min(0).max(600),
  waterIntake: Joi.number().min(0).max(20),
  mood: Joi.alternatives().try(
    Joi.string().valid(...MOODS),
    Joi.number().min(1).max(10)
  ),
  screenTime: Joi.number().min(0).max(24),
  tasksCompleted: Joi.number().integer().min(0),
  notes: Joi.string().max(1000).allow(''),
}).min(1);

// ===================== Routes =====================

/**
 * @swagger
 * /api/daily-logs:
 *   post:
 *     summary: Create a new daily log
 *     tags: [Daily Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sleepHours]
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               sleepHours:
 *                 type: number
 *                 example: 7.5
 *               studyHours:
 *                 type: number
 *                 example: 5
 *               workoutMinutes:
 *                 type: number
 *                 example: 45
 *               waterIntake:
 *                 type: number
 *                 example: 3
 *               mood:
 *                 type: string
 *                 enum: [great, good, okay, bad, terrible]
 *               screenTime:
 *                 type: number
 *                 example: 4
 *               tasksCompleted:
 *                 type: number
 *                 example: 8
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Daily log created with discipline score
 *       409:
 *         description: Log already exists for this date
 *   get:
 *     summary: Get all daily logs (paginated)
 *     tags: [Daily Logs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of daily logs
 */
router.post('/', auth, validate(createLogSchema), dailyLogController.create);
router.get('/', auth, dailyLogController.getAll);

/**
 * @swagger
 * /api/daily-logs/today:
 *   get:
 *     summary: Get today's daily log
 *     tags: [Daily Logs]
 *     responses:
 *       200:
 *         description: Today's log or null
 */
router.get('/today', auth, dailyLogController.getToday);

/**
 * @swagger
 * /api/daily-logs/{id}:
 *   get:
 *     summary: Get a daily log by ID
 *     tags: [Daily Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daily log data
 *       404:
 *         description: Log not found
 *   put:
 *     summary: Update a daily log
 *     tags: [Daily Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DailyLog'
 *     responses:
 *       200:
 *         description: Updated daily log
 *   delete:
 *     summary: Delete a daily log
 *     tags: [Daily Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log deleted
 */
router.get('/:id', auth, dailyLogController.getById);
router.put('/:id', auth, validate(updateLogSchema), dailyLogController.update);
router.delete('/:id', auth, dailyLogController.delete);

module.exports = router;
