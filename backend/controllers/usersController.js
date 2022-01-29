const User = require('../models/User');
const logEvents = require('../middleware/logEvents');
const passport = require('passport');


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const register = async (req, res) => {
    const { userName, password } = req.body;
    if (!password || !userName) {
        res.status(400).json({
            success: false,
            message: 'Username and password are required.',
            data: []
        });

        res.end();
        return;
    }
    try {
        return await User.register({ username: userName }, password, (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.toString(),
                    data: []
                });
            }

            return passport.authenticate("local", {}, (req, res) => {
                return res.json(user);
            });
        });
    } catch (e) {
        logEvents.customEmitter.emit('error', e);
        return e.toString();
    }
};

const findUserByEmail = async (searchParams) => {
    try {
        return await User.find({ userName: searchParams.userName });
    } catch (e) {
        logEvents.customEmitter.emit('error', e);
        return false;
    }
};

const listUsers = async () => {
    try {
        const users = await User.find({});
        console.log(users);
        const userMap = {};
        users.forEach((user) => {
            console.log(user);
            userMap[user._id] = user;
        });
        return await User.find({});
    } catch (e) {
        logEvents.customEmitter.emit('error', e);
        return false;
    }
};

module.exports = { register, findUserByEmail, listUsers };
