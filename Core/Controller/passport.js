const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');

// import the database configuration
const dbconf = require('../Model/database');


passport.serializeUser((user, done) => {
    return done(null, user.id_User);
});

passport.deserializeUser((id_User, done) => {
    dbconf.query("SELECT * FROM users WHERE id_User = ?", [id_User], (err, rows) => {
        done(err, rows[0]);
    })
})

passport.use('local-login', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        dbconf.query("SELECT * FROM users WHERE username = ?", [username], (err, rows) => {
            if (err) return done(err)

            if (!rows.length) return done(null, false, req.flash('loginMessage', 'No USER Found'))

            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, req.flash('loginMessage', 'Wrong Password'))

            return done(null, rows[0])
        })
    }))

passport.use('local-signUp', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        dbconf.query("SELECT * FROM users WHERE username = ?", [username], (err, rows) => {
            if (err) return done(err)
            if (rows.length) return done(null, false, req.flash('signupMessage', 'That is Already taken :('))
            const User = { username: username, password: bcrypt.hashSync(password, null, null) }
            const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
            dbconf.query(sql, [User.username, User.password], (err, rows) => {
                if (err) return done(err)
                return done(null, User)
            })
        })
    }
))



module.exports = passport;