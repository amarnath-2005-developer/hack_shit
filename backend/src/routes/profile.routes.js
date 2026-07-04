const router = require('express').Router();
const profileController = require('../controllers/profile.controller');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get('/', auth, profileController.getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Updated profile data
 */
router.put('/', auth, profileController.updateProfile);

module.exports = router;
