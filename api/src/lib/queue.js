const { Queue } = require('bullmq');
const { createConnection } = require('./redis');

const TASK_QUEUE_NAME = process.env.TASK_QUEUE_NAME || 'task-events';

const taskQueue = new Queue(TASK_QUEUE_NAME, { connection: createConnection() });

const ENQUEUE_TIMEOUT_MS = Number(process.env.ENQUEUE_TIMEOUT_MS || 2000);

/**
 * Enqueue a job for the worker service. Callers treat queueing as best-effort,
 * so bound the wait: with Redis unreachable, BullMQ's `add()` keeps retrying
 * the connection instead of rejecting, which would hang the HTTP request.
 */
async function enqueue(name, payload, opts = {}) {
  const add = taskQueue.add(name, payload, {
    removeOnComplete: 100,
    removeOnFail: 500,
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    ...opts,
  });

  let timer;
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new Error(`enqueue '${name}' timed out after ${ENQUEUE_TIMEOUT_MS}ms`)),
      ENQUEUE_TIMEOUT_MS
    );
  });

  try {
    return await Promise.race([add, timeout]);
  } finally {
    clearTimeout(timer);
    // The losing `add` promise may still settle later; don't crash on it.
    add.catch(() => {});
  }
}

async function closeQueue() {
  await taskQueue.close();
}

module.exports = { taskQueue, enqueue, closeQueue, TASK_QUEUE_NAME };
