const { check } = require("express-validator");

exports.companyRegValidation = [
  check("companyId", "companyId must not be empty").isLength({ min: 1 }),
  check("companyName", "companyName must not be empty").isLength({ min: 1 }),
  check("companyCity", "companyCity must not be empty").isLength({ min: 1 }),
];
exports.companyUpdateValidation = [
  check("id", "companyId must not be empty").isLength({ min: 1 }),
  check("companyName", "companyName must not be empty").isLength({ min: 1 }),
  check("companyCity", "companyCity must not be empty").isLength({ min: 1 }),
];

exports.companyNameValidation = [
  check("companyId", "companyId must not be empty").isLength({ min: 1 }),
  check("companyName", "companyName must not be empty").isLength({ min: 1 }),
];

exports.companyDelValidation = [
  check("id", "companyId must not be empty").isLength({ min: 1 }),
];
