const createError = require("http-errors")

class ProfileService {

    async update(model, payload,userId){
        try {
            const profile = await model.findByIdAndUpdate(userId, payload)
            if(!profile) {
                return {
                    error:true,
                    message:profile
                }
            }
            return {
                error:false,
                data:profile
            }
        } catch (e) {
            throw createError(e.message)
        }
    }
}

module.exports = new ProfileService()