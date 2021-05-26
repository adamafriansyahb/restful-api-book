const express = require('express');

const router = express.Router();
router.use(express.json());

const User = require('../models/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = "secre3th3hE";

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({id: user._id}, secret, {
            expiresIn: 86400
        });

        res.status(200).send({auth: true, token: token});
    } 
    catch(err) {
        res.status(500).send(err.message);
    }
});

router.get('/me', (req, res) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({auth: false, message: "No token provided."});
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({auth: false, message: "Failed to authenticate."});
        }

        res.status(200).send(decoded);
    });
});

module.exports = router;