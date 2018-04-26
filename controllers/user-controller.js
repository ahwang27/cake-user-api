var jwt = require('jsonwebtoken');

var { User } = require('../models/user');

// GET ALL [/users]
const index = (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            res.json({ error: "Token invalid; token may have expired" })
        }
        else {
            User.find().exec((err, users) => {
                res.json({ authData, users });
            })
        }
    });
}

// GET BY ID [/users/:id]
const getById = (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            res.json({ error: "Token invalid; token may have expired" })
        }
        else {
            User.findById(req.params.id).exec((err, user) => {
                if (user === null) {
                    res.status(404).json({ message: "User Not Found" });
                } else {
                    res.json(user);
                }
            })
        }
    });
}

const createNewUser = (req, res) => {
    var newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) throw err;

        res.json(user);
    })
}



// POST 
const create = (req, res) => {
    var newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) throw err;

        res.json(user);
    });

    

    // jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    //     if (err) {
    //         res.json({ error: "Token invalid; token may have expired" })
    //     }
    //     else {
    //         var newUser = new User(req.body);
    //         newUser.save((err, user) => {
    //             if (err) throw err;

    //             res.json(user);
    //         });
    //     }
    // });
}

// DELETE
const destroy = (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            res.json({ error: "Token invalid; token may have expired" })
        }
        else {
            User.findByIdAndRemove(req.params.id, (err, user) => {
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                } else {
                    res.json(user);
                }
            })
        }
    });

}

// Find user, verify password

const login = (req, res) => {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        else if (err) {
            res.json({ error: error });
        }
        else {
            user.verifyPassword(req.body.password, function (err, isMatch) {
                if (isMatch) {
                    jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '30m' }, (err, token) => {
                        res.json({
                            success: true,
                            token: token
                        });
                    })

                }
                else {
                    res.json({ success: false });
                }
            });
        }

    });
}

//check token

const tokenCheck = (req, res) => {
    console.log("TOKEN", req.token)
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            res.json({ success: false })
        }
        else {
            res.json({ success: true })
        }
    });
}


module.exports = {
    index,
    getById,
    create,
    destroy,
    login,
    tokenCheck,
    createNewUser
}