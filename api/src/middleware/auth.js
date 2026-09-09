const jwt = require('jsonwebtoken');
const { ApiError } = require('./error');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Missing bearer token'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }
    return next();
  };
}

module.exports = { signToken, requireAuth, requireRole, JWT_SECRET };
