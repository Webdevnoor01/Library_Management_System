const { check, validationResult } = require("express-validator")
const fs = require('fs')

class BookValidator {
    validate() {
        const bookValidation = [
            check("bookName")
                .isString()
                .isLength({ min: 5, max: 50 })
                .withMessage("Book Name must be a string within 50 charecters."),

            check("authorName")
                .isString()
                .isLength({ min: 5, max: 60 })
                .withMessage("Author name must be a string within 60 charecters."),

            check("bookEdition")
                .isArray()
                .withMessage("Book edition must be an  array."),

            check("bookQuantity")
                .isInt()
                .withMessage("Book quantity must be a number")
                .isLength({ min: 1 }),

            check("isbn")
                .isString()
                .isLength({ min: 1, max: 30 })
                .withMessage(" Please type valid ISBN no within 30 charecters."),

            check("almirahNo")
                .isNumeric()
                .isLength()
                .withMessage("Almirah no must be a number"),
            check("category")
            .isString()
            .isLength({min:2})
            .withMessage("Category must be a string")

           


        ]

        return bookValidation
    }

    validationHandler(req, res, next) {
        try {
            const error = validationResult(req)
            const mappedError = error.mapped()
            if (Object.keys(mappedError).length === 0) {
                next()
            }
            else {
                const path = req.files[0].path
                fs.unlink(path, (err) =>{
                    if(err){
                        console.log("error to remove file")
                    }{
                        console.log("File remove successfully")
                    }
                })

                res.status(400).json({
                    errors: mappedError
                })
            }

        } catch (e) {
            console.log(e)
            res.status(400).json({
                errors: {
                    imageUpload: {
                        msg: e.message
                    }
                }
            })
        }

    }
}

module.exports = new BookValidator()