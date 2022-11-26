const { check, validationResult } = require("express-validator")


class LibraryStaffValidator {
    validate(req, res, next){
        const libraryStaffValidation = [
            check("name")
            .isString()
            .withMessage("Name must be a string")
            .isLength({min:4, max:50})
            .withMessage("Name must be a string with minimum 4 and maximum 50 charecter"),

            check("email")
            .isEmail()
            .withMessage("Plese provide valid email"),

            check("phone")
            .isMobilePhone("en-IN")
            .withMessage("please provide valid mobile number"),

            check("password")
            .isStrongPassword()
            .withMessage("Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"),

            check("userRole")
            .isString()
            .withMessage("userRole must be a string")
            .isLength({min:4, max:10})
            .withMessage("userRole must be a string with minimum 4 and maximum 10 charecter"),
        ]

        return libraryStaffValidation;

    }

    validationHandler(req, res, next) {
        const errors = validationResult(req)
        const mappedErrors = errors.mapped()
        console.log(Object.keys(mappedErrors))
        if(Object.keys(mappedErrors).length === 0){
            next()
        }
        else{
            res.status(500).json({
                errors:mappedErrors
            })
        }
    }
}

module.exports = new LibraryStaffValidator()
