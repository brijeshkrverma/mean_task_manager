const mongoose = require('mongoose');
const { logger } = require('./logger');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_manager';

async function connectDb() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  logger.info('mongodb connected');

  mongoose.connection.on('error', (err) => logger.error({ err }, 'mongodb error'));
  mongoose.connection.on('disconnected', () => logger.warn('mongodb disconnected'));

  return mongoose.connection;
}

async function disconnectDb() {
  await mongoose.connection.close();
}

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDb, disconnectDb, isDbReady, mongoose };
