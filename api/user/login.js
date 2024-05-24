const { connectToDatabase } = require('../../src/utils/db-connection')
const {
  successResponse,
  errorResponse
} = require('../../src/utils/response-helpers')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../src/config')

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { email, password } = JSON.parse(event.body)

    const db = await connectToDatabase()
    const collection = db.collection('users')

    const user = await collection.findOne({ email })
    if (!user) {
      return errorResponse('Invalid email or password')
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password')
    }

    const token = jwt.sign({ email: user.email }, jwtSecret, {
      expiresIn: '1h'
    })

    return successResponse({ token, userId: user._id });
  } catch (error) {
    console.error('Error during login:', error)
    return errorResponse('Internal Server Error')
  }
}
