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
    console.log('Received event:', JSON.stringify(event, null, 2))

    const { email, password } = JSON.parse(event.body)

    console.log('Parsed payload:', { email, password })

    const db = await connectToDatabase()
    const collection = db.collection('users')

    console.log('Connected to database.')

    const user = await collection.findOne({ email })
    if (!user) {
      console.log('User not found.')
      return errorResponse('Invalid email or password')
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      console.log('Invalid password.')
      return errorResponse('Invalid email or password')
    }

    const token = jwt.sign({ email: user.email }, jwtSecret, {
      expiresIn: '1h'
    })

    console.log('Login successful.')

    return successResponse({ token, _id: user._id })
  } catch (error) {
    console.error('Error during login:', error)
    return errorResponse('Internal Server Error')
  }
}
