require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');

const { logger } = require('./lib/logger');
const { connectDb, disconnectDb } = require('./lib/db');
const { closeQueue } = require('./lib/queue');
const { notFound, errorHandler } = require('./middleware/error');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const healthRoutes = require('./routes/health.routes');

const PORT = Number(process.env.PORT || 3000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',') }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));

  app.use('/health', healthRoutes);

  app.use(
    '/api',
    rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false })
  );
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

async function start() {
  await connectDb();

  const server = createApp().listen(PORT, () => logger.info(`api listening on :${PORT}`));

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`port ${PORT} is already in use — set PORT to something else`);
    } else {
      logger.error({ err }, 'server error');
    }
    process.exit(1);
  });

  const shutdown = async (signal) => {
    logger.info({ signal }, 'shutting down');
    server.close();
    await Promise.allSettled([disconnectDb(), closeQueue()]);
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

if (require.main === module) {
  start().catch((err) => {
    logger.error({ err }, 'failed to start api');
    process.exit(1);
  });
}

module.exports = { createApp };
