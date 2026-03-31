const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required');
  if (!email || !email.trim()) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) errors.push('Invalid email format');
  if (password && password.length < 6) errors.push('Password must be at least 6 characters');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  next();
};

module.exports = { validateRegistration, validateLogin };
