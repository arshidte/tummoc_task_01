const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models/userModel");

module.exports = configure = (passport) => {

    passport.use(new LocalStrategy(
        function (username, password, done) {
          User.findOne({ username: username }, async function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
            if (!await bcrypt.compare(password, user.password)) {
                return done(null, false,  { message: 'Incorrect password.' });
            }
            return done(null, user);
          });
        }
      ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById({ _id: id }, (err, user) => {
      if(err) return done(null, false);
      return done(null, user)
    });
  });
};