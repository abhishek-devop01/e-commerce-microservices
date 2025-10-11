const { body, validationResult } = require("express-validator");

const respondWithValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerUservalidations = [
  body("username")
    .isString()
    .withMessage("username must be a string")
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullName.firstName")
    .isString()
    .withMessage("First name must be a string")
    .notEmpty()
    .withMessage("First name is required"),
  body("fullName.lastName")
    .isString()
    .withMessage("Last name must be a string")
    .notEmpty()
    .withMessage("Last name is required"),

  respondWithValidationErrors,
];

const loginUserValidation = [
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string"),
  body("password")
    .isLength({
      min: 6,
    })
    .notEmpty()
    .withMessage("Password must be atleast 6 characters long"),

  (req,res,next)=>{
    if (!req.body.email && !req.body.username) {
      console.log(req.body.email)
      return res.status(400).json({ message: "Either email or username is required" });
    }
    respondWithValidationErrors(req, res, next);
  }
  
];

module.exports = {
  registerUservalidations,
  loginUserValidation,
};
