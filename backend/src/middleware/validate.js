const { ValidationError } = require('../utils/apiError');

/**
 * Joi validation middleware factory.
 * @param {import('joi').ObjectSchema} schema - Joi schema to validate against.
 * @param {'body' | 'query' | 'params'} source - Request property to validate.
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message).join('. ');
      return next(new ValidationError(messages));
    }

    // Replace with sanitized values
    req[source] = value;
    next();
  };
};

module.exports = validate;
