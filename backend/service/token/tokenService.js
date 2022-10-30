const jwt = require("jsonwebtoken")
const RefreshToken = require("../../models/tokens/refreshToken")
const accessTokenSecret = process.env.JWT_ACCES_TOKEN_SECRET
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET


class TokenService {


    async generateTokens(payload) {
        try {
            const accessToken = await jwt.sign(payload, accessTokenSecret, {
                expiresIn:"30d"
            })

            const refreshToken = await jwt.sign(payload, refreshTokenSecret, {
                expiresIn: '365d'
            })
            return { accessToken, refreshToken }
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async storeRefreshToken(model, payload) {

        try {

            const refreshToken = await model.create(payload)

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

    async findRefreshToken(userId, refreshToken) {
        const query = { token: refreshToken, userId: userId }
        console.log("query " + query)

        return await RefreshToken.findOne({userId: userId })

    }

    async updateRefreshToken(userId, refreshToken) {
        return await RefreshToken.updateOne({ userId: userId }, { token: refreshToken })
    }

    async removeRefreshToken(refreshToken) {
        return await RefreshToken.deleteOne({ token: refreshToken })
    }


}

module.exports = new TokenService()