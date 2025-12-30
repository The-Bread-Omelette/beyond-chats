import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

let mongo;

export async function setupDB(){
  mongo=await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
}

export async function teardownDB(){
  await mongoose.disconnect();
  await mongo.stop();
}
