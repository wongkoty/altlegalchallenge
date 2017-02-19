var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
// console.log('wtf')

var User = require('../models/user');
var config = require('../_config');
var init = require('./init');

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('in twitter auth passport')
    var searchQuery = {
      name: profile.displayName
    };

    var updates = {
      name: profile.displayName,
      twitterID: profile.id
    };

    var options = {
      upsert: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      console.log('user twitter')
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  }

));

// serialize user into the session
init();


module.exports = passport;
