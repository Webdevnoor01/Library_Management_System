const { check, validationResult } = require("express-validator");

class LibraryCard {
    validator() {
        const libraryCardValidator = [
            check("userName")
            .isString()
            .withMessage("User name must be a string")
            .isLength({ min: 4, max: 30 })
            .withMessage("Minimum length of your name is 4 letter")
            .isAlpha("en-US", { ignore: " -" })
            .withMessage("Name must not contain anything other than alphabet"),

            check("depertment")
            .isLength({ min: 2 })
            .withMessage("Depertment is required")
            .isAlpha("en-US", { ignore: " -" })
            .withMessage("Name must not contain anything other than alphabet"),

            check("issueDate")
            .isString()
            .withMessage("issuDate must be a string")
            .isLength({ min: 15 })
            .withMessage('Format of issudate is "day month date year'),

            check("libraryId")
            .isString()
            .withMessage("libraryId must be a string")
            .isLength({ min: 5 })
            .withMessage('libraryId mut be at least 5 characters like "cst_09"'),

            check("bookLimit")
            .isInt()
            .withMessage("bookLimit must be a number.")
            .isLength({ max: "1" })
            .withMessage("your maximum book limit is one digit number like 1-9."),
        ];

        return libraryCardValidator;
    }

    validationHnadler(req, res, next) {
        const errors = validationResult(req);
        const mappedErrors = errors.mapped();
        console.log("mapped-errors: ", mappedErrors);
        if (Object.keys(mappedErrors).length === 0) {
            next();
        } else {
            res.status(500).json({
                errors: mappedErrors,
            });
        }
    }
}

const LibraryCardValidation = new LibraryCard();

module.exports = LibraryCardValidation;