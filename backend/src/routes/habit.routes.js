const router = require('express').Router();
const Joi = require('joi');
const habitController = require('../controllers/habit.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { HABIT_FREQUENCIES } = require('../utils/constants');

// ===================== Validation Schemas =====================

const createHabitSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).allow('').default(''),
  frequency: Joi.string().valid(...HABIT_FREQUENCIES).default('daily'),
  target: Joi.number().integer().min(1).default(1),
});

const updateHabitSchema = Joi.object({
  title: Joi.string().min(1).max(100),
  description: Joi.string().max(500).allow(''),
  frequency: Joi.string().valid(...HABIT_FREQUENCIES),
  target: Joi.number().integer().min(1),
  isActive: Joi.boolean(),
}).min(1);

// ===================== Routes =====================

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Morning Meditation
 *               description:
 *                 type: string
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *               target:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Habit created
 *   get:
 *     summary: Get all habits
 *     tags: [Habits]
 *     parameters:
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of habits
 */
router.post('/', auth, validate(createHabitSchema), habitController.create);
router.get('/', auth, habitController.getAll);

/**
 * @swagger
 * /api/habits/{id}:
 *   get:
 *     summary: Get a habit by ID
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit data
 *   put:
 *     summary: Update a habit
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit updated
 *   delete:
 *     summary: Delete a habit
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit deleted
 */
router.get('/:id', auth, habitController.getById);
router.put('/:id', auth, validate(updateHabitSchema), habitController.update);
router.delete('/:id', auth, habitController.delete);

/**
 * @swagger
 * /api/habits/{id}/complete:
 *   post:
 *     summary: Mark habit as completed for today
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit marked complete
 */
router.post('/:id/complete', auth, habitController.markComplete);
router.post('/:id/check', auth, habitController.markComplete);

/**
 * @swagger
 * /api/habits/{id}/analytics:
 *   get:
 *     summary: Get analytics for a specific habit
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit analytics data
 */
router.get('/:id/analytics', auth, habitController.getAnalytics);

module.exports = router;
