const { connectToDatabase } = require('../../src/utils/db-connection')
const {
  successResponse,
  errorResponse
} = require('../../src/utils/response-helpers')

exports.handler = async (event) => {
  try {
    const db = await connectToDatabase(process.env.MONGODB_URI)
    const collection = db.collection('users')
    const userId = event.requestContext.authorizer.claims.sub // Assuming you are using Cognito
    const user = await collection.findOne({ userId })

    return successResponse(user)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return errorResponse('Internal Server Error')
  }
}
