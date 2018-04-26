var passport = require('passport');
var jwt = require('jsonwebtoken');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user').User;

passport.use(new BasicStrategy(
    function (username, password, next) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                next(err);
            }
            if (user == null) {
                next(null, false);
            } else {
                user.verifyPassword({ password: password }, function (err, isMatch) {
                    if (isMatch) {
                        next(null, user);
                    }
                    else {
                        next(null, false);
                    }
                });
            }
        });
    }));

const isAuthenticated = passport.authenticate('basic', { session: false });

function verifyToken(req, res, next) {
    // Get auth header/bearer value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Get bearer token from header
        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];
        // Set token
        req.token = bearerToken;
        // go to next middleware
        next();
    } else {
        res.json({ 
            error: "No token found"
        })
    }
}

module.exports = { isAuthenticated, verifyToken };
