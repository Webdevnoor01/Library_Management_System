const Fine = require("../../models/fine")
const createError = require("http-errors")

class FineService {
    async createFine(payload){
        try {
            const fine = await Fine.create(payload)
            if(!fine){
                return {
                    error:true,
                    message:fine
                }
            }
            
            return {
                true:false,
                data:fine
            }
        } catch (e) {
            console.log("fine-service: ", e)
            throw createError(e.message)
        }
    }

    async findFineByBookId(query){
        try {
            const fine = await Fine.findOne(query)
            console.log(fine)
            if(!fine){
                return {
                    error:true, 
                    message:"You don't have any fine"
                }
            }
            return {
                error:false,
                data:fine
            }
        } catch (e) {
            console.log(e)
            throw createError(e.message)   
        }
    }

    async updateFineAmount(query, payload){
        try {
            const fine = await Fine.updateOne(query, payload)
            if(!fine){
                return {
                    error:true,
                    message:fine
                }
            }
            return {
                error:false,
                data: fine
            }
        } catch (e) {
            console.log("updateFine-service: ", e)
            throw createError(e.message)
        }
    }

    async deleteFine(query){
        try {
            const fine = await Fine.deleteOne(query)
            if(!fine){
                return {
                    error:true,
                    message:fine
                }
            }
            return {
                error:false,
                data:fine
            }
        } catch (e) {
            console.log("deleteFine-service: ", e)
            throw createError(e.message)
        }
    }
}

module.exports = new FineService()