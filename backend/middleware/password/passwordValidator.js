const {check, validationResult}  = require("express-validator")
const createError = require("http-errors")

class PasswordValidation {
    validate(_req, _res){
        const passwordValidation  =[
            check("newPassword")
            .isLength({min:8})
            .withMessage("Please provide new password and conform new password")
            .isStrongPassword()
            .withMessage(  "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
            )
        ]
        return passwordValidation
    }

    validationHandler(req, res, next) {
        try {
            
            const errors = validationResult(req)
            const mappedErrors = errors.mapped()
            if(Object.keys(mappedErrors).length === 0){
                next()
            }else{
                throw createError({
                    message:{
                        status:400,
                        txt:mappedErrors.newPassword.msg
                    }
                })
            }
        } catch (e) {
            console.log(e)
            res.status(e.message.status || 500).json({
                errors:{
                    passwordValidation:{
                        msg:e.message.txt
                    }
                }
            })
        }

    }
}

module.exports = new PasswordValidation()