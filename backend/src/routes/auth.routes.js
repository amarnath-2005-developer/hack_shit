const router = require('express').Router();
const Joi = require('joi');
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const passport = require('passport');

// ===================== Validation Schemas =====================

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  age: Joi.number().integer().min(10).max(120),
  occupation: Joi.string().max(100),
  wakeUpTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  sleepTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  studyGoal: Joi.number().min(0).max(16),
  workoutGoal: Joi.number().min(0).max(300),
  waterGoal: Joi.number().min(0).max(10),
  badHabits: Joi.array().items(Joi.string()),
  profileImage: Joi.string().uri().allow(''),
});

// ===================== Routes =====================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout (client should discard token)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', auth, authController.logout);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to Google consent screen
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to client with JWT token
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google/failure' }),
  authController.googleCallback
);

router.get('/google/failure', (req, res) => {
  res.status(401).json({ success: false, message: 'Google authentication failed.' });
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               occupation:
 *                 type: string
 *               wakeUpTime:
 *                 type: string
 *               sleepTime:
 *                 type: string
 *               studyGoal:
 *                 type: number
 *               workoutGoal:
 *                 type: number
 *               waterGoal:
 *                 type: number
 *               badHabits:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.get('/profile', auth, authController.getProfile);
router.get('/me', auth, authController.getProfile);
router.put('/profile', auth, validate(updateProfileSchema), authController.updateProfile);

module.exports = router;
