const { connectToDatabase } = require('../../src/utils/db-connection');
const { successResponse, errorResponse } = require('../../src/utils/response-helpers');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    const db = await connectToDatabase(process.env.MONGODB_URI);
    const collection = db.collection('users');

    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return errorResponse('Username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await collection.insertOne({ username, passwordHash });

    return successResponse(newUser.ops[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    return errorResponse('Internal Server Error');
  }
};
