const test = require('node:test');
const assert = require('node:assert/strict');
const { z } = require('zod');

const { validate } = require('../src/middleware/validate');

const schema = z.object({
  title: z.string().min(1),
  done: z.boolean().default(false),
});

test('validate replaces the source with the parsed value', () => {
  const req = { body: { title: 'write tests' } };
  let passed;

  validate(schema)(req, {}, (err) => {
    passed = err;
  });

  assert.equal(passed, undefined);
  // Zod defaults are applied, so handlers never see an undefined `done`.
  assert.deepEqual(req.body, { title: 'write tests', done: false });
});

test('validate reports every failing field as a 400', () => {
  const req = { body: { title: '', done: 'nope' } };
  let err;

  validate(schema)(req, {}, (e) => {
    err = e;
  });

  assert.equal(err.status, 400);
  assert.equal(err.message, 'Validation failed');
  assert.deepEqual(err.details.map((d) => d.path).sort(), ['done', 'title']);
});

test('validate can target a source other than the body', () => {
  const req = { query: { title: 'from query' } };
  let err;

  validate(schema, 'query')(req, {}, (e) => {
    err = e;
  });

  assert.equal(err, undefined);
  assert.equal(req.query.title, 'from query');
});
