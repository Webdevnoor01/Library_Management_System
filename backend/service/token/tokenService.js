const jwt = require("jsonwebtoken")
const StudentRefreshModel = require("../../models/tokens/studentRefreshToken")
const accessTokenSecret = process.env.JWT_ACCES_TOKEN_SECRET
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET


class TokenService {


    async generateTokens(payload) {
        try {
            const accessToken = await jwt.sign(payload, accessTokenSecret, {
                expiresIn: "1m"
            })

            const refreshToekn = await jwt.sign(payload, refreshTokenSecret, {
                expiresIn:"1y"
            })
            return { accessToken, refreshToekn }
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async storeRefreshToken(model, token) {
        try {
            const refreshToken = await model.create(token)
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async verifyAccessToken(accessToken) {
        return await jwt.verify(accessToken, accessTokenSecret)
    }

    async verifyRefreshToken(refreshToken) {
        return await jwt.verify(refreshToken, refreshTokenSecret)
    }

    async findRefreshToken(model, userId, refreshToken) {

        return await model.findOne({ userId: userId, token: refreshToken })

    }

    async updateRefreshToken(model, userId, refreshToken) {
        return await model.updateOne({userId:userId},{token:refreshToken})
    }

    async removeRefreshToken(model,refreshToken){
        return await model.deleteOne({token:refreshToken})
    }


}

module.exports = new TokenService()