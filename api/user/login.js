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

  const startTime = Date.now()

  try {
    console.log('Received event:', JSON.stringify(event, null, 2))

    const { email, password } = JSON.parse(event.body)

    console.log('Parsed payload:', { email, password })

    // Connect to the database
    const dbConnectStart = Date.now()
    const db = await connectToDatabase()
    const collection = db.collection('users')
    console.log(`Database connection time: ${Date.now() - dbConnectStart}ms`)

    // Fetch user with only necessary fields
    const dbQueryStart = Date.now()
    const user = await collection.findOne(
      { email },
      { projection: { passwordHash: 1, email: 1 } }
    )
    console.log(`Database query time: ${Date.now() - dbQueryStart}ms`)

    if (!user) {
      console.log('User not found.')
      return errorResponse('Invalid email or password')
    }

    console.log('User found, checking password.')

    // Use asynchronous bcrypt compare
    const bcryptStart = Date.now()
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    console.log(`Bcrypt compare time: ${Date.now() - bcryptStart}ms`)

    if (!isPasswordValid) {
      console.log('Invalid password.')
      return errorResponse('Invalid email or password')
    }

    console.log('Password is valid, generating token.')

    // Use synchronous jwt sign to avoid async overhead
    const jwtStart = Date.now()
    const token = jwt.sign({ email: user.email }, jwtSecret, {
      expiresIn: '1h'
    })
    console.log(`JWT sign time: ${Date.now() - jwtStart}ms`)

    console.log('Login successful, returning response.')

    console.log(`Total function execution time: ${Date.now() - startTime}ms`)

    return successResponse({ token, _id: user._id })
  } catch (error) {
    console.error('Error during login:', error)
    return errorResponse('Internal Server Error')
  }
}
