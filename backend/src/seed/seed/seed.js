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
const connectDB = require('../config/db');

// Models
const User = require('../models/User');
const DailyLog = require('../models/DailyLog');
const Habit = require('../models/Habit');
const BadHabit = require('../models/BadHabit');
const UserStats = require('../models/UserStats');

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
    const password = await bcrypt.hash('demo123456', 12);
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@disciplineos.com',
      password,
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

    // Create sample daily logs (last 7 days)
    const sampleDays = [
      { sleepHours: 7.5, studyHours: 5, workoutMinutes: 40, waterIntake: 3, mood: 'good', screenTime: 3, tasksCompleted: 7 },
      { sleepHours: 6, studyHours: 3, workoutMinutes: 0, waterIntake: 2, mood: 'okay', screenTime: 6, tasksCompleted: 4 },
      { sleepHours: 8, studyHours: 6, workoutMinutes: 50, waterIntake: 3.5, mood: 'great', screenTime: 2, tasksCompleted: 9 },
      { sleepHours: 5.5, studyHours: 2, workoutMinutes: 20, waterIntake: 1.5, mood: 'bad', screenTime: 7, tasksCompleted: 3 },
      { sleepHours: 7, studyHours: 4.5, workoutMinutes: 45, waterIntake: 3, mood: 'good', screenTime: 4, tasksCompleted: 6 },
      { sleepHours: 8, studyHours: 5.5, workoutMinutes: 60, waterIntake: 4, mood: 'great', screenTime: 2.5, tasksCompleted: 8 },
      { sleepHours: 6.5, studyHours: 4, workoutMinutes: 30, waterIntake: 2.5, mood: 'okay', screenTime: 5, tasksCompleted: 5 },
    ];

    // Import discipline score service to calculate real scores
    const disciplineScoreService = require('../services/disciplineScore.service');

    const logPromises = sampleDays.map(async (data, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 - i));
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
