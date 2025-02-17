const { connectToDatabase } = require('../../src/utils/db-connection')
const {
  successResponse,
  errorResponse
} = require('../../src/utils/response-helpers')
const { ObjectId } = require('mongodb')

exports.handler = async (event) => {
  try {
    console.log('Event', event)
    const { id } = event.pathParameters

    // Input validation
    if (!id || !ObjectId.isValid(id)) {
      return errorResponse('Invalid user ID')
    }

    const db = await connectToDatabase()
    const collection = db.collection('users')

    const objectId = ObjectId.createFromHexString(id)

    const user = await collection.findOne({ _id: objectId })

    if (!user) {
      return errorResponse('User not found')
    }

    return successResponse(user)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return errorResponse('Internal Server Error')
  }
}
