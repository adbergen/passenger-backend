const jwt = require('jsonwebtoken');

function verifyToken(event) {
  const token = event.headers.Authorization;
  if (!token) {
    throw new Error('No token provided');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { verifyToken };
