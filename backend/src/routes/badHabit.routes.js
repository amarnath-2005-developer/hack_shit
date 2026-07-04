const router = require('express').Router();
const Joi = require('joi');
const badHabitController = require('../controllers/badHabit.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { BAD_HABIT_TYPES, SEVERITY_LEVELS } = require('../utils/constants');

// ===================== Validation Schemas =====================

const createBadHabitSchema = Joi.object({
  type: Joi.string().valid(...BAD_HABIT_TYPES).required(),
  duration: Joi.number().min(0).max(1440).required(),
  severity: Joi.string().valid(...SEVERITY_LEVELS).default('medium'),
  notes: Joi.string().max(500).allow('').default(''),
  date: Joi.date().iso().optional(),
});

const updateBadHabitSchema = Joi.object({
  type: Joi.string().valid(...BAD_HABIT_TYPES),
  duration: Joi.number().min(0).max(1440),
  severity: Joi.string().valid(...SEVERITY_LEVELS),
  notes: Joi.string().max(500).allow(''),
}).min(1);

// ===================== Routes =====================

/**
 * @swagger
 * /api/bad-habits:
 *   post:
 *     summary: Log a bad habit occurrence
 *     tags: [Bad Habits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, duration]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [socialMedia, procrastination, junkFood, gaming]
 *               duration:
 *                 type: number
 *                 example: 60
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high]
 *               notes:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Bad habit logged
 *   get:
 *     summary: Get all bad habit entries (paginated)
 *     tags: [Bad Habits]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [socialMedia, procrastination, junkFood, gaming]
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
 *         description: List of bad habit entries
 */
router.post('/', auth, validate(createBadHabitSchema), badHabitController.create);
router.get('/', auth, badHabitController.getAll);

/**
 * @swagger
 * /api/bad-habits/trends:
 *   get:
 *     summary: Get bad habit trends and analytics
 *     tags: [Bad Habits]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Bad habit trend data
 */
router.get('/trends', auth, badHabitController.getTrends);

/**
 * @swagger
 * /api/bad-habits/{id}:
 *   put:
 *     summary: Update a bad habit entry
 *     tags: [Bad Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entry updated
 *   delete:
 *     summary: Delete a bad habit entry
 *     tags: [Bad Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entry deleted
 */
router.put('/:id', auth, validate(updateBadHabitSchema), badHabitController.update);
router.delete('/:id', auth, badHabitController.delete);

module.exports = router;
