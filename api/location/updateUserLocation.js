const { connectToDatabase } = require('../../src/utils/db-connection')
const {
  successResponse,
  errorResponse
} = require('../../src/utils/response-helpers')
const { ObjectId } = require('mongodb')

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    console.log('Received event:', JSON.stringify(event, null, 2))
    const { longitude, latitude, _id } = JSON.parse(event.body)

    console.log('Parsed payload:', { longitude, latitude, _id })

    // Validate the input
    if (!longitude || !latitude || !_id) {
      console.log('Invalid input:', { longitude, latitude, _id })
      return errorResponse('Longitude, latitude, and _id are required')
    }

    if (!ObjectId.isValid(_id)) {
      console.log('Invalid user ID:', _id)
      return errorResponse('Invalid user ID')
    }

    const db = await connectToDatabase()
    const collection = db.collection('users')

    const userObjectId = ObjectId.createFromHexString(_id)
    console.log('User ObjectId:', userObjectId)

    // Perform the update operation
    const updateResult = await collection.updateOne(
      { _id: userObjectId },
      {
        $set: {
          location: { type: 'Point', coordinates: [longitude, latitude] }
        }
      }
    )

    console.log('Update result:', updateResult)

    // Check if the document was found and updated, and return a success message
    if (updateResult.matchedCount === 0) {
      console.log('No document found with the provided user ID:', userObjectId)
      return errorResponse('No document found with the provided user ID')
    }

    if (updateResult.modifiedCount === 1) {
      console.log('User location updated successfully')
      return successResponse({ message: 'User location updated successfully' })
    }

    // If matched but not modified, it means the location was the same as before
    console.log('User location was the same and not updated')
    return successResponse({
      message: 'User location was the same and not updated'
    })
  } catch (e) {
    console.error('Error updating user location:', e)
    return errorResponse('Internal Server Error')
  }
}
