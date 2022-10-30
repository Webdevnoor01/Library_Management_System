const jwt = require("jsonwebtoken")
const createError = require("http-errors")
class RequestedBookAuthorization {

   async authorized(req, res, next) {
       const {accessToken} = req.cookies
       const userId = req.params.userId || req.query.userId
       console.log("requestedBookAuthorizaion: ", userId)
        try {
            const user = await jwt.verify(accessToken, process.env.JWT_ACCES_TOKEN_SECRET)
            console.log("authorization: ", user)
            if(user._id !== userId){
                throw createError("Unauthorized access")
            }            
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

module.exports = new RequestedBookAuthorization()