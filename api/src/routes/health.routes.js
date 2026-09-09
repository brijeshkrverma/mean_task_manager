const express = require('express');
const { isDbReady } = require('../lib/db');
const { isRedisReady } = require('../lib/redis');

const router = express.Router();

// Liveness: the process is up. Never touches dependencies.
router.get('/live', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Readiness: safe to route traffic here.
router.get('/ready', async (_req, res) => {
  const checks = { mongo: isDbReady(), redis: await isRedisReady() };
  const healthy = Object.values(checks).every(Boolean);

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    checks,
    version: process.env.APP_VERSION || 'dev',
  });
});

module.exports = router;
