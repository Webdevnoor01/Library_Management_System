const ReturnRequest = require("../../models/returnRequest")
const createError = require("http-errors")
class ReturnBookService {
    async createNewReturnRequest(payload){
        const returnRequestBook = await ReturnRequest.create(payload)
        if(!returnRequestBook){
            return {
                error:true,
                message:returnRequestBook
            }
        }

        return {
            error:false,
            data:returnRequestBook
        }
    }
    
    async findReturnRequest(query){
        try {
            console.log(query)
            const returnRequest = await ReturnRequest.find(query)
            if(returnRequest.length === 0){
                return {
                    error:true,
                    message:"Your don't send any return request for this book."
                }
            }

            return {
                error:false,
                data:returnRequest
            }
        } catch (e) {
            console.log("findReturnRequest-returnBookService: ", e)   
            throw createError(e.message)
        }
    }

    async deleteReturnBookRequest(query){
        try {
            const deleteRequest = await ReturnRequest.deleteOne(query)
            if(!deleteRequest) {
                return {
                    error:true,
                    message:deleteRequest
                }
            }

            return {
                error:false,
                data:deleteRequest
            }
        } catch (e) {
            console.log("deleteReturnRequest-service: ",e)
            throw createError(e.message)
        }
    }
}

module.exports = new ReturnBookService()