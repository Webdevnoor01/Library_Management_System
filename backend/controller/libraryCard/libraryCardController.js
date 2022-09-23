const libraryCardSearvice = require("../../service/libraryCardService/index")

class LibraryCard {

    async create(req, res, _next) {
        const {userName, depertment,issueDate, libraryId, bookLimit} = req.body
        try {
            const libraryCard  =await libraryCardSearvice.createCard({userName, depertment, issueDate, libraryId, bookLimit})

            res.status(200).json({ messsage: "Library Card created successfully", libraryCard })
        } catch (error) {
            res.status(500).json({
                errors:{
                    libraryCard:{
                        msg:error.message
                    }
                }
            })
        }
    }

   async findCard(_req, res, _next){
        const libraryCards = await libraryCardSearvice.findCard()
        try {
            if(libraryCards){

                res.status(200).json({
                    libraryCards
                })
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({
                errors:{
                    libraryCard:{
                        msg:"There is no library card"
                    }
                }
            }) 
        }

    }

    async findCardByLid(req, res, _next){
        const {libraryId } = req.params 
        try {
            const libraryCard = await libraryCardSearvice.findCardById(libraryId)
            if(libraryCard){
                res.status(200).json({
                    message:"Success",
                    libraryCard
                })
            }
            
        } catch (e) {
            res.status(400).json({
                errors:{
                    libraryCard:{
                        msg:"Library card not found for " +libraryId
                    }
                }
            })
        }
    }
}


const LibraryCardController = new LibraryCard()

module.exports = LibraryCardController