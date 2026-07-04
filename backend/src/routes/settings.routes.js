const router = require('express').Router();
const settingsController = require('../controllers/settings.controller');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get current user's settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Settings data
 */
router.get('/', auth, settingsController.getSettings);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update user settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Updated settings data
 */
router.put('/', auth, settingsController.updateSettings);

module.exports = router;
