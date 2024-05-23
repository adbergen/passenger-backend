const config = {
  mongodbUri: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET
}

module.exports = config
