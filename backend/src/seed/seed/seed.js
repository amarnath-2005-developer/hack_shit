/**
 * DisciplineOS — Optional Seed Script (Demo Purposes Only)
 *
 * This script creates a single demo user with sample data for testing.
 * The application works perfectly without running this script.
 *
 * Usage:  npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../../config/db');

// Models
const User = require('../../models/User');
const DailyLog = require('../../models/DailyLog');
const Habit = require('../../models/Habit');
const BadHabit = require('../../models/BadHabit');
const UserStats = require('../../models/UserStats');

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed...\n');

    // Clean existing demo data
    const existingDemo = await User.findOne({ email: 'demo@disciplineos.com' });
    if (existingDemo) {
      await Promise.all([
        DailyLog.deleteMany({ userId: existingDemo._id }),
        Habit.deleteMany({ userId: existingDemo._id }),
        BadHabit.deleteMany({ userId: existingDemo._id }),
        UserStats.deleteMany({ userId: existingDemo._id }),
        User.deleteOne({ _id: existingDemo._id }),
      ]);
      console.log('🗑️  Cleaned previous demo data.');
    }

    // Create demo user
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@disciplineos.com',
      password: 'demo123456',
      provider: 'local',
      age: 21,
      occupation: 'Computer Science Student',
      wakeUpTime: '06:00',
      sleepTime: '22:30',
      studyGoal: 5,
      workoutGoal: 45,
      waterGoal: 3,
      badHabits: ['socialMedia', 'procrastination'],
    });
    console.log(`✅ Demo user created: ${user.email}`);

    // Create user stats
    await UserStats.create({
      userId: user._id,
      currentStreak: 0,
      bestStreak: 0,
      totalXP: 0,
      level: 1,
      badges: [],
    });
    console.log('✅ User stats initialized.');

    // Create sample habits
    const habits = await Habit.insertMany([
      {
        userId: user._id,
        title: 'Morning Meditation',
        description: '10 minutes of mindfulness meditation',
        frequency: 'daily',
        target: 1,
        isActive: true,
      },
      {
        userId: user._id,
        title: 'Read 20 Pages',
        description: 'Read non-fiction or course textbooks',
        frequency: 'daily',
        target: 1,
        isActive: true,
      },
      {
        userId: user._id,
        title: 'Drink 3L Water',
        description: 'Stay hydrated throughout the day',
        frequency: 'daily',
        target: 3,
        isActive: true,
      },
      {
        userId: user._id,
        title: 'Weekly Review',
        description: 'Review goals and plan the week ahead',
        frequency: 'weekly',
        target: 1,
        isActive: true,
      },
    ]);
    console.log(`✅ ${habits.length} sample habits created.`);

    // Create sample daily logs (last 30 days)
    const sampleDays = [];
    for (let i = 0; i < 30; i++) {
      sampleDays.push({
        sleepHours: parseFloat((6 + Math.random() * 3).toFixed(1)),
        studyHours: parseFloat((2 + Math.random() * 5).toFixed(1)),
        workoutMinutes: Math.random() > 0.3 ? Math.floor(20 + Math.random() * 45) : 0,
        waterIntake: parseFloat((1.5 + Math.random() * 2.5).toFixed(1)),
        mood: ['bad', 'okay', 'good', 'great'][Math.floor(Math.random() * 4)],
        screenTime: parseFloat((2 + Math.random() * 6).toFixed(1)),
        tasksCompleted: Math.floor(Math.random() * 10),
      });
    }

    // Import discipline score service to calculate real scores
    const disciplineScoreService = require('../../services/disciplineScore.service');

    const logPromises = sampleDays.map(async (data, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      date.setUTCHours(0, 0, 0, 0);

      // Calculate REAL discipline score — no hardcoding
      const score = await disciplineScoreService.calculate(user._id, data);

      return DailyLog.create({
        userId: user._id,
        date,
        ...data,
        disciplineScore: score,
      });
    });

    const logs = await Promise.all(logPromises);
    console.log(`✅ ${logs.length} sample daily logs created (scores calculated dynamically).`);

    // Create a few bad habit entries
    const badHabitEntries = [
      { type: 'socialMedia', duration: 90, severity: 'medium', notes: 'Scrolled Instagram reels' },
      { type: 'procrastination', duration: 45, severity: 'low', notes: 'Delayed starting assignment' },
      { type: 'gaming', duration: 120, severity: 'high', notes: 'Late night gaming session' },
    ];

    const bhPromises = badHabitEntries.map((data, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (3 - i));
      return BadHabit.create({ userId: user._id, ...data, date });
    });

    const bhs = await Promise.all(bhPromises);
    console.log(`✅ ${bhs.length} sample bad habit entries created.`);

    console.log('\n🎉 Seed complete!');
    console.log(`   Login: demo@disciplineos.com / demo123456\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
