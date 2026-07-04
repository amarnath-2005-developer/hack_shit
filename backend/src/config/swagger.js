const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DisciplineOS API',
      version: '1.0.0',
      description:
        'AI-powered discipline tracking backend API. Track habits, calculate discipline scores, get AI-powered coaching and planning.',
      contact: {
        name: 'DisciplineOS Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            profileImage: { type: 'string' },
            provider: { type: 'string', enum: ['local', 'google'] },
            age: { type: 'number', example: 21 },
            occupation: { type: 'string', example: 'Student' },
            wakeUpTime: { type: 'string', example: '06:00' },
            sleepTime: { type: 'string', example: '22:00' },
            studyGoal: { type: 'number', example: 6 },
            workoutGoal: { type: 'number', example: 45 },
            waterGoal: { type: 'number', example: 3 },
            badHabits: { type: 'array', items: { type: 'string' } },
          },
        },
        DailyLog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            date: { type: 'string', format: 'date' },
            sleepHours: { type: 'number', example: 7.5 },
            studyHours: { type: 'number', example: 5 },
            workoutMinutes: { type: 'number', example: 45 },
            waterIntake: { type: 'number', example: 3 },
            mood: {
              type: 'string',
              enum: ['great', 'good', 'okay', 'bad', 'terrible'],
            },
            screenTime: { type: 'number', example: 4 },
            tasksCompleted: { type: 'number', example: 8 },
            notes: { type: 'string' },
            disciplineScore: { type: 'number', example: 82 },
          },
        },
        Habit: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string', example: 'Morning Meditation' },
            description: { type: 'string' },
            frequency: {
              type: 'string',
              enum: ['daily', 'weekly', 'monthly'],
            },
            target: { type: 'number', example: 30 },
            streak: { type: 'number' },
            completedDates: { type: 'array', items: { type: 'string' } },
            isActive: { type: 'boolean' },
          },
        },
        BadHabit: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            type: {
              type: 'string',
              enum: ['socialMedia', 'procrastination', 'junkFood', 'gaming'],
            },
            duration: { type: 'number', example: 60 },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
            },
            notes: { type: 'string' },
            date: { type: 'string', format: 'date' },
          },
        },
        UserStats: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            currentStreak: { type: 'number' },
            bestStreak: { type: 'number' },
            totalXP: { type: 'number' },
            level: { type: 'number' },
            badges: { type: 'array', items: { type: 'string' } },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
