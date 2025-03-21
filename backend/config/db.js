const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// const uri = process.env.LOCAL_MONGODB_URI || process.env.MONGODB_URI;
const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = client;