const { connectToDatabase } = require('../../src/utils/db-connection');
const { successResponse, errorResponse } = require('../../src/utils/response-helpers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../src/config');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { username, password } = JSON.parse(event.body);

    const db = await connectToDatabase();
    const collection = db.collection('users');

    const user = await collection.findOne({ username });
    if (!user) {
      return errorResponse('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse('Invalid username or password');
    }

    const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });

    return successResponse({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return errorResponse('Internal Server Error');
  }
};
