const LibraryStaff = require("../../models/libraryStaff")
const createError = require("http-errors")

class LibraryStaffService {
    async create(payload){
        try {
            const libraryStaff = await LibraryStaff.create(payload)
            console.log("LibraryStaff: ", libraryStaff)
            if(!libraryStaff){
                return {
                    error:true,
                    message:"There was a problem to create new staff"
                }
            }
            return{
                error:false,
                data:libraryStaff
            }
        } catch (e) {
            console.log(e)
            throw createError({
                message:e.message
            })
        }
    }

    async findLibraryStaffByProperty(key, value){
        try {
            const libraryStaff = await LibraryStaff.findOne({key:value}, "name email phone userRole")
            if(!libraryStaff){
                return{
                    error:true,
                    message:"Library staff not found"
                }
            }
            return {
                error:false,
                data:libraryStaff
            }
        } catch (e) {
            throw createError({
                message:e.message
            })
        }
    }

    
}

module.exports = new LibraryStaffService