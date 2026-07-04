const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'google-client-id-placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret-placeholder',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID or email
        let user = await User.findOne({
          $or: [
            { email: profile.emails[0].value, provider: 'google' },
            { email: profile.emails[0].value, provider: 'local' },
          ],
        });

        if (user) {
          // If user exists with local provider, link the Google account
          if (user.provider === 'local') {
            user.provider = 'google';
            user.profileImage = profile.photos[0]?.value || user.profileImage;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: 'google',
          profileImage: profile.photos[0]?.value || '',
        });

        // Create initial UserStats
        const UserStats = require('../models/UserStats');
        await UserStats.create({ userId: user._id });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
