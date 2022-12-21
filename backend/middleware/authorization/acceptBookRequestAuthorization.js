const jwt = require("jsonwebtoken")

class AcceptBookRequestAuthorization{
    async authorized(req, _res, next){
        const {accessToken} = req.cookies
        try {

            const libraryAdminAssistant = await jwt.verify(accessToken, process.env.JWT_ACCES_TOKEN_SECRET)
            console.log(libraryAdminAssistant)
          
            if(!((libraryAdminAssistant.userRole === "libAdmin") || (libraryAdminAssistant.userRole === "Assistant"))){
                next({
                    status:400,
                    message:"Unauthorized access "
                })
            }
                        // if(libraryAdminAssistant.userRole !== req.user.userRole){
            //     next({
            //         status:400,
            //         message:"Unauthorized access "
            //     })
            // }
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

module.exports = new AcceptBookRequestAuthorization()