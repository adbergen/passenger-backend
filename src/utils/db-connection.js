const { MongoClient } = require('mongodb')
const { mongodbUri, dbName } = require('../config')

let cachedDb = null

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb
  }

  try {
    const client = new MongoClient(mongodbUri, {
      maxIdleTimeMS: 60000,
      maxPoolSize: 10
    })

    await client.connect()
    cachedDb = client.db(dbName)
    console.log('Connected to database.')
    return cachedDb
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw new Error('Database connection failed')
  }
}

module.exports = { connectToDatabase }
