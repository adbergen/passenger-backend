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
    const { username, password } = JSON.parse(event.body)

    const db = await connectToDatabase()
    const collection = db.collection('users')

    const existingUser = await collection.findOne({ username })
    if (existingUser) {
      return errorResponse('Username already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const result = await collection.insertOne({ username, passwordHash })

    const newUser = await collection.findOne({ _id: result.insertedId })

    // Automatically log in the user after signup
    const token = jwt.sign({ username: newUser.username }, jwtSecret, {
      expiresIn: '1h'
    })

    return successResponse({ user: newUser, token })
  } catch (error) {
    console.error('Error creating user:', error)
    return errorResponse('Internal Server Error')
  }
}
