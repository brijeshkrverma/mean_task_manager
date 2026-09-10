process.env.JWT_SECRET = 'test-secret';

const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { signToken, requireAuth, requireRole, JWT_SECRET } = require('../src/middleware/auth');

// `next` collects what the middleware passed along so assertions stay simple.
function capture() {
  const calls = [];
  const next = (err) => calls.push(err);
  return { calls, next };
}

test('signToken embeds the user id and role', () => {
  const token = signToken({ _id: 'abc123', role: 'admin' });
  const payload = jwt.verify(token, JWT_SECRET);

  assert.equal(payload.sub, 'abc123');
  assert.equal(payload.role, 'admin');
});

test('requireAuth accepts a valid bearer token', () => {
  const token = signToken({ _id: 'u1', role: 'user' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const { calls, next } = capture();

  requireAuth(req, {}, next);

  assert.deepEqual(calls, [undefined]);
  assert.deepEqual(req.user, { id: 'u1', role: 'user' });
});

test('requireAuth rejects a missing header', () => {
  const { calls, next } = capture();

  requireAuth({ headers: {} }, {}, next);

  assert.equal(calls[0].status, 401);
  assert.match(calls[0].message, /Missing bearer token/);
});

test('requireAuth rejects a non-Bearer scheme', () => {
  const { calls, next } = capture();

  requireAuth({ headers: { authorization: 'Basic abc' } }, {}, next);

  assert.equal(calls[0].status, 401);
});

test('requireAuth rejects a token signed with the wrong secret', () => {
  const forged = jwt.sign({ sub: 'u1', role: 'admin' }, 'not-the-secret');
  const { calls, next } = capture();

  requireAuth({ headers: { authorization: `Bearer ${forged}` } }, {}, next);

  assert.equal(calls[0].status, 401);
  assert.match(calls[0].message, /Invalid or expired token/);
});

test('requireAuth rejects an expired token', () => {
  const expired = jwt.sign({ sub: 'u1', role: 'user' }, JWT_SECRET, { expiresIn: -10 });
  const { calls, next } = capture();

  requireAuth({ headers: { authorization: `Bearer ${expired}` } }, {}, next);

  assert.equal(calls[0].status, 401);
});

test('requireRole allows a listed role', () => {
  const { calls, next } = capture();

  requireRole('admin', 'owner')({ user: { role: 'admin' } }, {}, next);

  assert.deepEqual(calls, [undefined]);
});

test('requireRole blocks an unlisted role', () => {
  const { calls, next } = capture();

  requireRole('admin')({ user: { role: 'user' } }, {}, next);

  assert.equal(calls[0].status, 403);
});

test('requireRole blocks an unauthenticated request', () => {
  const { calls, next } = capture();

  requireRole('user')({}, {}, next);

  assert.equal(calls[0].status, 403);
});
