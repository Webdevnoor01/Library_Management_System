const LibraryCard = require("../../models/libraryCard")


class LibraryCardSearvice{

    async createCard({userName, depertment, issuDate,libraryId, bookLimit}){
        const libraryCard = await LibraryCard.create({
            userName, depertment, issuDate, libraryId, bookLimit
        })

        return libraryCard;
    }

    async findCard(){
        const libraryCards = await LibraryCard.find({})
        return libraryCards
    }

    async findCardById(libraryId){
        const libraryCard = await LibraryCard.findOne({libraryId:libraryId}).exec()
        return libraryCard
    }
}


const libraryCardSearvice = new LibraryCardSearvice()

module.exports = libraryCardSearvice 
