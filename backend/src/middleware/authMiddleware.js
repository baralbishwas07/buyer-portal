const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Read access token from httpOnly cookie
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

module.exports = authenticate;
