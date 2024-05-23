const { connectToDatabase } = require('../../src/utils/db-connection');
const { successResponse, errorResponse } = require('../../src/utils/response-helpers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    const db = await connectToDatabase(process.env.MONGODB_URI);
    const collection = db.collection('users');

    const user = await collection.findOne({ username });
    if (!user) {
      return res.status(401).json(errorResponse('Invalid username or password'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('Invalid username or password'));
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json(successResponse({ token }));
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json(errorResponse('Internal Server Error'));
  }
};
