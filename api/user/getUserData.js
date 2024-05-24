const { connectToDatabase } = require('../../src/utils/db-connection')
const {
  successResponse,
  errorResponse
} = require('../../src/utils/response-helpers')
const { ObjectId } = require('mongodb')

exports.handler = async (event) => {
  try {
    const { _id } = JSON.parse(event.body)

    // Input validation
    if (!_id || !ObjectId.isValid(_id)) {
      return errorResponse('Invalid user ID')
    }

    const db = await connectToDatabase()
    const collection = db.collection('users')

    console.time('Find User')
    const user = await collection.findOne({ _id: _id })
    console.timeEnd('Find User')

    if (!user) {
      return errorResponse('User not found')
    }

    return successResponse(user)
  } catch (error) {
    console.error('Error fetching user data:', error)
    return errorResponse('Internal Server Error')
  }
}
