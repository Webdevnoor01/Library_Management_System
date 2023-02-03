const tokenService = require("../../service/token/tokenService")
const customError = require("../../util/throwError")
class Authenticate {

    async authenticate(req, res, next) {
        try {
            const { accessToken } = req.cookies
            if (!accessToken) throw customError("Authentication failed", 401)

            const userData = await tokenService.verifyAccessToken(accessToken)
            if (!userData) throw customError("Authentication failed", 401)
            req.user = userData
            next()

        } catch (e) {
            console.log(e)
            res.status(e.message.status).json({
                errors: {
                    authentication: {
                        msg: e.message.txt
                    }
                }
            })
        }


    }
}

module.exports = new Authenticate()