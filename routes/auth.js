const express = require('express');

const router = express.Router();
router.use(express.json());

const User = require('../models/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/verifyToken');

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);

        const user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(500).send("User already exists.");
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({id: newUser._id}, process.env.SECRET, {
            expiresIn: 86400
        });

        res.status(200).send({auth: true, token: token});
    } 
    catch(err) {
        res.status(500).send(err.message);
    }
});

router.get('/me', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId, {password: 0});
        if (!user) return res.status(404).send("User not found.");
        res.status(200).send(user);
    }
    catch(err) {
        res.status(500).send(err.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(404).send("User not found.");

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({auth: false, token: null});

        const token = jwt.sign({id: user._id}, process.env.SECRET, {
            expiresIn: 86400
        });

        res.status(200).send({auth: true, token: token});
    }
    catch(err) {
        res.send(500).status(err.message);
    }
});

module.exports = router;