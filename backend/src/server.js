const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Bootstrap the server.
 */
const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 DisciplineOS API Server`);
      console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Port        : ${PORT}`);
      console.log(`   API Docs    : http://localhost:${PORT}/api-docs`);
      console.log(`   Health      : http://localhost:${PORT}/api/health\n`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ Server closed.');
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Rejection:', err.message);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err.message);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
