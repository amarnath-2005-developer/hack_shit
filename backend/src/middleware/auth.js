const jwt = require('jsonwebtoken');
const { AuthError } = require('../utils/apiError');
const User = require('../models/User');

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header and attaches user to req.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AuthError('User not found. Token is invalid.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AuthError('Invalid token.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AuthError('Token has expired.'));
    }
    next(error);
  }
};

module.exports = auth;
