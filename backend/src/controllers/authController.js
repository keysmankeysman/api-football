const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/tokenUtils');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please provide a valid email');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({
    email,
    password,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  );

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    },
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400);
    throw new Error('Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  if (user.refreshToken !== refreshToken) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken(user._id);

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: newAccessToken,
    },
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  req.user.refreshToken = null;
  await req.user.save();

  res.json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        email: req.user.email,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    },
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Please provide a valid email');
    }

    const emailExists = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: user._id },
    });

    if (emailExists) {
      res.status(400);
      throw new Error('Email is already in use');
    }

    user.email = email;
  }

  if (password) {
    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    user.password = password;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        updatedAt: user.updatedAt,
      },
    },
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
};
