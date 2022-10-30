const { check, validationResult } = require("express-validator");

const LibraryAdmin = require("../../models/lAdmin")

class LibraryAdminValidator {
  validate(req, res, next) {
    const libraryAdminValidation = [
      check("name")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 3, max: 30 })
        .withMessage("Please type valid name"),

      check("userId")
        .isString()
        .withMessage("userId must be a string")
        .isLength({ min: 4, max: 20 })
        .withMessage("please type valid userId"),

      check("email")
        .isEmail()
        .withMessage("Please eneter valid email")
        .custom(async (value) => {
          try {
            const email = await LibraryAdmin.findOne({ email: value });
            if (email) {
              throw new Error("Email already in use");

              //   throw new Error("Email already in use");
            }
          } catch (e) {
            throw new Error(e.message);
          }
          return true;
        }),

      check("phone")
        .isLength({ min: 10, max: 12 })
        .withMessage("Pleasy type valid phone number")
        .isMobilePhone("en-IN")
        .withMessage("Your mobile number must be an Indian number")
        .custom(async (value) => {
          try {
            const phone = await LibraryAdmin.findOne({ phone: value });
            if (phone) {
              throw new Error("Phone already in use");
            }
          } catch (e) {
            throw new Error(e.message);
          }
          return true;
        }),

      check("password")
        .isStrongPassword()
        .withMessage(
          "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
        ),
    ];

    return libraryAdminValidation
  }


  
  validationHnadler(req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      res.status(500).json({
        errors: mappedErrors,
      });
    }
  }
}


module.exports = new LibraryAdminValidator()