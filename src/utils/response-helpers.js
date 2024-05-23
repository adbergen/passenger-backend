function successResponse(data) {
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}

function errorResponse(error) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error:
        typeof error === 'string'
          ? error
          : error.message || 'Internal Server Error'
    })
  }
}

module.exports = { successResponse, errorResponse }
