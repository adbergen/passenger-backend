const { connectToDatabase } = require('../../src/utils/db-connection')
const {
  successResponse,
  errorResponse
} = require('../../src/utils/response-helpers')
const { ObjectId } = require('mongodb')

exports.handler = async (event) => {
  try {
    const { radius } = event.queryStringParameters
    const { _id } = JSON.parse(event.body)

    if (!_id || !ObjectId.isValid(_id) || !radius) {
      return errorResponse('User ID and radius are required and must be valid')
    }

    const db = await connectToDatabase()
    const usersCollection = db.collection('users')

    const currentUser = await usersCollection.findOne({
      _id: ObjectId.createFromHexString(_id)
    })
    if (!currentUser || !currentUser.location) {
      return errorResponse("Current user's location not found.")
    }

    // Convert radius to meters
    const radiusInMeters = radius * 1000

    // Find nearby users
    const nearbyUsers = await usersCollection
      .find({
        location: {
          $nearSphere: {
            $geometry: currentUser.location,
            $maxDistance: radiusInMeters
          }
        },
        _id: { $ne: ObjectId.createFromHexString(_id) } // Exclude the current user from the results
      })
      .toArray()

    return successResponse(nearbyUsers)
  } catch (error) {
    console.error('Error fetching nearby users:', error)
    return errorResponse('Internal Server Error')
  }
}
