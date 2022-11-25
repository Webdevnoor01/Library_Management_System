const LibraryAdmin = require("../../models/lAdmin")
const IssuedBook = require("../../models/issuedBook")
const createError = require("http-errors")



class LibraryAdminService {
    async create(payload){
        try {
            const libAdmin = await LibraryAdmin.create(payload)
            if(!libAdmin){
                return {
                    error:true,
                    message:libAdmin
                }
            }
            return {
                error:false,
                data:libAdmin
            }
        } catch (e) {
            throw createError(e.message)
        }
    }

    async findByProperty(query){
        try {
            let libAdmin;
            if(query._id){
                libAdmin = await LibraryAdmin.findById(query._id)
                if(!libAdmin){
                    return {
                        error:true,
                        message:libAdmin
                    }
                }
                return {
                    error:false,
                    message:libAdmin
                }
            }
            libAdmin = await LibraryAdmin.findOne(query)
            if(!libAdmin){
                return {
                    error:true,
                    message:libAdmin
                }
            }
            return {
                error:false,
                message:libAdmin
            }
        } catch (e) {
            console.log(e)
            throw createError(e.message)
        }
    }

   
}

module.exports = new LibraryAdminService()