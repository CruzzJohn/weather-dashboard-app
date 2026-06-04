const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER RECEIVED:", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: 'Authentication required. Please provide a valid token.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Token missing or malformed'
    });
  }

  try {
    console.log("VERIFYING WITH SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({
      message: 'Invalid authentication token'
    });
  }
};

module.exports = authMiddleware;
