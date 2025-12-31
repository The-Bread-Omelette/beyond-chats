import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export default async function connectDB(){
  try{
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    logger.info('MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error', { error: err.message });
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
  
  }catch(error){
    logger.error('Failed to connect to MongoDB', { 
      error: error.message,
      stack: error.stack 
    });
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}