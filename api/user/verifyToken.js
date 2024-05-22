const { successResponse, errorResponse } = require('../../src/utils/response-helpers');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  try {
    const token = event.headers.Authorization;
    if (!token) {
      return errorResponse('No token provided');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return successResponse(decoded);
  } catch (error) {
    console.error('Error verifying token:', error);
    return errorResponse('Invalid token');
  }
};
