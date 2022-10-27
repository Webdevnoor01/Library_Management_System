const userService = require("../../service/userService/userService")
const findModel = require("../../util/findModel")
const createError = require("http-errors")

class StudentController {

   async findRequestedBook(req, res){
    const {userId} = req.params

        try {
            const requestedBooks = await userService.findRequestedBook(findModel(req.userRole),userId)
            if(requestedBooks.error){
                throw createError(requestedBooks.message)
            }

            res.status(200).json({
                message:"Ok",
                requestedBooks:requestedBooks.data
            })
        } catch (e) {
            res.status(500).json({
                errors:{
                    student:{
                        msg:e.message
                    }
                }
            })
        }
    }
}

module.exports = new StudentController()