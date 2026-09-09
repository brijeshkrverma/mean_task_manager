const { logger } = require('../lib/logger');

class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function notFound(req, res) {
  res.status(404).json({ error: 'not_found', message: `No route for ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity.
function errorHandler(err, req, res, _next) {
  const status = err.status || (err.name === 'ValidationError' ? 400 : 500);

  if (status >= 500) {
    logger.error({ err }, 'unhandled error');
  }

  res.status(status).json({
    error: err.code || (status >= 500 ? 'internal_error' : 'request_error'),
    message: status >= 500 ? 'Internal server error' : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
}

module.exports = { ApiError, notFound, errorHandler };
