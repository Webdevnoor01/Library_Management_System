
const tokenService = require("../../service/token/tokenService")
class Authenticate{

    async authenticate(req, res, next){
        try {
            const {accessToken} = req.cookies
            if(!accessToken){
                throw new Error()
            }

            const userData = await tokenService.verifyAccessToken(accessToken)
            if(!userData){
                throw new Error()
            }
            req.user = userData
            next()
            
        } catch (error) {  
            console.log(error) 
            res.status(401).json({
                error:"Authentication failed"
            })
        }


    }
}

module.exports = new Authenticate()