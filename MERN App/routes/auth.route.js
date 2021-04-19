const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signin', [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Invalid password').isLength({ min: 6 })
    ],
    async(req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data'
                })
            }

            const { email, password } = req.body;
            const isUsed = await User.findOne({ email })
            if (isUsed) {
                return res.status(300).json({ message: 'Email already occuiped.' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({
                email,
                password: hashedPassword
            });

            await user.save();

            res.status(201).json({ message: 'User created' })

        } catch (error) {
            console.log(error);
        }
    })



router.post('/login', [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Invalid password').exists()
    ],
    async(req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data'
                })
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'This email does not exist' })
            }

            const isMatch = bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Passwords mismatch' })
            }

            const jwtSecret = 'yunjkooioi78';

            const token = jwt.sign({ userId: user.Id },
                jwtSecret, { expiresIn: '1h' }
            );

            res.json({ token, userId: user.Id })

        } catch (error) {
            console.log(error);
        }
    })

module.exports = router;