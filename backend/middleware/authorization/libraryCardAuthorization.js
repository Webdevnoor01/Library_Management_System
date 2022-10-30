const jwt = require('jsonwebtoken')
class LibraryCardAuthorization {
    async authorizid(req, res, next){
        const {accessToken} = req.cookies

        try {
            const user = await jwt.verify(accessToken, process.env.JWT_ACCES_TOKEN_SECRET)
            if(user.userRole === "libAdmin" || user.userRole === "Assistant"){
                if(user.userRole === req.user.userRole){
                    next()
                }
            }

            next({
                status:400,
                message:"Unauthorized access"
            })
        } catch (e) {
            next({
                status:e.status,
                message:e.message
            })
        }
    }
}