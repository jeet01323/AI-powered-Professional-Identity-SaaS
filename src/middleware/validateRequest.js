const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const zodErrors = error.errors || error.issues || [];
    const formattedErrors = Array.isArray(zodErrors) ? zodErrors.map((err) => ({
      field: err.path ? err.path.join('.') : 'unknown',
      message: err.message,
    })) : [{ message: error.message || 'Validation failed' }];
    
    return res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
};

module.exports = validateRequest;
