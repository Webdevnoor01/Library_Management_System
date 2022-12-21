const jwt = require("jsonwebtoken")
const createError = require("http-errors")
class BookCUDauthorization {

   async authorized(req, res, next) {
       const {accessToken} = req.cookies
       const userId = req.params.userId || req.query.userId || req.user._id
        try {
            const user = await jwt.verify(accessToken, process.env.JWT_ACCES_TOKEN_SECRET)
            console.log(user.userRole)
            if(user.userRole === "Student" || user.userRole === "Teacher"){
                console.log(1)
                next({
                    status:400,
                    message:"Unauthorized access "
                })
            }
            if(user._id !== userId ){
                next({
                    status:400,
                    message:"Unauthorized access "
                })            } 
                       
            req.userRole = user.userRole
            next()
        } catch (e) {
            res.status(400).json({
                errors:{
                    authorization:{
                        msg:e.message
                    }
                }
            })
        }
        
    }


}

module.exports = new BookCUDauthorization()