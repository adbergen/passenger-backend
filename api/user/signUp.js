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
    const { username, firstName, lastName, email, password } = JSON.parse(
      event.body
    )

    const db = await connectToDatabase()
    const collection = db.collection('users')

    const existingUser = await collection.findOne({ email })
    if (existingUser) {
      return errorResponse('Email already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const result = await collection.insertOne({
      username,
      firstName,
      lastName,
      email,
      passwordHash
    })

    const newUser = await collection.findOne({ _id: result.insertedId })

    const token = jwt.sign({ email: newUser.email }, jwtSecret, {
      expiresIn: '1h'
    })

    return successResponse({ token, userId: newUser._id })
  } catch (error) {
    console.error('Error creating user:', error)
    return errorResponse('Internal Server Error')
  }
}
