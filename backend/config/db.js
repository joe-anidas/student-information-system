import { MongoClient, ServerApiVersion } from 'mongodb';
import { MONGO_URI } from './env.js';

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export default client;