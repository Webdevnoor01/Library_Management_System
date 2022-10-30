const jwt = require("jsonwebtoken")

class AdminAuthorization{
    async authorized(req, res, next){
        const {accessToken} = req.cookies
        try {

            const libraryAdmin = await jwt.verify(accessToken, process.env.JWT_ACCES_TOKEN_SECRET)
          
            if(libraryAdmin.userRole !== "libAdmin"){
                next({
                    status:400,
                    message:"Unauthorized access "
                })
            }
            
            if(libraryAdmin.userRole !== req.user.userRole){
                next({
                    status:400,
                    message:"Unauthorized access "
                })
            }
            next()
        } catch (e) {
            console.log(e)
            next({
                status:e.status || 500,
                message:e.message
            })
        }
    }
}

module.exports = new AdminAuthorization()