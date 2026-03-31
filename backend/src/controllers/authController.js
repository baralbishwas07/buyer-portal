const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma');

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

// Cookie options for access token (short-lived)
const accessCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
};

// Cookie options for refresh token (long-lived)
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

// Generate access token (short-lived)
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
}

// Generate refresh token (long-lived)
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
}

// Set both tokens as httpOnly cookies
function setTokenCookies(res, user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie('accessToken', accessToken, accessCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'buyer',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Set cookies
    setTokenCookies(res, user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: { user },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong during registration.',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Generic error to prevent user enumeration
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Set cookies
    setTokenCookies(res, user);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong during login.',
    });
  }
};

// Refresh access token using refresh token cookie
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided.',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Fetch latest user data from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Issue new access token only
    const accessToken = generateAccessToken(user);
    res.cookie('accessToken', accessToken, accessCookieOptions);

    res.json({
      success: true,
      message: 'Token refreshed.',
      data: { user },
    });
  } catch (error) {
    // Clear invalid cookies
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token. Please login again.',
    });
  }
};

// Get current user from access token
const me = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    res.json({
      success: true,
      data: {
        user: { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role },
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

// Logout: clear both cookies
const logout = (req, res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });

  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = { register, login, refresh, me, logout };
