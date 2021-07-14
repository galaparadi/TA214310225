const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GDriveStrategy = require('passport-google-drive').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const UserDatasource = require('../datasource/datasource').Users();

passport.serializeUser((user, done) => {
  done(null, { username: user.user.username, accesstoken: user.accessToken });
});

passport.deserializeUser(async (username, done) => {
  try {
    let { user } = await UserDatasource.getUser({ username: username.username });
    done(null, user);
  } catch (error) {
    console.log(error.message);
    done(error, false);
  }
});

passport.use(
  new GDriveStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/u/auth/gdrive/redirect',
  }, (accessToken, refreshToken, profile, done) => {
    console.log({ accessToken, refreshToken })
    return done(null, { email: profile.email, accessToken });
  })
);

passport.use(
  new GoogleStrategy({
    // options for google strategy
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/u/auth/google/redirect',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  }, async (accessToken, refreshToken, profile, done) => {
    // ---------- check if user already exists in our own db
    let { user } = await UserDatasource.authGoogleUser({ googleId: profile.id });
    if (user) {
      return done(null, { user, accessToken }, { registered: true });
    } else {
      let uname = profile.emails[0].value.split('@');
      let newUser = new User({
        googleId: profile.id,
        username: uname[0],
        email: profile.emails[0].value,
        googleAccount: true
      })

      return done(null, { user: newUser, accessToken }, { registered: false });
    }
  })
);

passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      let { user, status, message } = await UserDatasource.authUser({ username, password });
      if (!user) {
        return done(null, false, { status });
      }
      return done(null, {user, status});
    } catch (err) {
      console.log(err);
      if (err) { return done(null, false, { status }); }
    }
  }
));