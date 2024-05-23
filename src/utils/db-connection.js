const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri);

  await client.connect();
  cachedDb = client.db();
  return cachedDb;
}

module.exports = { connectToDatabase };
