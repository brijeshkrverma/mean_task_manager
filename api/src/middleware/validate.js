const { ApiError } = require('./error');

/**
 * Validates `req[source]` against a Zod schema and replaces it with the parsed
 * value, so downstream handlers get coerced/defaulted data.
 */
function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      return next(new ApiError(400, 'Validation failed', details));
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = { validate };
