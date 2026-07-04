require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');

const errorHandler = require('./middleware/errorHandler');
const swaggerSpec = require('./config/swagger');

// Initialize passport strategy
require('./config/passport');

const app = express();

// ===================== Security Middleware =====================

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// General rate limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

// AI rate limiter: 15 requests per 15 minutes (Gemini API calls are expensive)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'AI rate limit reached. Please wait before making more AI requests.',
  },
});

app.use(generalLimiter);

// ===================== Body Parsing =====================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ===================== Logging =====================

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ===================== Passport =====================

app.use(passport.initialize());

// ===================== API Documentation =====================

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'DisciplineOS API Docs',
}));

// ===================== Health Check =====================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DisciplineOS API is running.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ===================== Routes =====================

const authRoutes = require('./routes/auth.routes');
const dailyLogRoutes = require('./routes/dailyLog.routes');
const habitRoutes = require('./routes/habit.routes');
const badHabitRoutes = require('./routes/badHabit.routes');
const aiRoutes = require('./routes/ai.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const profileRoutes = require('./routes/profile.routes');
const settingsRoutes = require('./routes/settings.routes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/daily-logs', dailyLogRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/bad-habits', badHabitRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);

// ===================== 404 Handler =====================

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ===================== Global Error Handler =====================

app.use(errorHandler);

module.exports = app;
