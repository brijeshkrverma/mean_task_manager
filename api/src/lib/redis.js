const Redis = require('ioredis');
const { logger } = require('./logger');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// BullMQ requires maxRetriesPerRequest: null on its connections.
const connectionOptions = { maxRetriesPerRequest: null, enableReadyCheck: false };

const redis = new Redis(REDIS_URL, connectionOptions);

redis.on('connect', () => logger.info('redis connected'));
redis.on('error', (err) => logger.error({ err }, 'redis error'));

function createConnection() {
  return new Redis(REDIS_URL, connectionOptions);
}

async function isRedisReady() {
  try {
    return (await redis.ping()) === 'PONG';
  } catch {
    return false;
  }
}

module.exports = { redis, createConnection, isRedisReady, REDIS_URL };
