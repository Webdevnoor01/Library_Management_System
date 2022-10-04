const jwt = require("jsonwebtoken")
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

    async findRefreshToken(model, userId, refreshToken) {
        const quary = { token: refreshToken, userId: userId }
        console.log("query " + JSON.parse(JSON.stringify(quary)))

        return await model.findOne({ token: refreshToken, userId: userId })

    }

    async updateRefreshToken(model, userId, refreshToken) {
        return await model.updateOne({ userId: userId }, { token: refreshToken })
    }

    async removeRefreshToken(model, refreshToken) {
        return await model.deleteOne({ token: refreshToken })
    }


}

module.exports = new TokenService()