const { check, body, validationResult } = require("express-validator");
const Student = require("../../../models/student");
const Teacher = require("../../../models/teacher");

class StudentValidator {
  validate() {
    const studentValidaton = [
      check("name")
        .isString()
        .withMessage("User name must be a string")
        .isLength({ min: 4, max: 30 })
        .withMessage("Minimum length of your name is 4 letter")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Name must not contain anything other than alphabet"),

      check("phone")
        .isLength({ min: 10, max: 12 })
        .withMessage("Pleasy type valid phone number")
        .isMobilePhone("en-IN")
        .withMessage("Your mobile number must be an Indian number")
        .custom(async (value) => {
          try {
            const phone = await Student.findOne({ phone: value });
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

      check("userRole")
        .isString()
        .withMessage("User role must be an string")
        .isLength({ min: 5, max: 50 })
        .withMessage("minimum 5 character required"),

      check("libraryId")
        .isString()
        .withMessage("libraryId must be a string")
        .isLength({ min: 6 })
        .withMessage('libraryId mut be at least 6 characters like "cst_09"'),



    ];
    

    return studentValidaton
  }

  validateTeacher(){
    const teacherValidaton = [
      check("teacherName")
        .isString()
        .withMessage("User name must be a string")
        .isLength({ min: 4, max: 30 })
        .withMessage("Minimum length of your name is 4 letter")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Name must not contain anything other than alphabet"),

      check("email")
        .isEmail()
        .withMessage("Please eneter valid email")
        .custom(async (value) => {
          try {
            const email = await Teacher.findOne({ email: value });
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
            const phone = await Student.findOne({ phone: value });
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


      check("current_year")
        .isLength({ max: 4 })
        .withMessage("please type valid year")
        .isNumeric()
        .withMessage("current_year must be a number"),

      check("userRole")
        .isString()
        .withMessage("User role must be an string")
        .isLength({ min: 5, max: 50 })
        .withMessage("minimum 5 character required"),

      check("address[village]")
        .isString()
        .withMessage("Village must be a string")
        .isLength({ max: 30 })
        .withMessage("please type valid address")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Village must not contain anything other than alphabet"),

      check("address[po]")
        .isString()
        .withMessage("Post Office must be a string")
        .isLength({ max: 30 })
        .withMessage("please type valid post office")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage(
          "Post Office must not contain anything other than alphabet"
        ),

      check("address[ps]")
        .isString()
        .withMessage("Police Station must be a string")
        .isLength({ max: 30 })
        .withMessage("please type valid police station")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage(
          "Police Station must not contain anything other than alphabet"
        ),

      check("address[district]")
        .isString()
        .withMessage("District must be a string")
        .isLength({ max: 30 })
        .withMessage("please type valid distrint")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("District must not contain anything other than alphabet"),

      check("address[state]")
        .isString()
        .withMessage("State must be a string")
        .isLength({ max: 30 })
        .withMessage("please type valid state")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("State must not contain anything other than alphabet"),

      check("libraryId")
        .isString()
        .withMessage("libraryId must be a string")
        .isLength({ min: 6 })
        .withMessage('libraryId mut be at least 6 characters like "cst_09"'),
      check("roles[HOD][depertment]")
        .isString()
        .isLength({ min: 2, max: "30" })
        .withMessage("depertment must be a string within 30 characters "),

      check("roles[HOD][isHOD]")
        .isBoolean("isHOD role must be a boolean like true/false"),

      check("roles[admissionCell]")
        .isBoolean("admissionCell role must be a boolean like true/false"),

      check("roles[examCell]")
        .isBoolean("examCell role must be a boolean like true/false")
    ];

    return teacherValidaton
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

module.exports = new StudentValidator();
