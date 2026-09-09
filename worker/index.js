require('dotenv').config();

const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const mongoose = require('mongoose');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info', name: 'worker' });

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_manager';
const QUEUE_NAME = process.env.TASK_QUEUE_NAME || 'task-events';
const CONCURRENCY = Number(process.env.WORKER_CONCURRENCY || 5);

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// ioredis crashes the process on an unhandled 'error' event; log and let it retry.
connection.on('error', (err) => logger.error({ err: err.message }, 'redis error'));
connection.on('connect', () => logger.info('worker connected to redis'));

const handlers = {
  'task.created': async (data) => {
    logger.info({ taskId: data.taskId }, 'task created — send notification');
  },
  'task.updated': async (data) => {
    logger.info({ taskId: data.taskId }, 'task updated — refresh projections');
  },
  'task.deleted': async (data) => {
    logger.info({ taskId: data.taskId }, 'task deleted — clean up attachments');
  },
};

async function main() {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  logger.info('worker connected to mongodb');

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const handler = handlers[job.name];
      if (!handler) {
        logger.warn({ name: job.name }, 'no handler for job — skipping');
        return;
      }
      await handler(job.data, job);
    },
    { connection, concurrency: CONCURRENCY }
  );

  worker.on('completed', (job) => logger.debug({ id: job.id, name: job.name }, 'job completed'));
  worker.on('failed', (job, err) =>
    logger.error({ id: job?.id, name: job?.name, err }, 'job failed')
  );

  logger.info({ queue: QUEUE_NAME, concurrency: CONCURRENCY }, 'worker started');

  const shutdown = async (signal) => {
    logger.info({ signal }, 'worker shutting down');
    await worker.close();
    await Promise.allSettled([mongoose.connection.close(), connection.quit()]);
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error({ err }, 'worker failed to start');
  process.exit(1);
});
