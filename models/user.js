// import { isMaster } from 'cluster';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bcrypt = require('bcryptjs');

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next) {
    var user = this;

    bcrypt.genSalt(10, function(err, salt) {
        if (err) next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.verifyPassword = function (password, next) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        next(null, isMatch);
    });
}

var User = mongoose.model('user', userSchema);

module.exports = { User, userSchema };