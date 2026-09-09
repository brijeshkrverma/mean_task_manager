const express = require('express');
const { z } = require('zod');
const User = require('../models/user.model');
const { validate } = require('../middleware/validate');
const { signToken, requireAuth } = require('../middleware/auth');
const { ApiError } = require('../middleware/error');

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (await User.exists({ email })) {
      throw new ApiError(409, 'Email already registered');
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await User.hashPassword(password),
    });

    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user || !(await user.verifyPassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    res.json({ token: signToken(user), user: user.toJSON() });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
