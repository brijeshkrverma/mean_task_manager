const test = require('node:test');
const assert = require('node:assert/strict');

const { ApiError, notFound, errorHandler } = require('../src/middleware/error');

// Minimal Express-style response recorder.
function mockRes() {
  const res = {
    statusCode: undefined,
    body: undefined,
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(payload) {
      res.body = payload;
      return res;
    },
  };
  return res;
}

test('notFound reports the unmatched method and path', () => {
  const res = mockRes();

  notFound({ method: 'GET', originalUrl: '/nope' }, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.error, 'not_found');
  assert.match(res.body.message, /GET \/nope/);
});

test('errorHandler passes through a client error message and details', () => {
  const res = mockRes();
  const err = new ApiError(400, 'Validation failed', [{ path: 'title' }]);

  errorHandler(err, {}, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error, 'request_error');
  assert.equal(res.body.message, 'Validation failed');
  assert.deepEqual(res.body.details, [{ path: 'title' }]);
});

test('errorHandler hides internal error messages', () => {
  const res = mockRes();

  errorHandler(new Error('mongo connection string leaked'), {}, res, () => {});

  assert.equal(res.statusCode, 500);
  assert.equal(res.body.error, 'internal_error');
  assert.equal(res.body.message, 'Internal server error');
});

test('errorHandler maps a mongoose ValidationError to 400', () => {
  const res = mockRes();
  const err = new Error('Task validation failed');
  err.name = 'ValidationError';

  errorHandler(err, {}, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, 'Task validation failed');
});
