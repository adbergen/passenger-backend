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
    const result = await collection.insertOne({ username, passwordHash });

    const newUser = await collection.findOne({ _id: result.insertedId });

    return successResponse(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return errorResponse('Internal Server Error');
  }
};
